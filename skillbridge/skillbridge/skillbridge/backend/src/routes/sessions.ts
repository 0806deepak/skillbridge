import { Router, Request, Response } from 'express'
import  prisma  from '../lib/prisma'
import { requireAuth, requireRole } from '../middleware/auth'

const router = Router()

// POST /sessions — Trainer creates a session
router.post('/', requireAuth, requireRole('TRAINER'), async (req: Request, res: Response) => {
  try {
    const { batchId, title, date, startTime, endTime } = req.body
    const trainer = req.user

    const session = await prisma.session.create({
      data: {
        batchId,
        trainerId: trainer.id,
        title,
        date: new Date(date),
        startTime,
        endTime,
      }
    })

    res.status(201).json(session)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create session' })
  }
})

// GET /sessions — list sessions for current user
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user
    let sessions: any[] = []

    if (user.role === 'TRAINER') {
      sessions = await prisma.session.findMany({
        where: { trainerId: user.id },
        include: { batch: true, _count: { select: { attendance: true } } }
      })
    } else if (user.role === 'STUDENT') {
      // Get batches student belongs to, then get sessions for those batches
      const studentBatches = await prisma.batchStudent.findMany({
        where: { studentId: user.id },
        select: { batchId: true }
      })
      const batchIds = studentBatches.map((b: { batchId: any }) => b.batchId)

      sessions = await prisma.session.findMany({
        where: { batchId: { in: batchIds } },
        include: {
          batch: true,
          trainer: { select: { name: true } },
          attendance: {
            where: { studentId: user.id }
          }
        }
      })
    } else {
      sessions = await prisma.session.findMany({
        include: { batch: true, trainer: { select: { name: true } } }
      })
    }

    res.json(sessions)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get sessions' })
  }
})

// GET /sessions/:id/attendance — Trainer views full attendance for a session
router.get('/:id/attendance', requireAuth, requireRole('TRAINER', 'INSTITUTION', 'PROGRAMME_MANAGER', 'MONITORING_OFFICER'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        attendance: {
          include: { student: { select: { name: true, email: true } } }
        },
        batch: {
          include: {
            students: {
              include: { student: { select: { id: true, name: true, email: true } } }
            }
          }
        }
      }
    })

    if (!session) return res.status(404).json({ error: 'Session not found' })

    // Build full list: enrolled students + their status (absent if not marked)
    const attendanceMap = new Map(session.attendance.map((a: { studentId: any; status: any }) => [a.studentId, a.status]))
    const fullAttendance = session.batch.students.map((bs: { student: { id: unknown } }) => ({
      student: bs.student,
      status: attendanceMap.get(bs.student.id) || 'ABSENT'
    }))

    res.json({ session, attendance: fullAttendance })
  } catch (error) {
    res.status(500).json({ error: 'Failed to get attendance' })
  }
})

export default router
