const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


// INDEX - Show all listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});

    res.render("listings/index.ejs", { allListings });
};


// NEW - Show new listing form
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


// CREATE - Create new listing
module.exports.createListing = async (req, res) => {

    let response = await geocodingClient.forwardGeocode({   
                query: req.body.listing.location,
        limit: 1
    }).send();      

   
    let url = req.file.path;
    let filename = req.file.filename;
    console.log("file path is " + url);
    const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = response.body.features[0].geometry; 
  

     let savedListing = await newListing.save();
     console.log("Saved listing is " + savedListing);

    req.flash("success", "New listing created!");

    res.redirect("/listings");
};


// SHOW - Show one listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash(
            "error",
            "Listing you requested for does not exist!"
        );

        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};


// EDIT - Show edit form
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    let orignalImgUrl = listing.image.url;
    originalImgUrl = orignalImgUrl.replace("/upload", "/upload/w_300,h_300,c_fill");

    res.render("listings/edit.ejs", { listing });
};


// UPDATE - Update listing
// module.exports.updateListing = async (req, res) => {
//     const { id } = req.params;

//    let listing =  await Listing.findByIdAndUpdate(
//         id,
//         { ...req.body.listing },
//         { runValidators: true }
//     );

//     if(typeof req.file !== 'undefined') {   
//         let url = req.file.path;
//         let filename = req.file.filename;
//         listing.image = { url, filename };
//         await listing.save();
//     }

//     req.flash("success", "Listing updated!");

//     res.redirect(`/listings/${id}`);
// };


module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { runValidators: true, new: true }
    );

    if (req.file) {
        console.log("New image received!");

        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = {
            url: url,
            filename: filename
        };

        await listing.save();
    }

    req.flash("success", "Listing updated!");

    res.redirect(`/listings/${id}`);
};

// DELETE - Delete listing
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted!");

    res.redirect("/listings");
};

// SEARCH BAR


module.exports.searchListings = async (req, res) => {

    const { location } = req.query;

    const allListings = await Listing.find({
        location: {
            $regex: location,
            $options: "i"
        }
    });

    res.render("listings/index.ejs", {
        allListings
    });
};

module.exports.filterByCategory = async (req, res) => {
    const { category } = req.params;

    const allListings = await Listing.find({
        category: category
    });

    res.render("listings/index.ejs", { allListings });
};