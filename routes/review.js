const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn, isreviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}

//review    
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.addNewReview));

//delete review
router.delete("/:reviewID", isLoggedIn, isreviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;