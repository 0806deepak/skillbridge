import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';
import crypto from 'crypto';
const router = Router();
// POST /batches — Trainer or Institution creates a batch
router.post('/', requireAuth, requireRole('TRAINER', 'INSTITUTION'), async (req, res) => {
    try {
        const { name } = req.body;
        const user = req.user;
        // Find or use institutionId
        const institutionId = user.institutionId;
        if (!institutionId) {
            return res.status(400).json({ error: 'User must belong to an institution to create batches' });
        }
        const batch = await prisma.batch.create({
            data: {
                name,
                institutionId,
            }
        });
        // If trainer, auto-link them to this batch
        if (user.role === 'TRAINER') {
            await prisma.batchTrainer.create({
                data: { batchId: batch.id, trainerId: user.id }
            });
        }
        res.status(201).json(batch);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create batch' });
    }
});
// POST /batches/:id/invite — Trainer generates invite link
router.post('/:id/invite', requireAuth, requireRole('TRAINER'), async (req, res) => {
    try {
        const { id } = req.params;
        const token = crypto.randomBytes(16).toString('hex');
        const batch = await prisma.batch.update({
            where: { id },
            data: { inviteToken: token }
        });
        const inviteUrl = `${process.env.FRONTEND_URL}/join?token=${token}`;
        res.json({ inviteUrl, token });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate invite' });
    }
});
// POST /batches/:id/join — Student joins via invite token
router.post('/:id/join', requireAuth, requireRole('STUDENT'), async (req, res) => {
    try {
        const { token } = req.body;
        const student = req.user;
        const batch = await prisma.batch.findUnique({ where: { inviteToken: token } });
        if (!batch) {
            return res.status(404).json({ error: 'Invalid invite link' });
        }
        // Check if already joined
        const existing = await prisma.batchStudent.findUnique({
            where: { batchId_studentId: { batchId: batch.id, studentId: student.id } }
        });
        if (existing) {
            return res.json({ message: 'Already in this batch', batch });
        }
        await prisma.batchStudent.create({
            data: { batchId: batch.id, studentId: student.id }
        });
        res.json({ message: 'Joined batch successfully', batch });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to join batch' });
    }
});
// GET /batches/:id/summary — Institution views attendance summary
router.get('/:id/summary', requireAuth, requireRole('INSTITUTION', 'PROGRAMME_MANAGER', 'MONITORING_OFFICER'), async (req, res) => {
    try {
        const { id } = req.params;
        const batch = await prisma.batch.findUnique({
            where: { id },
            include: {
                sessions: {
                    include: {
                        attendance: true
                    }
                },
                students: {
                    include: { student: true }
                }
            }
        });
        if (!batch)
            return res.status(404).json({ error: 'Batch not found' });
        const totalSessions = batch.sessions.length;
        const summary = batch.students.map((bs) => {
            const studentAttendance = batch.sessions.flatMap((s) => s.attendance.filter((a) => a.studentId === bs.studentId));
            const present = studentAttendance.filter((a) => a.status === 'PRESENT').length;
            return {
                student: bs.student.name,
                present,
                total: totalSessions,
                percentage: totalSessions ? Math.round((present / totalSessions) * 100) : 0
            };
        });
        res.json({ batchName: batch.name, totalSessions, summary });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get summary' });
    }
});
// GET /batches — list batches for current user
router.get('/', requireAuth, async (req, res) => {
    try {
        const user = req.user;
        let batches = [];
        if (user.role === 'TRAINER') {
            const trainerBatches = await prisma.batchTrainer.findMany({
                where: { trainerId: user.id },
                include: { batch: true }
            });
            batches = trainerBatches.map((tb) => tb.batch);
        }
        else if (user.role === 'STUDENT') {
            const studentBatches = await prisma.batchStudent.findMany({
                where: { studentId: user.id },
                include: { batch: true }
            });
            batches = studentBatches.map((sb) => sb.batch);
        }
        else if (user.role === 'INSTITUTION') {
            batches = await prisma.batch.findMany({
                where: { institutionId: user.institutionId }
            });
        }
        else {
            batches = await prisma.batch.findMany();
        }
        res.json(batches);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get batches' });
    }
});
export default router;
