'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'

export default function MonitorDashboard() {
  const { getToken } = useAuth()
  const [sessions, setSessions] = useState<any[]>([])
  const [batches, setBatches] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken()
      const headers = { Authorization: `Bearer ${token}` }
      const [sessRes, batchRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sessions`, { headers }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/batches`, { headers }),
      ])
      setSessions(sessRes.data)
      setBatches(batchRes.data)
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Programme Monitor</h1>
          <p className="text-yellow-600 text-xs bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-1.5 mt-2 inline-block">
            Read-only access — you cannot create, edit, or delete anything
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-500">Total batches</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{batches.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-500">Total sessions</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{sessions.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-500">Status</p>
            <p className="text-sm font-medium text-green-600 mt-1">Programme active</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-medium text-gray-900 mb-3">All Sessions</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100">
                <th className="text-left pb-2">Title</th>
                <th className="text-left pb-2">Batch</th>
                <th className="text-left pb-2">Date</th>
                <th className="text-left pb-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s: any) => (
                <tr key={s.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-2 text-gray-900">{s.title}</td>
                  <td className="py-2 text-gray-500">{s.batch?.name}</td>
                  <td className="py-2 text-gray-500">{new Date(s.date).toLocaleDateString()}</td>
                  <td className="py-2 text-gray-500">{s.startTime}–{s.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}