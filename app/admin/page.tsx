"use client"

import { Fragment, useEffect, useMemo, useState } from "react"
import { Header } from "@/components/boty/header"
import { Search, Download, RefreshCw, LogOut, ChevronDown, ChevronUp } from "lucide-react"

type Lead = {
  id: string
  createdAt: string
  status: "new" | "contacted" | "won" | "lost"
  source: string
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

const STATUS_OPTIONS: Lead["status"][] = ["new", "contacted", "won", "lost"]

const STATUS_COLORS: Record<Lead["status"], string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  contacted: "bg-amber-100 text-amber-800 border-amber-200",
  won: "bg-green-100 text-green-800 border-green-200",
  lost: "bg-stone-200 text-stone-700 border-stone-300",
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null)
  const [tokenInput, setTokenInput] = useState("")
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<"all" | Lead["status"]>("all")
  const [cityFilter, setCityFilter] = useState("")
  const [search, setSearch] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("nepvic_admin_token") : null
    if (saved) setToken(saved)
  }, [])

  const loadLeads = async (tk: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/leads", {
        headers: { Authorization: `Bearer ${tk}` },
      })
      if (res.status === 401) {
        setError("Invalid token. Please sign in again.")
        setToken(null)
        localStorage.removeItem("nepvic_admin_token")
        return
      }
      const data = await res.json()
      if (!data.ok) {
        setError(data.error || "Failed to load leads")
        return
      }
      setLeads(data.leads || [])
    } catch (e: any) {
      setError(e?.message || "Network error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) loadLeads(token)
  }, [token])

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenInput.trim()) return
    localStorage.setItem("nepvic_admin_token", tokenInput.trim())
    setToken(tokenInput.trim())
  }

  const handleSignOut = () => {
    localStorage.removeItem("nepvic_admin_token")
    setToken(null)
    setLeads([])
  }

  const updateLead = async (id: string, patch: Partial<Pick<Lead, "status" | "notes">>) => {
    if (!token) return
    const res = await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, ...patch }),
    })
    const data = await res.json()
    if (data.ok) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)))
    } else {
      alert(data.error || "Update failed")
    }
  }

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false
      if (cityFilter && !(l.city || "").toLowerCase().includes(cityFilter.toLowerCase())) return false
      if (search) {
        const blob = `${l.firstName || ""} ${l.lastName || ""} ${l.email || ""} ${l.phone || ""} ${l.productName || ""}`.toLowerCase()
        if (!blob.includes(search.toLowerCase())) return false
      }
      return true
    })
  }, [leads, statusFilter, cityFilter, search])

  const stats = useMemo(() => {
    const counts = { total: leads.length, new: 0, contacted: 0, won: 0, lost: 0 }
    leads.forEach((l) => (counts[l.status] = (counts[l.status] || 0) + 1))
    return counts
  }, [leads])

  const exportCSV = () => {
    const header = [
      "id",
      "createdAt",
      "status",
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
      "productName",
      "size",
      "quantity",
      "unitPrice",
      "subtotal",
      "notes",
    ]
    const escape = (v: any) => {
      if (v == null) return ""
      const s = String(v).replace(/"/g, '""')
      return /[",\n]/.test(s) ? `"${s}"` : s
    }
    const rows = filtered.map((l) => header.map((h) => escape((l as any)[h])).join(","))
    const csv = [header.join(","), ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `nepvic-leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ---------------- UI ----------------

  if (!token) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-md mx-auto bg-card rounded-3xl p-8 boty-shadow">
            <h1 className="font-serif text-3xl text-foreground mb-2">Admin Sign In</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your admin token to view the lead dashboard.
            </p>
            <form onSubmit={handleSignIn} className="space-y-4">
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Admin token"
                className="w-full px-4 py-3 rounded-2xl bg-background border border-border/40 focus:border-foreground focus:outline-none text-foreground"
              />
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-full font-medium hover:bg-primary/90 boty-transition"
              >
                Sign In
              </button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </form>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="font-serif text-3xl text-foreground">Leads Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {stats.total} total · {stats.new} new · {stats.contacted} contacted · {stats.won} won · {stats.lost} lost
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => token && loadLeads(token)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-border/40 hover:bg-foreground/5 boty-transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={exportCSV}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-foreground text-background hover:bg-foreground/90 boty-transition"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-border/40 hover:bg-foreground/5 boty-transition"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-3xl p-5 mb-6 boty-shadow flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, phone, product..."
                className="w-full pl-9 pr-3 py-2 rounded-full bg-background border border-border/40 text-sm focus:outline-none focus:border-foreground"
              />
            </div>
            <input
              type="text"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              placeholder="Filter by city"
              className="px-4 py-2 rounded-full bg-background border border-border/40 text-sm focus:outline-none focus:border-foreground w-[180px]"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 rounded-full bg-background border border-border/40 text-sm focus:outline-none focus:border-foreground"
            >
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Errors */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 text-sm mb-6">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="bg-card rounded-3xl boty-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-background/50 border-b border-border/40">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">When</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Contact</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">City</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Total</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-16 text-muted-foreground">
                        Loading...
                      </td>
                    </tr>
                  )}
                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-16 text-muted-foreground">
                        No leads yet. Submit a test reservation from the shop to see it here.
                      </td>
                    </tr>
                  )}
                  {filtered.map((l) => {
                    const expanded = expandedId === l.id
                    return (
                      <Fragment key={l.id}>
                        <tr
                          className="border-b border-border/30 hover:bg-background/40 cursor-pointer"
                          onClick={() => setExpandedId(expanded ? null : l.id)}
                        >
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                            {new Date(l.createdAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="px-4 py-3 text-foreground">
                            {l.firstName} {l.lastName}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            <div>{l.email}</div>
                            <div className="text-xs">{l.phone}</div>
                          </td>
                          <td className="px-4 py-3 text-foreground">{l.city}</td>
                          <td className="px-4 py-3 text-foreground">
                            {l.productName}
                            <div className="text-xs text-muted-foreground">
                              {l.size} · Qty {l.quantity}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-foreground">Rs. {l.subtotal}</td>
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={l.status}
                              onChange={(e) => updateLead(l.id, { status: e.target.value as Lead["status"] })}
                              className={`px-2 py-1 rounded-full text-xs border ${STATUS_COLORS[l.status]} focus:outline-none`}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </td>
                        </tr>
                        {expanded && (
                          <tr className="bg-background/30 border-b border-border/30">
                            <td colSpan={8} className="px-6 py-5">
                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                                    Shipping address
                                  </h4>
                                  <p className="text-sm text-foreground leading-relaxed">
                                    {l.firstName} {l.lastName}
                                    <br />
                                    {l.address}
                                    <br />
                                    {l.city}, {l.state} - {l.pincode}
                                    <br />
                                    {l.phone}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                                    Notes
                                  </h4>
                                  <textarea
                                    defaultValue={l.notes || ""}
                                    onBlur={(e) => {
                                      if (e.target.value !== (l.notes || "")) {
                                        updateLead(l.id, { notes: e.target.value })
                                      }
                                    }}
                                    placeholder="Click to add notes about this lead..."
                                    className="w-full min-h-[80px] px-3 py-2 rounded-xl bg-background border border-border/40 text-sm focus:outline-none focus:border-foreground"
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
