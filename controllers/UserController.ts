import UserService from '../services/UserService';
import {Request, Response, NextFunction} from 'express'


class UserController {
  

  async getAll(req:Request, res: Response, next:NextFunction) {
    try {
      const users = await UserService.getAll()
      return res.json(users)
    }catch(e) {
      console.log(e);
    }
  }

  async registration(req:Request, res: Response, next:NextFunction){
    try {
      const {email, password} = req.body;
      
      const userData = await UserService.registration(email, password)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    }catch(e) {
      console.log(e);
      return res.status(404).send({message: e.message})
    }
  }
  async remove (req:Request, res: Response, next:NextFunction) {
    try {
      const {id} = req.params

      const deleted = await UserService.remove(+id)
      return res.json(deleted)
    }catch(e) {
      return res.status(404).send({message: e.message})
    }
  }
  async activate(req:Request, res: Response, next:NextFunction) {
    try {
      const {link} = req.params
      
      await UserService.activate(link)
      res.redirect('https://google.com')
    }catch(e) {
      return res.status(404).send({message: e.message})
    }
  }
  async login(req:Request, res: Response, next:NextFunction) {
    try {
      const {email, password} = req.body

      const userData = await UserService.login(email, password)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    }catch(e) {
      return res.status(404).send({message: e.message})
    }
  }
  async auth(req:Request, res: Response, next:NextFunction) {
    try {
      const {refreshToken} = req.cookies
      const userData = await UserService.auth(refreshToken)
      
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    }catch(e) {
      return res.status(404).send({message: e.message})
    }
  }
  async getAttrs(req:Request, res:Response, next:NextFunction) {
    try {
      const attrs = await UserService.getAttrs()
      return res.json(attrs)
    }catch(e) {
      next(e)
    }
  }

  async logout(req:Request, res:Response, next:NextFunction) {
    try {
      const {refreshToken} = req.cookies
      
      const token = await UserService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.json(token)
    }catch(e) {
      return res.status(404).send({message: e.message})
    }
  }
  
}

export default new UserController()