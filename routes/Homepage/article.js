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

module.exports = function (app, objJson, isEmailValid) {
    app.get("/getArticle", async (req, res) => {
        const foundArticle = await article.find({
            
        });
    })
}