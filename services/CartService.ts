import dbController from '../dbControllers/pgController'
import { DBController, IUser, Models } from '../types/types'

class CartService {
  #dbController:DBController
  #model=Models.CartProduct

  constructor(dbController:DBController) {
    this.#dbController = dbController
    for (const key in this) {
      if (this[key] === Function) this[key] = (this[key] as Function).bind(this)
    }
  }


  async getAll(user:IUser) {
    const cart = await this.#dbController.find(Models.Cart, {UserId: user.id})
    const cartProducts = await this.#dbController.getAll(this.#model, {CartId: cart.id})

    const response = {
      products: [],
      totalPrice: 0
    }

    if (!cartProducts.rows.length) return response

    return new Promise((res) => {

      const handleResponse = (r, i) => {
        response.products.push({...r.dataValues, color: i.color, size: i.size})
        response.totalPrice += r.price
        if (response.products.length === cartProducts.rows.length) res(response)
      }
      cartProducts.rows.forEach(i => {
        this.#dbController.find(Models.Products, {id: i.dataValues.ProductId}).then(r => handleResponse(r, i))
      }, [])
    }) 
  }

  async create(UserId) {
    return this.#dbController.create(Models.Cart, {UserId})
  }

  async add(ProductId:number, user:IUser, size: string, color: string){    
    const cart = await this.#dbController.find(Models.Cart, {UserId: user.id})

    if (!cart) {
      throw new Error('Unauthorized! Cart not Found')
    }

    const cartProduct = await this.isInCart(ProductId, cart.id)

    if (cartProduct) {
      return this.#dbController.update(cartProduct, {quantity: cartProduct.quantity + 1})
    }

    return this.#dbController.create(this.#model, {CartId: cart.id, ProductId, quantity: 1, color, size})
  }

  async delete (ProductId:number, user:IUser, deleteAll = false) {
    const cart = await this.#dbController.find(Models.Cart, {UserId: user.id})

    const cartProduct = await this.#dbController.find(this.#model, {ProductId, CartId: cart.id})
    
    if (!cartProduct) {
      throw new Error('Product has not been added to cart')
    }
    if (deleteAll || cartProduct.quantity === 1) {
      return this.#dbController.remove(this.#model, {field: 'id', value: cartProduct.id})
    }
    return this.#dbController.update(cartProduct, {quantity: cartProduct.quantity - 1})
  }

  async isInCart(ProductId: number, CartId: number) {
    return this.#dbController.find(this.#model, {ProductId, CartId})
  }
}


export default new CartService(dbController)