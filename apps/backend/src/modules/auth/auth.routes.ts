import { Router, Request, Response } from 'express';

const router = Router();

router.post('/register', (req: Request, res: Response) => {
  res.json({ message: 'Register endpoint' });
});

router.post('/login', (req: Request, res: Response) => {
  res.json({ message: 'Login endpoint' });
});

export default router;
