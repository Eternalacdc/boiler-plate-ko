const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");



app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(cookieParser());


const mongoose = require('mongoose');


mongoose.connect(config.mongoURI, {

}).then(()=>console.log('MongoDB Connected...'))
.catch((err)=> console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!!!')
})


app.post('/api/users/register', (req, res) => {

  const user = new User(req.body);

  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/login', (req, res) => {
//   //1. db에 요청된 email찾기
//   //2. db에 요청한 email이 있다면 비번 같은지 확인
//   //3. 비밀번호 같다면 token생성
  User.findOne({ email: req.body.email }, (err, user) => {
    console.log(user)
    if(!user){
      return res.json({
        loginSuccess: false,
        Message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    //req.body.password는 우리가 보낸 password
    user.comparePassword(req.body.password, (err, isMatch) => {
      // console.log("req.body.password :"+req.body.password);
      // console.log("user"+user);
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
      
        user.generateToken((err, user) => {
          if (err) return res.status(400).send(err);

          res.cookie('x_auth', user.token)
          .status(200)
          .json({loginSuccess: true, userId: user._id})
      })
    })
  })
})


app.get('/api/users/auth', auth, (req, res) => {

  //여기 까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이 True 라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
  //이렇게 하면 내가 원하는 페이지에서 사용자 정보를 꺼내쓸 수 있게됨
})


app.get('/api/users/logout', auth, (req, res) => {

  User.findOneAndUpdate({ _id: req.user._id },
    { token: ""}
  , (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true
    })
  })
})




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})