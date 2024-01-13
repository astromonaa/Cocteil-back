import {Router} from 'express'
import UserController from '../controllers/UserController'
import checkRole from '../middleware/checkRoleMiddleware'

const router = Router()

router.get('/', UserController.getAll)
router.get('/auth', UserController.auth)
router.get('/activate/:link', UserController.activate)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
router.post('/registration', UserController.registration)
router.delete('/:id', checkRole('ADMIN'), UserController.remove)
router.get('/attrs', UserController.getAttrs)


export default router