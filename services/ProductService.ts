import {v4} from 'uuid'
import path from 'path'
import * as models from '../models/pgModels'
import dbController from '../dbControllers/pgController'
import { DBController, IUser, Models } from '../types/types'

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import CartService from './CartService'
import FavoritesService from './FavoritesService'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ProductService {
  #dbController:DBController
  #model:Models = Models.Products

  constructor(dbController:DBController){
    this.#dbController = dbController
  }

  async create (name:string, description:string, sizes:string, colors: string, price:number, rating:number, images:any, CategoryId:number, SubCategoryId:number) {
    if (!name || !description || !sizes || !colors || !price || !rating || !images || !CategoryId){
      throw new Error('Invalid product data')
    }

    const candidate = await this.#dbController.find(this.#model, {name})
    if (candidate) throw new Error('Product name exist')

    const files = images.reduce((acc, image:any) => {
      const fileName = image.name + v4() + '.jpg'
      image.mv(path.resolve(__dirname, '..', 'static', fileName))

      acc.push(fileName)
      return acc

    }, []);
  
    const data:any = {name, description, price, rating, images: files, sizes: JSON.parse(sizes), colors: JSON.parse(colors), CategoryId}

    if (Number(SubCategoryId)) data.SubCategoryId = SubCategoryId

    const product = await this.#dbController.create(this.#model, data)
    return product;
  }


  async getAll(user:IUser) {
    const products = await this.#dbController.getAll(this.#model)
    if (!user) {
      return products
    }
    
    const cart = await this.#dbController.find(Models.Cart, {UserId: user.id})

   

    return new Promise((res, _) => {
      const handleProductInCart = (product, cartProduct) => {
        product.dataValues.isInCart = !!cartProduct
      }

      const handleProductInFavorite = (product, favorite) => {
        product.dataValues.favorite = !!favorite
        if(product.id === products.rows.at(-1).id) res(products)
      }
  
      products.rows.forEach(async product => {
        CartService.isInCart(product.id, cart.id)
        .then(cartProduct => handleProductInCart(product, cartProduct))

        FavoritesService.isInFavorites(user.id, product.id)
        .then(favorite => handleProductInFavorite(product, favorite))
      });
    })
  }

  async getOne(id:string, user: IUser) {
    const product = await this.#dbController.find(this.#model, {id}, [
      Models.Category,
      Models.SubCategory,
    ])
    
    if (!user) {
      return product
    }
    const cart = await this.#dbController.find(Models.Cart, {UserId: user.id})
    const cartProduct = await CartService.isInCart(product.id, cart.id)

    const favorite = await FavoritesService.isInFavorites(user.id, product.id)

    product.dataValues.isInCart = !!cartProduct
    product.dataValues.favorite = !!favorite
    return product
  }

  async getAttrs() {
    return this.#dbController.getAttrs(this.#model)
  }
}

export default new ProductService(dbController)