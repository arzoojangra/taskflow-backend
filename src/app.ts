import express from 'express';
import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import { connectDB } from './config/database';
// import { errorHandler } from './middleware/errorHandler';

// Route imports
// import authRoutes from './routes/auth';
// import projectRoutes from './routes/projects';
// import taskRoutes from './routes/tasks';

const app = express();

// Middleware
// app.use(helmet());
app.use(cors());
// app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api', taskRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
// app.use(errorHandler);

// 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ error: 'Route not found' });
// });

export default app;
