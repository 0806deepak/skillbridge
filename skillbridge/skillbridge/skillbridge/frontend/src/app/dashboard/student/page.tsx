'use client'
import { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import axios from 'axios'

export default function StudentDashboard() {
  const { getToken } = useAuth()
  const { user } = useUser()
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState<string | null>(null)

  const fetchSessions = async () => {
    const token = await getToken()
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sessions`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setSessions(data)
    setLoading(false)
  }

  useEffect(() => { fetchSessions() }, [])

  const markAttendance = async (sessionId: string, status: string) => {
    setMarking(sessionId)
    try {
      const token = await getToken()
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/attendance/mark`,
        { sessionId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await fetchSessions()
    } catch (error) {
      alert('Failed to mark attendance')
    } finally {
      setMarking(null)
    }
  }

  if (loading) return <div className="p-8 text-gray-500">Loading sessions...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Sessions</h1>
          <p className="text-gray-500 text-sm">Welcome, {user?.firstName}</p>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">
            No sessions yet. Ask your trainer for an invite link to join a batch.
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session: any) => {
              const myAttendance = session.attendance?.[0]
              const alreadyMarked = !!myAttendance

              return (
                <div key={session.id} className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{session.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {session.batch?.name} · {new Date(session.date).toLocaleDateString()} · {session.startTime}–{session.endTime}
                      </p>
                      <p className="text-sm text-gray-400">Trainer: {session.trainer?.name}</p>
                    </div>

                    <div className="text-right">
                      {alreadyMarked ? (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          myAttendance.status === 'PRESENT' ? 'bg-green-100 text-green-700' :
                          myAttendance.status === 'LATE' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {myAttendance.status}
                        </span>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => markAttendance(session.id, 'PRESENT')}
                            disabled={marking === session.id}
                            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
                          >
                            Present
                          </button>
                          <button
                            onClick={() => markAttendance(session.id, 'LATE')}
                            disabled={marking === session.id}
                            className="text-xs bg-yellow-500 text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
                          >
                            Late
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}