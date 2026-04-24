import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';
const router = Router();
// POST /users/register — called after Clerk signup to save user in our DB
router.post('/register', async (req, res) => {
    try {
        const { clerkUserId, name, email, role } = req.body;
        if (!clerkUserId || !name || !email || !role) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const validRoles = ['STUDENT', 'TRAINER', 'INSTITUTION', 'PROGRAMME_MANAGER', 'MONITORING_OFFICER'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }
        // Check if already registered
        const existing = await prisma.user.findUnique({ where: { clerkUserId } });
        if (existing) {
            return res.json(existing);
        }
        const user = await prisma.user.create({
            data: { clerkUserId, name, email, role }
        });
        res.status(201).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});
// GET /users/me — get current user's profile
router.get('/me', requireAuth, async (req, res) => {
    res.json(req.user);
});
export default router;
