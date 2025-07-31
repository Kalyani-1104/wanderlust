const Listing = require("../models/listing.js");
const NodeGeocoder = require('node-geocoder');
// const fetch = require('node-fetch'); // ADD THIS

const options = {
  provider: 'openstreetmap',
  httpAdapter: 'https',
  formatter: null,
  fetch: async (url, fetchOptions) => {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      'User-Agent': 'WanderLustApp/1.0 (your_email@example.com)', 
      'Referer': 'https://yourwebsite.com'
    };
    return fetch(url, fetchOptions);
  }
};

const geocoder = NodeGeocoder(options);

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

module.exports.filter = async (req, res) => {
    let { category } = req.params;
    console.log("Category:", category); // ← Debug check
    let allListings = await Listing.find({ category: category });
    res.render("filter/showfilter", { allListings, category });
};


module.exports.createNewListing = (req, res) => {
    res.render("listings/new");
};

module.exports.addNewListing = async (req, res, next) => {
    try {
        const newListings = new Listing(req.body.Listing);

        // Handle user authentication
        if (!req.user || !req.user._id) {
            req.flash("error", "You must be logged in to create a listing.");
            return res.redirect("/login");
        }
        newListings.owner = req.user._id;

        // Handle image file (if uploaded)
        if (req.file) {
            newListings.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        // Handle geocoding
        const addressToGeocode = req.body.Listing.location;
        if (addressToGeocode) {
            const geoResults = await geocoder.geocode(addressToGeocode);
            if (geoResults && geoResults.length > 0) {
                const firstResult = geoResults[0];
                newListings.geometry = {
                    type: 'Point',
                    coordinates: [firstResult.longitude, firstResult.latitude]
                };
                console.log("Geocoding successful:", firstResult);
            } else {
                console.warn("No geocoding result for address:", addressToGeocode);
                newListings.geometry = { type: 'Point', coordinates: [0, 0] };
            }
        } else {
            console.warn("No address provided.");
            newListings.geometry = { type: 'Point', coordinates: [0, 0] };
        }

        // Save and redirect
        await newListings.save();
        req.flash("success", "New Listing Created");
        res.redirect("/listings");

    } catch (error) {
        console.error("Error in addNewListing:", error);
        req.flash("error", "Failed to create listing. Please try again.");
        res.redirect("/listings/new");
    }
};


module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list) {
        req.flash("error", "Listing you requested for does not exist!!");
        return res.redirect("/listings");
    }

    let originalImageUrl = list.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/ar_1:1,c_auto,g_auto,w_500/r_45");
    // console.log(originalImageUrl);

    req.flash("success", "Listing Edited Successfully!!");
    res.render("listings/edit", { list, originalImageUrl });
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listOfID = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listOfID) {
        req.flash("error", "Listing you requested for does not exist!!");
        return res.redirect("/listings");
    }
    res.render("listings/show", {
        listOfID,
        mapToken: process.env.MAP_API_KEY,
        listings: JSON.stringify(listOfID)
    });
};

module.exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;

        // 🔄 Update listing basic details
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.Listing }, { new: true, runValidators: true });

        // 📷 Handle new image upload (if provided)
        if (req.file) {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
            await listing.save();
        }

        // 📍 Handle geocoding if location is updated
        if (req.body.Listing.location) {
            const addressToGeocode = req.body.Listing.location;
            const geoResults = await geocoder.geocode(addressToGeocode);

            if (geoResults && geoResults.length > 0) {
                const firstResult = geoResults[0];
                listing.geometry = {
                    type: 'Point',
                    coordinates: [firstResult.longitude, firstResult.latitude]
                };
                console.log("Location updated:", firstResult);
            } else {
                console.warn("No geocoding result for updated address:", addressToGeocode);
                listing.geometry = { type: 'Point', coordinates: [0, 0] };
            }
            await listing.save();
        }

        req.flash("success", "Listing Updated Successfully!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error in updateListing:", error);
        req.flash("error", "Failed to update listing. Please try again.");
        res.redirect(`/listings/${req.params.id}/edit`);
    }
};


module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    // console.log(deletedList);
    req.flash("success", "Listing Deleted Successfully!!");
    res.redirect("/listings");
};