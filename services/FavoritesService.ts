import dbController from '../dbControllers/pgController'
import { DBController, IUser, Models } from '../types/types'

class FavoritesService {

  #dbController: DBController
  #model = Models.Favorites

  constructor(dnController: DBController) {
    this.#dbController = dbController
    for (const key in this) {
      if (this[key] === Function) this[key] = (this[key] as Function).bind(this)
    }
  }
  async create(UserId: number) {
    const find = await this.#dbController.find(this.#model, {UserId})
    if (find) {
      throw new Error('Favorites already exists')
    }

    return this.#dbController.create(this.#model, {UserId})
  }
  async toggle(UserId: number, ProductId: string) {

    const favorites = await this.#dbController.find(this.#model, {UserId})
    if (!favorites) {
      throw new Error('User doesn`t exist')
    }

    const find = await this.#dbController.find(Models.FavoriteProducts, {FavoriteId: favorites.id, ProductId})
    if (find) {
      return this.#dbController.remove(Models.FavoriteProducts, {field: 'id', value: find.id})
    }
    return this.#dbController.create(Models.FavoriteProducts, {FavoriteId: favorites.id, ProductId})
  }

  async getAll(user: IUser) {
    const favorites = await this.#dbController.find(this.#model, {UserId: user.id})
    const favoriteItems = await this.#dbController.getAll(Models.FavoriteProducts, {FavoriteId: favorites.id})

    return new Promise((res) => {

      const products = []

      const handleResponse = (r) => {
        products.push(r)
        if (products.length === favoriteItems.rows.length) res(products)
      }
      favoriteItems.rows.forEach(i => {
        this.#dbController.find(Models.Products, {id: i.dataValues.ProductId}).then(r => handleResponse(r))
      }, [])
    }) 
  }

  async isInFavorites(UserId:number, ProductId:number) {
    const favorites = await this.#dbController.find(this.#model, {UserId})
    return this.#dbController.find(Models.FavoriteProducts, {FavoriteId: favorites.id, ProductId})
  }
}

export default new FavoritesService(dbController)