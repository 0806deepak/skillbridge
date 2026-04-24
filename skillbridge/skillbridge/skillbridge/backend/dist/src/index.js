import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import userRoutes from './routes/users';
import batchRoutes from './routes/batches';
import sessionRoutes from './routes/sessions';
import attendanceRoutes from './routes/attendance';
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000', '*'],
    credentials: true,
}));
app.use(express.json());
// Routes
app.use('/users', userRoutes);
app.use('/batches', batchRoutes);
app.use('/sessions', sessionRoutes);
app.use('/attendance', attendanceRoutes);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
