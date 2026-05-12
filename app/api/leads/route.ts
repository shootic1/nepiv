import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Stage = "contact" | "address" | "complete"

type LeadInput = {
  // identity
  id?: string                    // if provided, this is an update
  // contact (step 1)
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  // address (step 2)
  address?: string
  city?: string
  state?: string
  pincode?: string
  // product context
  productId?: string
  productName?: string
  size?: string
  quantity?: number
  unitPrice?: number
  subtotal?: number
  // misc
  notes?: string
  stage?: Stage
}

type StoredLead = Omit<LeadInput, "id"> & {
  id: string
  createdAt: string
  updatedAt: string
  status: "new" | "contacted" | "won" | "lost"
  source: string
  stage: Stage
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}

// ---------- Google Sheets adapter ----------
async function appendToSheet(lead: StoredLead, op: "create" | "update"): Promise<{ ok: boolean; error?: string }> {
  const url = process.env.LEADS_WEBHOOK_URL
  if (!url) return { ok: false, error: "LEADS_WEBHOOK_URL not set" }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op, ...lead }),
    })
    if (!res.ok) return { ok: false, error: `Webhook returned ${res.status}` }
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err?.message || "Webhook fetch failed" }
  }
}

// ---------- In-memory store (per server instance) ----------
declare global {
  // eslint-disable-next-line no-var
  var __nepvicLeads: StoredLead[] | undefined
}
const memoryStore: StoredLead[] = (globalThis.__nepvicLeads ||= [])

export async function POST(req: NextRequest) {
  let body: LeadInput
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 })
  }

  const stage: Stage = body.stage || "contact"
  const isUpdate = Boolean(body.id)

  // ---------- UPDATE existing lead (Step 2) ----------
  if (isUpdate) {
    const idx = memoryStore.findIndex((l) => l.id === body.id)
    if (idx === -1) {
      // Lead not in memory (e.g. server cold-started). Fall back to creating new with the provided id.
      // This is acceptable because the sheet webhook will receive an update op anyway.
      const created: StoredLead = {
        id: body.id!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "new",
        source: "checkout",
        stage,
        firstName: body.firstName?.trim(),
        lastName: body.lastName?.trim(),
        email: body.email?.trim().toLowerCase(),
        phone: body.phone?.trim(),
        address: body.address?.trim(),
        city: body.city?.trim(),
        state: body.state?.trim(),
        pincode: body.pincode?.trim(),
        productId: body.productId,
        productName: body.productName,
        size: body.size,
        quantity: body.quantity ?? 1,
        unitPrice: body.unitPrice,
        subtotal: body.subtotal,
        notes: body.notes,
      }
      memoryStore.unshift(created)
      const sheet = await appendToSheet(created, "update")
      console.log("NEPVIC_LEAD_UPDATE_RECREATED", JSON.stringify({ ...created, _sheet: sheet.ok ? "ok" : sheet.error }))
      return NextResponse.json({ ok: true, id: created.id, stage: created.stage, sheet: sheet.ok ? "synced" : `local-only (${sheet.error})` })
    }
    const existing = memoryStore[idx]
    const merged: StoredLead = {
      ...existing,
      updatedAt: new Date().toISOString(),
      stage,
      // Only overwrite fields that are present in the update payload
      address: body.address?.trim() ?? existing.address,
      city: body.city?.trim() ?? existing.city,
      state: body.state?.trim() ?? existing.state,
      pincode: body.pincode?.trim() ?? existing.pincode,
      productId: body.productId ?? existing.productId,
      productName: body.productName ?? existing.productName,
      size: body.size ?? existing.size,
      quantity: body.quantity ?? existing.quantity,
      unitPrice: body.unitPrice ?? existing.unitPrice,
      subtotal: body.subtotal ?? existing.subtotal,
      notes: body.notes ?? existing.notes,
    }
    memoryStore[idx] = merged
    const sheet = await appendToSheet(merged, "update")
    console.log("NEPVIC_LEAD_UPDATE", JSON.stringify({ ...merged, _sheet: sheet.ok ? "ok" : sheet.error }))
    return NextResponse.json({ ok: true, id: merged.id, stage: merged.stage, sheet: sheet.ok ? "synced" : `local-only (${sheet.error})` })
  }

  // ---------- CREATE new lead (Step 1) ----------
  // Step 1 only requires firstName + email + phone
  const requiredErrors: string[] = []
  if (!body.firstName?.trim()) requiredErrors.push("firstName")
  if (!body.email?.trim() || !/\S+@\S+\.\S+/.test(body.email)) requiredErrors.push("email")
  if (!body.phone?.trim() || body.phone.trim().length < 7) requiredErrors.push("phone")
  if (requiredErrors.length) {
    return NextResponse.json(
      { ok: false, error: "Missing/invalid fields", fields: requiredErrors },
      { status: 422 }
    )
  }

  const lead: StoredLead = {
    id: newId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "new",
    source: "checkout",
    stage,
    firstName: body.firstName?.trim(),
    lastName: body.lastName?.trim(),
    email: body.email?.trim().toLowerCase(),
    phone: body.phone?.trim(),
    address: body.address?.trim(),
    city: body.city?.trim(),
    state: body.state?.trim(),
    pincode: body.pincode?.trim(),
    productId: body.productId,
    productName: body.productName,
    size: body.size,
    quantity: body.quantity ?? 1,
    unitPrice: body.unitPrice,
    subtotal: body.subtotal,
    notes: body.notes,
  }

  memoryStore.unshift(lead)
  if (memoryStore.length > 500) memoryStore.length = 500

  const sheet = await appendToSheet(lead, "create")
  console.log("NEPVIC_LEAD", JSON.stringify({ ...lead, _sheet: sheet.ok ? "ok" : sheet.error }))

  return NextResponse.json({
    ok: true,
    id: lead.id,
    stage: lead.stage,
    sheet: sheet.ok ? "synced" : `local-only (${sheet.error})`,
  })
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || ""
  const token = auth.replace(/^Bearer\s+/i, "")
  const expected = process.env.ADMIN_TOKEN
  if (!expected || token !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }
  return NextResponse.json({ ok: true, leads: memoryStore })
}

export async function PATCH(req: NextRequest) {
  const auth = req.headers.get("authorization") || ""
  const token = auth.replace(/^Bearer\s+/i, "")
  const expected = process.env.ADMIN_TOKEN
  if (!expected || token !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }
  let body: { id?: string; status?: StoredLead["status"]; notes?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 })
  }
  if (!body.id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 })
  const idx = memoryStore.findIndex((l) => l.id === body.id)
  if (idx === -1) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 })
  if (body.status) memoryStore[idx].status = body.status
  if (typeof body.notes === "string") memoryStore[idx].notes = body.notes
  memoryStore[idx].updatedAt = new Date().toISOString()
  return NextResponse.json({ ok: true, lead: memoryStore[idx] })
}
