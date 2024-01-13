import jwt from 'jsonwebtoken'
import { IUserDto } from '../dtos/userDto'
import { DBController } from '../types/types'
import { Models } from '../types/types'
import dbController from '../dbControllers/pgController'

class TokenService {

  #model=Models.Tokens
  #dbController: DBController

  constructor(dbController: DBController) {
    this.#dbController = dbController
  }

  async generateTokens(data: IUserDto) {
    
    const accessToken = await jwt.sign(data, process.env.ACCESS_SECRET_KEY, {expiresIn: '1d'})
    const refreshToken = await jwt.sign(data, process.env.REFRESH_SECRET_KEY, {expiresIn: '30d'})

    return {accessToken, refreshToken}
  }

  async validateRefreshToken(refreshToken:string) {
    try {
      const token = await jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY)
      return token
    }catch {
      return null
    }
  }

  async validateAccessToken(accessToken:string) {
    try {
      const token = await jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY)
      return token
    }catch {
      return null
    }
  }

  async saveToken(dbController:DBController, UserId:number, refreshToken:string) {
    const existsToken = await dbController.find(Models.Tokens, {refreshToken})

    if (existsToken) {
      return existsToken.update({refreshToken})
    }

    const token = await dbController.create(Models.Tokens, {UserId, refreshToken})
    return token
  }

  async removeToken(refreshToken: string) {
    return this.#dbController.remove(Models.Tokens, {field: 'refreshToken', value: refreshToken})
  }
}

export default new TokenService(dbController)