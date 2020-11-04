//require express
var express = require('express');
//reqiure body parser
var bodyParser = require('body-parser');
//Require Axios for API calls
const axios = require('axios');
//Require node fetch
var fetch = require('node-fetch');
//Nodemailer
var nodemailer = require('nodemailer');
//Config
var config = require('./config.json');
//create express object, call express
var app = express();
//get port info
const port = process.env.PORT || 3000;
//tell app to use EJS for templates
app.set('view engine', 'ejs');
//Make styles public
app.use(express.static("public"));
//tell app to use Body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Page routes
app.get('/', function(req, res){
    res.render('home');
});

app.get('/test', (req, res) => {
    const testPokemon = [];
    axios.get('https://pokeapi.co/api/v2/pokemon/')
    .then( response => {
        console.log(response.data)
        //Closes #39
    })
    res.render('test')
})
app.get('/pokedex', function(req, res){
    res.render('pokedex');
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