const { User } = require("../models/User");


let auth = (req, res, next) => {


    let token = req.cookies.x_auth;

    User.findByToken(token, (err, user) => {
        if(err) throw err;
        //유저 없으면
        if(!user) return res.json({ isAuth: false, error: true })
        //유저 있으면
        req.token = token;
        req.user = user;
        
        next();
    })


}

module.exports = { auth };