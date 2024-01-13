import { Router } from 'express'
import CartController from '../controllers/CartController'
import authMiddleware from '../middleware/authMiddleware'

const router = Router()

router.get('/', authMiddleware, CartController.getAll)
router.post('/:id', authMiddleware, CartController.add)
router.delete('/:id', authMiddleware, CartController.delete)

export default router