import { DBController, IUser, Models } from "../types/types"
import dbController from '../dbControllers/pgController'
import bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import { UserDto } from "../dtos/userDto";
import TokenService from "./TokenService";
import MailService from "./MailService";
import CartService from "./CartService";
import FavoritesService from "./FavoritesService";

interface IUserService {
  getAll: (req: any, res: any, next: () => void) => unknown;
  registration: (email:string, password: string) => Promise<any>
}

class UserService implements IUserService {
  #dbController: DBController;
  #model=Models.Users

  constructor(dbController: DBController) {
    this.#dbController = dbController;
    for (const key in this) {
      if (this[key] === Function) this[key] = (this[key] as Function).bind(this)
    }
  }

  async getAll() {
    return this.#dbController.getAll(this.#model)
  }
  async registration(email: string, password: string | number) {
    if (!email || !password) {
      throw new Error('email or password is invalid')
    }

    const candidate = await this.#dbController.find(this.#model, {email})
    
    if (candidate){
      throw new Error('Email already exists')
    }

    const activationLink = uuid.v4()

    const hashPassword = await bcrypt.hash(password.toString(), 5) //creating password hash

    const user = await this.#dbController.create(this.#model, {email, password: hashPassword, activationLink}) // user create

    await CartService.create(user.id) // creating user cart
    await FavoritesService.create(user.id)
    
    const userData = new UserDto(user as IUser)
    
    const tokens = await TokenService.generateTokens({...userData})
    await TokenService.saveToken(this.#dbController, userData.id, tokens.refreshToken)
    await MailService.sendActivationLink(userData.email, activationLink)

    return {...userData, ...tokens}

    
  }

  async remove(id:number) {
    
    const deleted = await this.#dbController.remove(this.#model, {field: 'id', value: id})
    return deleted
  }

  async activate(link:string) {
    const candidate = await this.#dbController.find(this.#model, {activationLink: link})
    
    if (!candidate) throw new Error('link deprecated')
    
    const activated = await this.#dbController.update(candidate, {isActivated: true})
    return activated
  }

  async login(email:string, password:string) {
    if (!email || !password) {
      throw new Error('email or password is invalid')
    }

    const user = await this.#dbController.find(this.#model, {email})

    if (!user) throw new Error('User not exist')

    const isEqual = await bcrypt.compare(password.toString(), user.password)

    if (!isEqual) throw new Error('Invalid password')

    const userData = new UserDto(user)

    const tokens = await TokenService.generateTokens({...userData})
    await TokenService.saveToken(this.#dbController, userData.id, tokens.refreshToken)

    
    return {...userData, ...tokens}

  }

  async auth(refreshToken:string) {
    const token = await TokenService.validateRefreshToken(refreshToken)
    if (!token) {
      throw new Error('Unauthorized')
    }
    const tokenIsFromDb = this.#dbController.find(Models.Tokens, {refreshToken})
    
    if (!tokenIsFromDb) {
      throw new Error('Unauthorized')
    }

    const user = await this.#dbController.find(this.#model, {id: token.id})
    
    const userData = new UserDto(user as IUser)

    const tokens = await TokenService.generateTokens({...userData})
    await TokenService.saveToken(this.#dbController, userData.id, tokens.refreshToken)

    return {...userData, ...tokens}
  }

  async logout(refreshToken: string) {
    return TokenService.removeToken(refreshToken)
  }

  async getAttrs() {
    return this.#dbController.getAttrs(this.#model)
  }
}

export default new UserService(dbController)