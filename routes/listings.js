const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const ListingController = require("../controllers/listing.js");

const {
    isLoggedIn,
    isOwner,
    validateListing
} = require("../middleware.js");

const multer = require("multer");
const { storage } = require("../cloudconfig.js");

const upload = multer({ storage: storage });


// SEARCH
router.get(
    "/search",
    ListingController.searchListings
);


// INDEX + CREATE
router
    .route("/")
    .get(
        wrapAsync(ListingController.index)
    )
    .post(
        isLoggedIn,
        upload.single("image"),
        validateListing,
        wrapAsync(ListingController.createListing)
    );


// NEW
router.get(
    "/new",
    isLoggedIn,
    ListingController.renderNewForm
);


// CATEGORY ⭐
router.get(
    "/category/:category",
    wrapAsync(ListingController.filterByCategory)
);


// SHOW
router.get(
    "/:id",
    wrapAsync(ListingController.showListing)
);


// EDIT
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(ListingController.renderEditForm)
);


// UPDATE
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(ListingController.updateListing)
);


// DELETE
router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(ListingController.destroyListing)
);


module.exports = router;