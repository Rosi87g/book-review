import express from 'express'
import { booksList } from '../controllers/bookcontroller.js'

const bookRouter = express.Router()

bookRouter.get('/list',booksList)

export default bookRouter