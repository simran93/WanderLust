const express = require("express");
const app = express();
const router = express.Router();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");
const session = require("express-session")
const ejsMate = require("ejs-mate");
const { render } = require("ejs");
const path = require("path");
const flash = require("connect-flash");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs', ejsMate);


app.use(session({
    secret:"mySuperSecretCode",
    resave: false,
    saveUninitialized :true,

}));
app.use(flash());



app.get("/register", (req, res)=>{
    let {  name = "anonymous"} = req.query;
    req.session.name = name;
    if(name ==="anonymous"){
        req.flash("error","user is not registered;")
    }else{
        req.flash("success", "user registered susccesfully")
    }
 
    res.redirect("/hello");
})

app.get("/hello", (req, res)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    
    res.render("page.ejs", {name:req.session.name});
})

// app.get("/reqcount", (req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }

//     res.send(`you send a request ${req.session.count} times`);
// })



 app.listen(3000, ()=>{
    console.log("server is listening to 3000" );
 })