'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'

export default function InstitutionDashboard() {
  const { getToken } = useAuth()
  const [batches, setBatches] = useState<any[]>([])
  const [summaries, setSummaries] = useState<{[key: string]: any}>({})

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken()
      const headers = { Authorization: `Bearer ${token}` }
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/batches`, { headers })
      setBatches(data)

      // Fetch summary for each batch
      for (const batch of data) {
        try {
          const { data: summary } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/batches/${batch.id}/summary`,
            { headers }
          )
          setSummaries(prev => ({ ...prev, [batch.id]: summary }))
        } catch {}
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Institution Dashboard</h1>

        {batches.length === 0 ? (
          <p className="text-gray-500">No batches found.</p>
        ) : (
          <div className="space-y-4">
            {batches.map((batch: any) => {
              const summary = summaries[batch.id]
              return (
                <div key={batch.id} className="bg-white rounded-xl border border-gray-100 p-5">
                  <h2 className="font-medium text-gray-900">{batch.name}</h2>
                  {summary ? (
                    <>
                      <p className="text-sm text-gray-500 mt-1">{summary.totalSessions} sessions total</p>
                      <table className="w-full text-sm mt-3">
                        <thead>
                          <tr className="text-xs text-gray-500 border-b border-gray-100">
                            <th className="text-left pb-2">Student</th>
                            <th className="text-left pb-2">Present</th>
                            <th className="text-left pb-2">Total</th>
                            <th className="text-left pb-2">Attendance %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {summary.summary.map((row: any, i: number) => (
                            <tr key={i} className="border-b border-gray-50 last:border-0">
                              <td className="py-2 text-gray-900">{row.student}</td>
                              <td className="py-2 text-gray-500">{row.present}</td>
                              <td className="py-2 text-gray-500">{row.total}</td>
                              <td className="py-2">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                  row.percentage >= 75 ? 'bg-green-100 text-green-700' :
                                  row.percentage >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {row.percentage}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 mt-2">Loading summary...</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
