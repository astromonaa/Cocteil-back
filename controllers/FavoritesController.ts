import {Request, Response, NextFunction} from 'express'
import FavoritesService from '../services/FavoritesService'
import { ExtendedRequest } from '../types/types'

class FavoritesController {


  async toggle(req:ExtendedRequest, res: Response, next:NextFunction) {
    try {
      const {id} = req.params
      const fav = await FavoritesService.toggle(req.user.id, id)
      return res.json(fav)
    }catch(e) {
      return res.status(404).send({message: e.message})
    }
  }

  async getAll(req:ExtendedRequest, res: Response, next:NextFunction) {
    try {
      const fav = await FavoritesService.getAll(req.user)
      return res.json(fav)
    }catch(e) {
      return res.status(404).send({message: e.message})
    }
  }
}

export default new FavoritesController()