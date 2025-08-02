const User = require("../models/user.js");

module.exports.renderLandingpg = (req, res) => {
    res.render("listings/home.ejs");
}

module.exports.renderSignupForm = (req, res) => {
    res.render("user/signup.ejs");
};

module.exports.submitSignup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (e) => {
            if (e) {
                return next(e);
            }
            req.flash("success", "User Registered Successfully!!");
            res.redirect("/listings");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("user/login.ejs");
};

module.exports.submitLogin = async (req, res) => {
    req.flash("success", "Logged in Successfully!!");
    const redirectUrl = res.locals.redirect || "/listings";
    res.redirect(redirectUrl);
};

module.exports.renderLogout = (req, res, next) => {
    req.logout((e) => {
        if (e) {
            console.log(e);
            return next(e);
        }
        req.flash("success", "Logged-Out Successfully!!");
        res.redirect("/listings");
    })
};