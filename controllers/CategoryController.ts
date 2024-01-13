import { NextFunction, Response, Request, response } from "express";
import CategoryService from "../services/CategoryService";

class CategoryController {

  async create(req:Request, res:Response, next:NextFunction) {
    try {
      const {name} = req.body
      const category = await CategoryService.create(name)
      return res.json(category)
    }catch(e) {
      return res.json(e.message)
    }
  }

  async createSub(req:Request, res:Response, next:NextFunction) {
    try {
      const {name, CategoryId} = req.body;

      const sub = await CategoryService.createSub(name, CategoryId)
      return res.json(sub)

    }catch(e) {
      return res.status(404).send({message: e.message})
    }
  }

  async getAll(req:Request, res:Response, next:NextFunction) {
    try {
      const categories = await CategoryService.getAll()
      return res.json(categories)
    }catch(e) {
      return res.json(e.message)
    }
  }

  async getAttrs(req:Request, res:Response, next:NextFunction) {
    try {
      const attrs = await CategoryService.getAttrs()
      return res.json(attrs)
    }catch(e) {
      next(e)
    }
  }
}

export default new CategoryController()