const User = require("../models/user.js");
module.exports.userSignup =(req, res)=>{
    res.render("./user/signup.ejs");
}  

module.exports.userRegister = async(req, res) =>{
    try{
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) =>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to wanderLust");
    res.redirect("/listings")
    })
  
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }

}

module.exports.userLogin = (req, res) =>{
    res.render("./user/login.ejs");
}


module.exports.userRedirect = async(req, res) =>{
        req.flash("success", "Welcomeback to wanderLust!"); 
         let redirectUrl = res.locals.redirectUrl || "/listings";
           delete req.session.redirectUrl;
            res.redirect(redirectUrl);
        
    } 
module.exports.userLogout = (req, res, next) =>{
    req.logout((err) =>{
        if(err){
            return next(err);

        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    })
 }
