import { Response, NextFunction} from 'express'
import TokenService from "../services/TokenService"
import { ExtendedRequest } from '../types/types'


export default function (role:string) {
  return async function (req:ExtendedRequest, res:Response, next:NextFunction) {
    try {
      const authorizationHeader = req.headers.authorization
  
      if (!authorizationHeader) {
        return res.json('Unauthorized')
      }
  
      const accessToken = authorizationHeader.split(' ')[1]
  
      if (accessToken === 'null' || accessToken === 'undefined') {
        return res.json('Unauthorized')
      }
  
      const userData = await TokenService.validateAccessToken(accessToken)
  
      if (!userData) {
        return res.json('Unauthorized')
      }
  
      if (userData.role !== role) return res.json('Access denied')
  
      req.user = userData
      next()
    }catch(e) {
      next(e)
    }
  }

}