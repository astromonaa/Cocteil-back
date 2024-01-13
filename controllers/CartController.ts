import { Response, NextFunction} from 'express'
import CartService from '../services/CartService'
import { ExtendedRequest } from '../types/types'


class CartController {


  async getAll(req:ExtendedRequest, res:Response, next:NextFunction) {
    try {
      const cartProducts = await CartService.getAll(req.user)
      return res.json(cartProducts)
    }catch(e) {
      res.status(404).send({message: e.message})
    }
  }

  async add (req:ExtendedRequest, res:Response, next:NextFunction) {
    try {
      const {id} = req.params
      const {size, color} = req.body
      const cartProduct = await CartService.add(+id, req.user, size, color)
      return res.json(cartProduct)
    }catch(e) {
      return res.json(e.message)
    }
  }

  async delete (req:ExtendedRequest, res:Response, next:NextFunction) {
    try {
      const {deleteAll} = req.body
      const {id} = req.params
      const deleted = await CartService.delete(+id, req.user, deleteAll)
      return res.json(deleted)
    }catch(e) {
      return res.json(e.message)
    }
  }
}

export default new CartController()