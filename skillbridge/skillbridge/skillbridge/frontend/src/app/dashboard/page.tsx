'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function DashboardPage() {
  const { getToken } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = await getToken()
        const { data: user } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        // Route based on role
        switch (user.role) {
          case 'STUDENT': router.push('/dashboard/student'); break
          case 'TRAINER': router.push('/dashboard/trainer'); break
          case 'INSTITUTION': router.push('/dashboard/institution'); break
          case 'PROGRAMME_MANAGER': router.push('/dashboard/manager'); break
          case 'MONITORING_OFFICER': router.push('/dashboard/monitor'); break
          default: router.push('/onboarding')
        }
      } catch {
        router.push('/onboarding')
      } finally {
        setLoading(false)
      }
    }
    checkUser()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading your dashboard...</p>
    </div>
  )
}