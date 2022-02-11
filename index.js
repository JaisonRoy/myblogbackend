const express = require('express');
const cors = require('cors');
const ArticleInfo = require('./src/model/BlogDB');
const UserInfo = require('./src/model/userDb')
const JWT = require('jsonwebtoken');
const auth = require("./middleware/auth");
const { status } = require('express/lib/response');
var debug = require("debug")("blogbackend:server");
const app = express();
app.use(cors());
// Post Method
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Basic Article Fetch Route
// app.get('/', (req, res) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
//     try {
//         console.log("workings")
//     }
//     catch (error) {
//         res.status(500).json({ message: 'Error', error });
//     }
// });

// Basic Article Fetch Route
app.get('/api/article/:name', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    try {
        const articleName = req.params.name;
        ArticleInfo.findOne({ name: articleName })
            .then(function (article) {
                res.status(200).json(article);
            })
    }
    catch (error) {
        res.status(500).json({ message: 'Error', error });
    }
});


// Upvotes Routing
app.post('/api/article/:name/upvotes', (req, res) => {
    const articleName = req.params.name;
    const filter = { name: articleName };
    const update = { $inc: { upvotes: 1 } };
    ArticleInfo.findOneAndUpdate(filter, update, { new: true })
        .then(function (article) {
            res.json(article);
        })
})

// Comments Routing
app.post('/api/article/:name/comments', (req, res) => {
    const articleName = req.params.name;
    const { username, text } = req.body;
    const filter = { name: articleName };
    const update = { $push: { comments: { username, text } } };
    ArticleInfo.findOneAndUpdate(filter, update, { new: true })
        .then(function (article) {
            res.json(article);
        })
})


// signup
app.get('/api/article/name', async (req, res) => {

    try {


        const { name } = req.query;
        console.log(name)

        const deletedArticle = await ArticleInfo.findOneAndDelete({ _id: id })
console.log(deletedArticle);

        res.status(200).json('Success');
    } catch (err) {
        res.status(400)
    }

})

// Upvotes Routing
app.post('/api/article/:name/upvotes', (req, res) => {
    const articleName = req.params.name;
    const filter = { name: articleName };
    const update = { $inc: { upvotes: 1 } };
    ArticleInfo.findOneAndUpdate(filter, update, { new: true })
        .then(function (article) {
            res.json(article);
        })
})

// Comments Routing
app.post('/api/article/:name/comments', (req, res) => {
    const articleName = req.params.name;
    const { username, text } = req.body;
    const filter = { name: articleName };
    const update = { $push: { comments: { username, text } } };
    ArticleInfo.findOneAndUpdate(filter, update, { new: true })
        .then(function (article) {
            res.json(article);
        })
})


// signup
app.post('/api/signup', async (req, res) => {

    try {


        const { username, email, password } = req.body;
        console.log(username, email, password)
        if (!(email && password && username)) {
            res.status(400).send("All input is required");
        }


        const oldUser = await UserInfo.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }



        // Create user in our database
        const user = await UserInfo.create({
            username: username,
            email: email,
            password: password,
            type: 2
        });
        const token = JWT.sign(
            { user_id: user._id, email },
            'jaison'
        );


        user.jwt = token;
        res.status(200).json(user);
    } catch (err) {
        res.status(400)
    }

})

app.post("/login", async (req, res) => {

    try {
        console.log(req.body)
        const { email, password } = req.body;


        if (!(email && password)) {
            res.status(400).send("All input is required");
        }

        const user = await UserInfo.findOne({ email });

        if (user.password == password) {

            const token = JWT.sign(
                { user_id: user._id, email },
                'jaison'
            );


            user.token = token;


            res.status(200).json(user);
        } else {
            res.status(400).send("Invalid Credentials");

        }
    } catch (err) {
        console.log(err);
    }

});


// Port number

app.set("port", process.env.PORT || 5001);

var server = app.listen(app.get("port"), function () {
    debug("Express server listening on port " + server.address().port);
});