import { Router } from 'express'
import CategoryController from '../controllers/CategoryController'
import authMiddleware from '../middleware/authMiddleware'
import checkRole from '../middleware/checkRoleMiddleware'

const router = Router()

router.post('/create', checkRole('ADMIN'), CategoryController.create)
router.post('/create/sub', checkRole('ADMIN'), CategoryController.createSub)
router.get('/', CategoryController.getAll)
router.get('/attrs', CategoryController.getAttrs)

export default router