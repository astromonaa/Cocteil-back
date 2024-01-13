import { NextFunction, Request, Response } from 'express';
import ProductService from '../services/ProductService';
import { ExtendedRequest } from '../types/types';

class ProductController {

  async create(req, res, next) {
    try {
      const {name, description, sizes, colors, price, rating, CategoryId, SubCategoryId} = req.body;
      const {images} = req.files || {images: null}

      const product = await ProductService.create(name, description, sizes, colors, price, rating, images, CategoryId, SubCategoryId)
      res.json(product)
    }catch(e) {
      return res.status(404).json({message:e.message})
    }
  }

  async getAll(req:ExtendedRequest, res:Response, next:NextFunction) {
    try {
      const products = await ProductService.getAll(req.user)
      return res.json(products)
    }catch(e) {
      return res.json(e.message)
    }
  }

  async getOne(req:ExtendedRequest, res:Response, next:NextFunction) {
    try {
      const {id} = req.params
      const product = await ProductService.getOne(id, req.user)
      return res.json(product)
    }catch(e) {
      return res.status(404).json({message: e.message})
    }
  }

  async getAttrs(req:Request, res:Response, next:NextFunction) {
    try {
      const attrs = await ProductService.getAttrs()
      return res.json(attrs)
    }catch(e) {
      next(e)
    }
  }
}

export default new ProductController()