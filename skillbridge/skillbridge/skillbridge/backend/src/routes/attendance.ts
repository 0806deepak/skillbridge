import { Router, Request, Response } from 'express'
import  prisma  from '../lib/prisma'
import { requireAuth, requireRole } from '../middleware/auth'

const router = Router()

// POST /attendance/mark — Student marks their own attendance
router.post('/mark', requireAuth, requireRole('STUDENT'), async (req: Request, res: Response) => {
  try {
    const { sessionId, status } = req.body
    const student = req.user

    // Verify student is enrolled in this session's batch
    const session = await prisma.session.findUnique({ where: { id: sessionId } })
    if (!session) return res.status(404).json({ error: 'Session not found' })

    const isEnrolled = await prisma.batchStudent.findUnique({
      where: { batchId_studentId: { batchId: session.batchId, studentId: student.id } }
    })

    if (!isEnrolled) {
      return res.status(403).json({ error: 'You are not enrolled in this batch' })
    }

    // Upsert: create or update attendance record
    const attendance = await prisma.attendance.upsert({
      where: { sessionId_studentId: { sessionId, studentId: student.id } },
      update: { status },
      create: { sessionId, studentId: student.id, status }
    })

    res.json(attendance)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to mark attendance' })
  }
})

export default router