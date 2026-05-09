import mongoose from 'mongoose'

const ConnectDB = (data) => {
  mongoose
    .connect(data)
    .then(() => {
      console.log('Successfully conncted to MongoDB!')
    })
    .catch((error) => {
      console.log('Failed to connct to MongoDB', error)
    })
}
export default ConnectDB
