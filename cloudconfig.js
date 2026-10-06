const express = require("express");
const router = express.Router();

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDE_NAME,
  api_key: process.env.CLOUDE_API_KEY,
  api_secret: process.env.CLOUDE_API_SECRET
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { 
    folder: "Wanderlust",
    allowedFormats: ["jpeg", "png", "jpg"]
  }
});

module.exports = {
  cloudinary,
  storage
};