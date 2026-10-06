const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const ReviewController = require("../controllers/review.js");



// review post route

router.post("/" ,isLoggedIn,validateReview, wrapAsync( ReviewController.renderPostReview ));

// Delete review route

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(ReviewController.renderDeleteReview));

module.exports = router;