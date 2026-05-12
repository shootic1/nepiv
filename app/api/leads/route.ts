import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type LeadInput = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  productId?: string
  productName?: string
  size?: string
  quantity?: number
  unitPrice?: number
  subtotal?: number
  notes?: string
}

type StoredLead = LeadInput & {
  id: string
  createdAt: string
  status: "new" | "contacted" | "won" | "lost"
  source: string
}

function newId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 8)
  )
}

// ---------- Google Sheets adapter ----------
async function appendToSheet(lead: StoredLead): Promise<{ ok: boolean; error?: string }> {
  const url = process.env.LEADS_WEBHOOK_URL
  if (!url) return { ok: false, error: "LEADS_WEBHOOK_URL not set" }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    })
    if (!res.ok) return { ok: false, error: `Webhook returned ${res.status}` }
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err?.message || "Webhook fetch failed" }
  }
}

// ---------- In-memory fallback (per server instance) ----------
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

  // Basic validation
  const requiredErrors: string[] = []
  if (!body.firstName?.trim()) requiredErrors.push("firstName")
  if (!body.email?.trim() || !/\S+@\S+\.\S+/.test(body.email)) requiredErrors.push("email")
  if (!body.phone?.trim() || body.phone.trim().length < 7) requiredErrors.push("phone")
  if (!body.city?.trim()) requiredErrors.push("city")

  if (requiredErrors.length) {
    return NextResponse.json(
      { ok: false, error: "Missing/invalid fields", fields: requiredErrors },
      { status: 422 }
    )
  }

  const lead: StoredLead = {
    id: newId(),
    createdAt: new Date().toISOString(),
    status: "new",
    source: "checkout",
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

  // Persist
  memoryStore.unshift(lead)
  // Keep only the latest 500 in memory to avoid runaway growth
  if (memoryStore.length > 500) memoryStore.length = 500

  // Mirror to Google Sheets (or other webhook) if configured
  const sheetResult = await appendToSheet(lead)

  // ALWAYS log the full lead to stdout with a recognizable marker so it can be
  // recovered from Vercel runtime logs even if the webhook is unreachable.
  console.log("NEPVIC_LEAD", JSON.stringify({ ...lead, _sheet: sheetResult.ok ? "ok" : sheetResult.error }))

  return NextResponse.json({
    ok: true,
    id: lead.id,
    sheet: sheetResult.ok ? "synced" : `local-only (${sheetResult.error})`,
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
  return NextResponse.json({ ok: true, lead: memoryStore[idx] })
}
