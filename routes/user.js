const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedOriginalUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.submitSignup));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(savedOriginalUrl,
        passport.authenticate('local',
            { failureRedirect: '/login', failureFlash: true }
        ),
        userController.submitLogin
    );

router.get("/logout", userController.renderLoginForm);

module.exports = router;