import express, { Request, Response } from 'express'
import initDB from './config/db'
import { authRoutes } from './modules/auth/auth.routes';
const app = express()

initDB();

app.use(express.json())

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

app.use('/api/v1/auth', authRoutes)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found!",
    path: req.path,
  });
});

export default app;