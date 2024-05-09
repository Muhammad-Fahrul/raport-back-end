import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import corsOption from '../config/corsOption.js';
import authRoutes from '../routes/authRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import studentRoutes from '../routes/studentRoutes.js';
import raportRoutes from '../routes/raportRoutes.js';
import raportBuilderRoutes from '../routes/raportBuilderRoutes.js';

import { errorHandler, notFound } from '../middleware/errorMiddleware.js';

const app = express();
app.use(cookieParser());
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/raports', raportRoutes);
app.use('/api/raportBuilder', raportBuilderRoutes);

app.all('*', (req, res) => {
  const __dirname = path.resolve();
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use(notFound);
app.use(errorHandler);

export default app;
