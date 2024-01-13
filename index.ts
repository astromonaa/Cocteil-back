import { createRequire } from "module";
const require = createRequire(import.meta.url);
require('dotenv').config()

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import cors from 'cors'

import ('./models/pgModels')

import express from 'express'
import router from './router/index';
import sequelize from './db'

const app = express()

const PORT = process.env.PORT || 7000

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())
app.use('/api', router)
app.use(express.static(__dirname + '/static'))


const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  }catch(e) {
    console.log(`Erroe while starting server -> ${e.message}`);
  }
}


start()