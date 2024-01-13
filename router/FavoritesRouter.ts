import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware'
import FavoritesController from '../controllers/FavoritesController'

const router = Router()

router.post('/:id', authMiddleware, FavoritesController.toggle)
router.get('/', authMiddleware, FavoritesController.getAll)

export default router