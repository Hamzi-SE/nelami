const mongoose = require('mongoose')

const connectDatabase = () => {
  mongoose
    .set('strictQuery', false)
    .connect(process.env.DB_URI)
    .then((res) => {
      console.log(`Database Connected Successfully with ${res.connection.db.databaseName}`)
    })
    .catch((err) => console.log(err))
}

module.exports = connectDatabase
