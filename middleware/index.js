const jwt = require("jsonwebtoken");
const Token = require('../model/Token');
const authorization = async (req, res, next) => {
    try {
        if (!req.cookies || !req.cookies.jwt) {
            return next();
        }else{
            const token = req.cookies.jwt;
            const data = await jwt.verify(token, "jkasdhfu!#@$&$^@#!$!@#$1234");
            
            req.userId = data.UserId;
            req.avt = data.avatar;
            req.name = data.name;
            return next();
        }
    } catch (error) {
        console.log("Token error:", error.message);
        return res.status(401).send("Unauthorized");
    }
};
 const checkAdmin = (req, res, next) => {
  // app.use(cookieParser());
  if (!req.cookies.jwt) {
      // res.json({result:0,message:"Wrong parameters"});
      res.redirect("./login");
  } else {
      var token = req.cookies.jwt;
      Token.findOne({Token :token,Status:true})
          .then((t) => {
              if (t == null) {
                  res.redirect("./login");
                  // res.json({result:0,message:"Token has been expried"});
              } else {
                  //verify
                  jwt.verify(token, "jkasdhfu!#@$&$^@#!$!@#$1234", function (err, decoded) {
                      if (err) {
                          res.redirect("./login");
                          // res.json({result:0,message:"Token error"});
                      } else {
                          if (decoded.userType == 1) {
                              next();
                          } else {
                              res.redirect("./login");
                              // res.json({result:0,message:"You are not allowed"});
                          }
                      }
                  });
              }
          })
          .catch((err) => {
              res.redirect("./login");
              // res.json({result:0,message:"Invalid token"});
          })
  }
}
 module.exports = {
  authorization,
  checkAdmin
 }
