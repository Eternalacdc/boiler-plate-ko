const express = require('express')
const app = express()
const port = 5000


const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://kangchanho:kang2468%40%40@cluster0.3o704.mongodb.net/alpha?retryWrites=true&w=majority', {

}).then(()=>console.log('MongoDB Connected...'))
.catch((err)=> console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})