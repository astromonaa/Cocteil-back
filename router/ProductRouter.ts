import {Router} from 'express'
import ProductController from '../controllers/ProductController'
import checkRole from '../middleware/checkRoleMiddleware'
import getUser from '../middleware/getUserMiddleware'


const router = Router()

router.post('/create', checkRole('ADMIN'), ProductController.create)
router.get('/', getUser, ProductController.getAll)
router.get('/attrs', ProductController.getAttrs)
router.get('/:id', getUser, ProductController.getOne)

export default router