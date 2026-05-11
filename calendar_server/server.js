import express from 'express'
import dotenv from 'dotenv'
import ConnectDB from './config/db.js'
import calendarTaskRouter from './routes/calendarTask.js'
import authRouter from './routes/authRoutes.js'
import groupRouter from './routes/groupRoutes.js'
import noteRouter from './routes/noteRoutes.js'
import cors from 'cors'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 3333
const host = process.env.HOST || 'http://localhost'
const mdb = process.env.MONGO_URI || 'URL'
ConnectDB(mdb)

app.use('/api/auth', authRouter)
app.use('/api/groups', groupRouter)
app.use('/api/groups', calendarTaskRouter)
app.use('/api/groups', noteRouter)

app.listen(port, () => {
  console.log(`Server is running on ${host}:${port}`)
})
