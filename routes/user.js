const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const UserController = require("../controllers/user.js");

router.route("/signup")
    .get(UserController.userSignup)
    .post(wrapAsync(UserController.userRegister));

router.route("/login")
    .get(UserController.userLogin)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        UserController.userRedirect
    );

router.get("/logout", UserController.userLogout);

 module.exports = router;


