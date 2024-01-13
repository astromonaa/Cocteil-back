import { Response, NextFunction} from 'express'
import TokenService from '../services/TokenService'
import { ExtendedRequest } from '../types/types'

export default async function (req:ExtendedRequest, res:Response, next:NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
      req.user = null
      return next()
    }

    const accessToken = authorizationHeader.split(' ')[1]
    
    if (accessToken === 'null' || accessToken === 'undefined') {
      req.user = null
      return next()
    }
    const userData = await TokenService.validateAccessToken(accessToken)

    if (!userData) {
      req.user = null
      return next()
    }

    req.user = userData
    next();
  }catch(e) {
    next(e)
  }
}