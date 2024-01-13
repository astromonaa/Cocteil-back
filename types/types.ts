import { Model } from "sequelize"
import { Request } from "express";

export enum Models {
  Users = 'Users',
  Tokens = 'Tokens',
  Products = 'Products',
  Category = 'Categories',
  SubCategory = 'SubCategories',
  Cart = 'Carts',
  CartProduct = 'CartProducts',
  Favorites = 'Favorites',
  FavoriteProducts = 'FavoriteProducts'
}

export interface IOptions {
  [key: string]: number | string | boolean
}

export type removeOptions = {
  field: string;
  value: string | number
}


export interface DBController {
  getAll: (modelName: Models, options?: object, includeOptions?: string[]) => any,
  create: (modelName: Models, data: Record<string, unknown>) => any,
  remove: (modelName: Models, options:removeOptions) => Promise<any>,
  find: (modelName: Models, options: IOptions, includeOptions?: string[]) => Promise<any>
  update: (localModel: Model, options: IOptions) => Promise<Model>
  getAttrs: (modelName: Models) => Promise<any>
}

export interface IUser {
  role: string
  isActivated: boolean
  id: number
  email: string
  password: string
  activationLink: string
  updatedAt: string
  createdAt: string
}

export interface ExtendedRequest extends Request {
  user: IUser
}