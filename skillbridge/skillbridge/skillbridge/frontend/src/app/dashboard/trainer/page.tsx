'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'

export default function TrainerDashboard() {
  const { getToken } = useAuth()
  const [sessions, setSessions] = useState<any[]>([])
  const [batches, setBatches] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [inviteUrl, setInviteUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', batchId: '', date: '', startTime: '', endTime: '' })

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = await getToken()
      const headers = { Authorization: `Bearer ${token}` }
      const [sessRes, batchRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sessions`, { headers }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/batches`, { headers }),
      ])
      setSessions(sessRes.data)
      setBatches(batchRes.data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch data'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [getToken])

  const createSession = async () => {
    try {
      const token = await getToken()
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sessions`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setShowForm(false)
      setForm({ title: '', batchId: '', date: '', startTime: '', endTime: '' })
      fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session')
    }
  }

  const generateInvite = async (batchId: string) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/batches/${batchId}/invite`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setInviteUrl(data.inviteUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate invite')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Trainer Dashboard</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            + Create Session
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {loading && (
          <div className="mb-6 p-8 bg-white rounded-xl border border-gray-100 text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        )}

        {/* Create Session Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
            <h2 className="font-medium text-gray-900 mb-4">New Session</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-gray-500">Title</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. HTML & CSS Basics"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Batch</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                  value={form.batchId}
                  onChange={e => setForm({ ...form, batchId: e.target.value })}
                >
                  <option value="">Select batch</option>
                  {batches.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Start time</label>
                <input
                  type="time"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                  value={form.startTime}
                  onChange={e => setForm({ ...form, startTime: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">End time</label>
                <input
                  type="time"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                  value={form.endTime}
                  onChange={e => setForm({ ...form, endTime: e.target.value })}
                />
              </div>
            </div>
            <button
              onClick={createSession}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Create Session
            </button>
          </div>
        )}

        {/* Invite Links */}
        {batches.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
            <h2 className="font-medium text-gray-900 mb-3">Batch Invite Links</h2>
            {batches.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">{b.name}</span>
                <button
                  onClick={() => generateInvite(b.id)}
                  className="text-xs text-blue-600 border border-blue-200 px-3 py-1 rounded-lg"
                >
                  Generate Link
                </button>
              </div>
            ))}
            {inviteUrl && (
              <div className="mt-3 bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Invite URL (share with students):</p>
                <p className="text-sm text-blue-600 break-all">{inviteUrl}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(inviteUrl)}
                  className="text-xs text-gray-500 mt-1"
                >
                  Copy
                </button>
              </div>
            )}
          </div>
        )}

        {/* Sessions List */}
        <div>
          <h2 className="font-medium text-gray-900 mb-3">My Sessions</h2>
          {sessions.length === 0 ? (
            <p className="text-gray-500 text-sm">No sessions yet. Create one above.</p>
          ) : (
            <div className="space-y-2">
              {sessions.map((s: any) => (
                <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{s.title}</p>
                    <p className="text-xs text-gray-500">{s.batch?.name} · {new Date(s.date).toLocaleDateString()} · {s.startTime}–{s.endTime}</p>
                  </div>
                  <span className="text-xs text-gray-400">{s._count?.attendance || 0} marked</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}