const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
require("dotenv").config();

const geocodingClient = mbxGeocoding({
    accessToken: process.env.MAPBOX_TOKEN
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    console.log("MongoDB connected");

    const listings = await Listing.find({});

    for (let listing of listings) {

        // Skip listings that already have coordinates
        if (
            listing.geometry &&
            listing.geometry.coordinates &&
            listing.geometry.coordinates.length === 2
        ) {
            console.log(`Skipping: ${listing.title}`);
            continue;
        }

        console.log(`Finding location for: ${listing.title}`);
        console.log(`Location: ${listing.location}`);

        try {
            const response = await geocodingClient
                .forwardGeocode({
                    query: listing.location,
                    limit: 1
                })
                .send();

            if (response.body.features.length === 0) {
                console.log(`❌ Location not found: ${listing.location}`);
                continue;
            }

            listing.geometry = response.body.features[0].geometry;

            await listing.save();

            console.log(
                `✅ Updated: ${listing.title}`,
                listing.geometry.coordinates
            );

        } catch (err) {
            console.log(`❌ Error for ${listing.title}:`, err.message);
        }
    }

    console.log("Finished updating coordinates!");
    mongoose.connection.close();
}

main();