import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello, Login!');
});

// Más rutas aquí...

export default router;