var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();

//APP CONFIG
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/restful_blog_app", {
    useMongoClient: true
});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});

//compile into model
var Blog = mongoose.model("Blog", blogSchema);

//CREATE A BLOG
//Blog.create({
//    title: "Test Blog",
//    image: "https://farm1.staticflickr.com/93/246477439_5ea3e472a0.jpg",
//    body: "HELLO THIS IS A BLOG POST"    
//});

//RESTFUL ROUTES
//To redirect page to route
app.get("/", function (req, res) {
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function (req, res) {
    //to get all blogs from db
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("Error!");
        } else {
            res.render("index", {
                blogs: blogs
            });
        }
    });
});

//NEW ROUTE
app.get("/blogs/new", function (req, res) {
    res.render("new");
});


//CREATE ROUTE
app.post("/blogs", function (req, res) {
    //create blog
    //pass the data then a callback function
//    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
//    console.log("================");
//    console.log(req.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });    
});

//SHOW ROUTE
app.get("/blogs/:id", function (req, res) {
    //find the corresponding id and then make a callback
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {
                blog: foundBlog
            });
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {
                blog: foundBlog
            });
        }
    });

});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
//res.send("UPDATE ROUTE!");
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
app.delete("/blogs/:id", function(req, res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err, deletedBlog){
        if(err){
            res.send("you fucked up mate");
        } else {
            res.redirect("/blogs");
        }
    });
    //redirect somewhere
});


app.listen(3000, function () {
    console.log("Serving site on port 3000");
});