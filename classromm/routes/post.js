const express = require("express");
const router = express.Router();

// index route

router.get("/", (req,res)=>{
    res.send("get for post");
});


// show route

router.get("/:id", ( req, res) =>{
    res.send("get for post id");
});

// post route

router.post("/", (req, res)=>{
    res.send("post for user");
});

// delete route

router.delete("/:id", (req, res)=>{
    res.send("delete post id" );
})

module.exports = router