var express = require('express');
var bodyParser = require('body-parser');
const axios = require('axios');
const rax = require('retry-axios');
var fetch = require('node-fetch');
var nodemailer = require('nodemailer');
//Modules
var cache = require('./utilities/cache.js');
var requests = require('./utilities/requests.js');
var filter = require('./utilities/filter.js');
//Config
var config = require('./config.json');
//create express object, call express
var app = express();
//get port info
const port = process.env.PORT || 3000;
//require('trace-unhandled');
//tell app to use EJS for templates
app.set('view engine', 'ejs');
//Make styles public
app.use(express.static("public"));
//tell app to use Body parser
app.use(bodyParser.urlencoded({ extended: true }));

//cache.updateCache();

// Page routes
app.get('/', function(req, res){
    res.render('home');
});
app.get('/pokedex', function(req, res){
    var pokemonList = [];
    cache.downloadCache().then(poke => {
        pokemonList = poke;
        res.render('pokedex', {
            pokemon: pokemonList
        })
    });
});
app.get('/battle', function(req, res){
    res.render('battle');
});
app.get('/contact', function(req, res){
     res.render('contact');
});

// Contact POST
app.post('/contact', function(req, res){
    console.log(req.body.name);
    // Here we create the SMTP server. We use GMail for this.
    const transport = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
            user: config.email.user,
            pass: config.email.pass
        }
    });
    // Email options
    const mailOpts = {
        from: "SENDER INFO",
        to: config.email.recipient.address,
        subject: `New message from ${req.body.name}.`,
        text: `${req.body.message}\n\nYou can contact this person at ${req.body.email}`
    }
    // Send the email
    transport.sendMail(mailOpts, (err, res) => {
        if(err){
            console.log(err); // Render error message here
        }else{
            console.log(res); // Render success message here
        }
    })
});

//server setup
app.listen(port, function () {
    console.log('Listening on port ' + port)
});