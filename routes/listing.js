const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}

//router.route() lets you group multiple HTTP methods (like GET, POST, etc.) for the same path in a clean and organized way.
router
    .route("/")
    .get(wrapAsync(listingController.index)) //show all listings
    .post(isLoggedIn,
        upload.single("Listing[image][url]"),
        validateListing,
        wrapAsync(listingController.addNewListing)
    ); //add new Listing

//create new route
router.get("/new", isLoggedIn, listingController.createNewListing);

router.route("/:id")
    .get( wrapAsync(listingController.showListing)) //show route
    .put(isLoggedIn,
        isOwner,
        upload.single("Listing[image][url]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    ) //update route
    .delete( isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); //delete route

//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editListing));

module.exports = router;