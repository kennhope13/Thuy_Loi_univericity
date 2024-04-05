var User = require("../../model/User");
var Token = require("../../model/Token");
var bcrypt = require("bcrypt");
var multer = require('multer');
var jwt = require('jsonwebtoken');
const { authorization, checkAdmin } = require('../../middleware/index');
const author = require("../../model/author");
const article = require("../../model/article");
var slugify = require('slugify')
var crypto = require("node:crypto");
const { sendMail } = require("../../helper/sendMail");
const topic = require("../../model/topic");
const converToObject = require("../../helper/converObj");


module.exports = function (app, objJson, isEmailValid) {
    // app.get("/index1", (req, res) => {
    //     res.render("pages/index.ejs");
    // })

    app.get("/index", authorization, (req, res) => {
        return res.render("./masters.ejs", {
            page:"index1",
            data_user: {
                userId: req.userId,
                avatar: req.avt,
                name: req.name
            }
        });
    })

    app.get("/detail-article/:id",authorization, async (req, res) => {
        try{
            const articleId = req.params.id;
            const foundId = await article.findById(articleId);
            console.log("found", foundId.article_name);
            // res.render("./pages/detail-article", { data: foundId });
            return res.render("./masters.ejs", {
                page: "detail-article",
                data_user: {
                    userId: req.userId,
                    avatar: req.avt,
                    name: req.name
                },
                data: foundId
           });
        }catch(e){
            console.error(e);
        }
        
    });
    
    app.get("/login", (req, res) => {
        res.render("pages/login.ejs")
        // .json({ user: { id: req.userId, Avatar: req.avt } });
    })
    app.get("/signup", (req, res) => {
        res.render("pages/signup.ejs");
    })
    // app.get("/bmcntt", (req, res) => {
    //     res.render("masters.ejs", { page: "bmcntt" });
    // })
    app.post("/Register", (req, res) => {
        var email = req.body.Email;
        var password = req.body.Password;
        var name = req.body.Name;
        var address = req.body.address;
        var mobile = req.body.mobile;
        var avatar = req.body.Avatar;
        var checkbox = req.body.Active;
        if (!email || !password) {
            // res.json({result:0,message:"Register wrong parameters"});
            console.log("error");
        } else {
            User.findOne({ Email: email }).then((data) => {
                if (data != null) {
                    res.json({ result: 0, message: "User is not availble." });
                } else {
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(password, salt, function (err, hash) {
                            if (err) {
                                res.json({ result: 0, message: "Password hash error." });
                            } else {
                                const NewUser = new User({
                                    Email: email,
                                    Password: hash,
                                    Avatar: avatar,
                                    Name: name,
                                    address: address,
                                    mobile: mobile,
                                    Active: checkbox,
                                    RegisterDate: Date.now(),
                                    userType: 0 // 0 user , 1 admin
                                });
                                NewUser.save().then((data) => {
                                    res.json({ result: 1, message: "User Register Succesfully!", data: data });
                                    // console.log("User Register Succesfully!",data);
                                }).catch((err) => {
                                    // res.json({result:0,message:"User Register Error.",error:err});
                                    console.log("User Register Error.", err);
                                })
                            }
                        });
                    });
                }
            }).catch((Err) => {
                res.json({ result: 0, message: "Find error." });
            })
        }
    });
    app.post("/login", (req, res) => {
        if (!req.body.Email || !req.body.Password) {
            res.json({ result: 0, message: "Loi thong so!!!" });
        } else {
            var email = req.body.Email;
            var password = req.body.Password;
            User.findOne({ Email: email })
                .then((user) => {
                    if (user != null) {
                        bcrypt.compare(password, user.Password, function (err, result) {
                            if (err) {
                                res.json({ result: 0, message: "Kiem tra thong so khong hop le!!!" });
                            } else {
                                console.log(result);
                                if (result === true) {
                                    user.Password = "xxx!!!";
                                    jwt.sign({
                                        UserId: user._id, email, name: user.Name, avatar: user.Avatar, userType: user.userType
                                    }, objJson.secretKey, { expiresIn: 60 * 60 }, function (errT, token) {
                                        if (errT) {
                                            res.json({ result: 0, message: "Token khong hop le!!!" });
                                        } else {
                                            const data = jwt.verify(token, "jkasdhfu!#@$&$^@#!$!@#$1234");
                                            var newToken = new Token({
                                                Email: email,
                                                Token: token,
                                                Status: true,
                                                RegisterDate: Date.now(),
                                            });
                                            res.cookie('jwt', token, { secure: false });
                                            newToken.save()
                                                .then(() => {
                                                    res.json({ result: 1, message: "login thanh cong!!!", token: token, userType: data.userType });
                                                })
                                                .catch((err) => {
                                                    res.json({ result: 0, message: "luu token that bai", err })
                                                })
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        res.json({ result: 0, message: "chua dang ky tai khoan!!!!" });
                    }
                })
                .catch((err) => {
                    res.json({ result: 0, message: "khong tim thay tai khoan!!!!", err });
                })
        }
    })
    app.post("/Logout", (req, res) => {
        var token = req.body.Token;
        if (!token) {
            res.json({ result: 0, message: "Token in parameter" });
        } else {
            res.clearCookie("jwt");
            Token.findOneAndDelete({ Token: token }, { Status: false }).then(() => {
                res.json({ result: 1, message: "Logout is successfully!" });
            }).catch((e) => {
                res.json({ result: 0, message: "Logout is failed!" });
            })
        }
    });
    //munlter
    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/upload')
        },
        filename: function (req, file, cb) {
            cb(null, randomIntFromInterval(0, 10000000) + "-" + file.originalname)
        }
    });
    var upload = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            console.log(file);
            if (file.mimetype == "image/bmp" || file.mimetype == "image/png"
                || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"
                || file.mimetype == "image/git"
            ) {
                cb(null, true)
            } else {
                return cb(new Error('Only image are allowed!'))
            }
        }
    }).single("avatar");

    // show list views admin
    app.post("/listuser", (req, res) => {
        User.find({ userType: 0 }).then((data) => {
            res.json({
                result: 1,
                userdata: data
            })
        }).catch((e) => {
            res.json({
                result: 0
            })
        })
    });
    app.get("/admin", checkAdmin, authorization,  (req, res, next) => {
        res.render("./admin/index", { 
            page: "home", 
            data_user: {
                userId: req.userId,
                avatar: req.avt,
                name: req.name
             } 
        });
    });
    app.get("/users",authorization, (req, res) => {
        res.render("./admin/index", {
             page: "users",
             data_user: {
                userId: req.userId,
                avatar: req.avt,
                name: req.name
             } 
        });
    });
    app.get("/lienhe",authorization, (req, res) => {
        try{
            res.render("./pages/lienhe", {
                data_user: {
                    userId: req.userId,
                    avatar: req.avt,
                    name: req.name
                }
            });
        }catch(e){
            console.error(e);
        }
    });
    // app.get("/detail-article", (req, res) => {
    //     res.render("./admin/index", { page: "detail-article" });
    // });
    
    // app.get("/detailArticle/:id", (req, res) => {
    //     const articleId = req.params.id;
    //     article.findById(articleId).then((data) => {
    //         res.json({
    //             result: 1,
    //             userdata: data
    //         })
    //     }).catch((e) => {
    //         res.json({
    //             result: 0
    //         })
    //     })
    // });
    app.get("/delete/:id", (req, res) => {
        User.findByIdAndDelete(req.params.id).then((dt) => {
            res.json({
                result: 1, data: dt
            })
        }).catch((e) => {
            res.json({
                result: 0, err: e
            })
        });
    });
    app.get("/edit/:id", (req, res) => {
        console.log("aa", req.params.id);
        User.findOne({ _id: req.params.id }).then((dt) => {
            res.json({
                result: 1, data: dt
            })
        }).catch((e) => {
            res.json({
                result: 0, err: e
            })
        });
    });

    app.post("/edit_user/:id", (req, res) => {
        console.log("bb", req.params.id);
        User.findByIdAndUpdate(req.params.id, req.body).then((dt) => {
            res.json({
                result: 1, data: dt
            })
        }).catch((e) => {
            res.json({
                result: 0, err: e
            })
        });

    })
    //author 
    // show list views authors
    app.post("/listauthor", (req, res) => {
        author.find().then((data) => {
            res.json({
                result: 1,
                userdata: data
            })
        }).catch((e) => {
            res.json({
                result: 0
            })
        })
    });
    app.get("/authors", authorization, (req, res) => {
        res.render("./admin/index", { 
            page: "authors",
            data_user: {
                userId: req.userId,
                avatar: req.avt,
                name: req.name
            } 
        });
    });

    //bai viet
    app.get("/insertArticle", authorization, (req, res) => {
        res.render("./admin/index", { 
            page: "addArticle",
            data_user: {
                userId: req.userId,
                avatar: req.avt,
                name: req.name
            } 
        });
    });
    app.get("/listHome", async (req, res) => {
        const foundTopic = await topic.findOne({
            topic_slug: "Trang-Chu"
        });

        await article.find({
            topic_Article: foundTopic._id
        }).then((data) => {
            res.json({
                result: 1,
                userdata: data
            })
        }).catch((e) => {
            res.json({
                result: 0
            })
        })
    });
    app.get("/listTinTuc", async (req, res) => {
        const foundTopic = await topic.findOne({
            topic_slug: "Tin-tuc"
        });

        await article.find({
            topic_Article: foundTopic._id
        }).then((data) => {
            res.json({
                result: 1,
                userdata: data
            })
        }).catch((e) => {
            res.json({
                result: 0
            })
        })
    });
    app.get("/listDaoTao", async (req, res) => {
        const foundTopic = await topic.findOne({
            topic_slug: "Dao-tao"
        });

        await article.find({
            topic_Article: foundTopic._id
        }).then((data) => {
            res.json({
                result: 1,
                userdata: data
            })
        }).catch((e) => {
            res.json({
                result: 0
            })
        })
    });
    app.get("/listTopic", (req, res) => {
        topic.find().then((data) => {
            res.json({
                result: 1,
                userdata: data
            })
        }).catch((e) => {
            res.json({
                result: 0
            })
        })
    });
    app.post("/addArticle", authorization, (req, res) => {
        upload(req, res, function (err) {
            console.log("nguyen::", req.body.topic_Article);
            var newArticle = new article({
                article_name: req.body.article_name,
                describe: req.body.describe,
                images: req.body.images,
                slug: slugify(req.body.article_name),
                article_author: req.name,
                topic_Article: converToObject(req.body.topic_Article)
            });
            newArticle.save().then(() => {
                res.json({ result: 1, message: "Lưu thành công" })
            })
                .catch((e) => {
                    res.json({ result: 0, message: "Lưu thất bại" })
                })
        });
    });

    app.get("/article", authorization, (req, res) => {
        res.render("./admin/index", { 
            page: "article",
            data_user: {
                userId: req.userId,
                avatar: req.avt,
                name: req.name
            } 
        });
    });
    app.post("/listarticle", (req, res) => {

        article.find().then((data) => {
            res.json({
                result: 1,
                userdata: data
            })
        }).catch((e) => {
            res.json({
                result: 0
            })
        })
    });

    // upload files
    //multer
    //random number
    function randomXToY(minVal, maxVal) {
        var randVal = minVal + (Math.random() * (maxVal - minVal));
        return Math.round(randVal);
    }
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/upload')
        },
        filename: function (req, file, cb) {
            cb(null, randomXToY(10, 999) + "-" + file.originalname)
        }
    });
    var upload = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            console.log(file);
            if (file.mimetype == "image/bmp"
                || file.mimetype == "image/png"
                || file.mimetype == "image/gif"
                || file.mimetype == "image/jpg"
                || file.mimetype == "image/jpeg"
            ) {
                cb(null, true)
            } else {
                return cb(new Error('Only image are allowed!'))
            }
        }
    }).single("avatar");

    app.post("/uploadfile", function (req, res) {

        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                res.json({ result: 0, message: "A Multer error occurred when uploading." });
            } else if (err) {
                res.json({ result: 0, message: "An unknown error occurred when uploading." });
            } else {
                console.log(req.file); // Thông tin file đã upload
                res.json({ result: 1, message: "Upload is okay", info: req.file });
            }

        });
    });

    app.get("/forgotPassword", async function (req, res) {
        const Email = req.query.email;
        const foundShop = await User.findOne({ Email });
        if (!foundShop) res.json({ result: 0, message: "Shop is not registered" });

        const resetToken = crypto.randomBytes(64).toString('hex');

        foundShop.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        foundShop.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        const query = { Email }, updateSet = {
            $set: {
                resetPasswordToken: foundShop.resetPasswordToken
            },
            $addToSet: {
                resetPasswordExpires: foundShop.resetPasswordExpires
            }
        }

        await User.updateOne(query, updateSet);

        const html = `Please click <a href=http://localhost:3000/user/reset-password/${resetToken}> here </a> for change password !! you have exprie 15 minute`

        const data = {
            Email,
            html
        }
        const rs = await sendMail(data);
        if (rs) {
            res.json({ result: 1, message: "Shop send success", info: rs });
        }
    })
    app.get("/user/reset-password/:resetToken", (req, res) => {
        res.render("./pages/resetPasword");
    })

    app.post("/resetPassword", async function (req, res) {
        try {
            const password = req.body.password;
            const token = req.body.token;
            const resetToken = crypto.createHash('sha256').update(token).digest('hex');
            const foundToken = await User.findOne({ resetPasswordToken: resetToken, resetPasswordExpires: { $gt: Date.now() } });
            if (!foundToken) throw new BadRequestError("find token not exists!!");
            const passwordHash = await bcrypt.hash(password, 10);
            foundToken.Password = passwordHash;
            foundToken.resetPasswordToken = '';
            foundToken.resetPasswordExpires = undefined;
            await foundToken.save();
            res.json({ result: 1, message: "reset password successfully!" })
        } catch (e) {
            res.json({ result: 0, message: "reset password false!", error: e })
        }

    });
    // tác giả
    app.get("/TacGia", (req, res) => {
        res.render("./TacGia/TacGia", { page: "BaiViet" })
    })
    app.get("/deleleBaiViet/:id", (req, res) => {
        article.findByIdAndDelete(req.params.id).then((dt) => {
            res.json({
                result: 1, data: dt
            })
        }).catch((e) => {
            res.json({
                result: 0, err: e
            })
        });
    })
    app.get("/edit_baiviet_cua_tacgia/:id", (req, res) => {
        console.log("aa", req.params.id);
        article.findOne({ _id: req.params.id }).then((dt) => {
            res.json({
                result: 1, data: dt
            })
        }).catch((e) => {
            res.json({
                result: 0, err: e
            })
        });
    });
    app.post("/edit_BaiViet/:id", (req, res) => {
        console.log("vv", req.params.id);
        article.findByIdAndUpdate(req.params.id, req.body).then((dt) => {
            res.json({
                result: 1, data: dt
            })
        }).catch((e) => {
            res.json({
                result: 0, err: e
            })
        });
    })
}