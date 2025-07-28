const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const Review = require("./review.js");
const { string } = require("joi");

const listingSchema = Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  image: {
    filename: {
      type: String,
      default: "listingimage"
    },
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1739611216836-53834bfec75b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1739611216836-53834bfec75b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          : v
    }
  },        
  price: {
    type: Number
  },
  location: {
    type: String
  },
  country: {
    type: String
  },
  reviews: [
    {
    type: Schema.Types.ObjectId,
    ref:"Review"
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref:"User"
  },
  geometry: {
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
  },
  category: {
    type: string,
    enum:["Beach", "Hills", "Desert", "Historic", "Culture", "Adventure", "Wildlife", "City", "Rural", "Winter", "Wellness", "Food", "Cruise", "Festivals", "Luxury", "Budget", "Road Trips"]
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
