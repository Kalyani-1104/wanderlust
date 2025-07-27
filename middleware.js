const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Log in to WanderLust.");
        return res.redirect("/login");  // redirect user to login page
    }
    next();
};

module.exports.savedOriginalUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirect = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to delete this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isreviewAuthor = async (req, res, next) => {
    let { id, reviewID } = req.params;
    let review = await Review.findById(reviewID);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to access this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};