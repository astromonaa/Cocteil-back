import { Response, NextFunction} from 'express'
import TokenService from '../services/TokenService'
import { ExtendedRequest } from '../types/types'

export default async function (req:ExtendedRequest, res:Response, next:NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
      return res.status(404).json('Unauthorized')
    }

    const accessToken = authorizationHeader.split(' ')[1]

    if (accessToken === 'null' || accessToken === 'undefined') {
      return res.status(404).json('Unauthorized')
    }
    
    const userData = await TokenService.validateAccessToken(accessToken)

    console.log(userData);
    

    if (!userData) {
      return res.status(404).json('Unauthorized')
    }

    req.user = userData
    next();
  }catch(e) {
    next(e)
  }
}