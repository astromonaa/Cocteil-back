import dbController from '../dbControllers/pgController'
import { DBController, Models } from '../types/types'
import {SubCategory} from '../models/pgModels'

class CategoryService {

  #dbController:DBController;
  #model:Models = Models.Category

  constructor(dbController: DBController) {
    this.#dbController = dbController
  }

  async create(name:string) {
    if (!name) throw new Error('Invalid name')

    const candidate = await this.#dbController.find(this.#model, {name})

    if (candidate) throw new Error('Category exists')

    const category = await this.#dbController.create(this.#model, {name})
    return category
  }

  async createSub(name:string, CategoryId: number) {
    if (!name || !CategoryId) throw new Error('Invalid input data')

    const candidate = await this.#dbController.find(Models.SubCategory, {name, CategoryId})

    if (candidate) throw new Error('SubCategory in this Category exists')

    const sub = await this.#dbController?.create(Models.SubCategory, {name, CategoryId})
    return sub
  }

  async getAll() {
    return this.#dbController.getAll(this.#model, null, [Models.SubCategory])
  }

  async getAttrs() {
    return this.#dbController.getAttrs(this.#model)
  }
}

export default new CategoryService(dbController)