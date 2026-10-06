if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const expressError = require("./utils/expressError.js");

const User = require("./models/user.js");

const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");


// ================= DATABASE =================

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}


// ================= APP CONFIG =================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);


// ================= MIDDLEWARE =================

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));


// ================= SESSION =================

app.use(
    session({
        secret: "mySuperSecretCode",
        resave: false,
        saveUninitialized: true,

        cookie: {
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        }
    })
);


// ================= FLASH =================

app.use(flash());


// ================= PASSPORT =================

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ================= GLOBAL VARIABLES =================

app.use((req, res, next) => {

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;

    next();
});


// ================= DEMO USER =================

app.get("/demouser", async (req, res) => {

    let fakerUser = new User({
        username: "emilydiason",
        email: "emilydiason87@gmail.com"
    });

    let registeredUser = await User.register(
        fakerUser,
        "helloworld"
    );

    res.send(registeredUser);
});


// ================= HOME =================




// ================= ROUTES =================

app.use("/listings", listingsRouter);

app.use("/listings/:id/reviews", reviewsRouter);

app.use("/", userRouter);


// ================= 404 ERROR =================

app.all("/{*splat}", (req, res, next) => {

    next(
        new expressError(
            404,
            "Page not found"
        )
    );
});


// ================= ERROR HANDLER =================

app.use((err, req, res, next) => {

    let {
        statusCode = 500,
        message = "Something went wrong"
    } = err;

    res.status(statusCode).render(
        "listings/error.ejs",
        { err }
    );
});


// ================= SERVER =================

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});