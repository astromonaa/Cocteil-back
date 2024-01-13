import {Router} from 'express'
import CartRouter from './CartRouter'
import UserRouter from './UserRouter'
import ProductsRouter from './ProductRouter'
import CategoryRouter from './CategoryRouter'
import FavoritesRouter from './FavoritesRouter'

const router = Router()

router.use('/cart', CartRouter)
router.use('/users', UserRouter)
router.use('/products', ProductsRouter)
router.use('/category', CategoryRouter)
router.use('/favorites', FavoritesRouter)

export default router