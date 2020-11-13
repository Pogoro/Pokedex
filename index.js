//require express
var express = require('express');
//reqiure body parser
var bodyParser = require('body-parser');
//Require Axios for API calls
const axios = require('axios');
var retry = require('axios-retry');
//Require node fetch
var fetch = require('node-fetch');
//Nodemailer
var nodemailer = require('nodemailer');
//Config
var config = require('./config.json');
const { default: axiosRetry } = require('axios-retry');
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

// This is the Pokemon data object that gets inserted into the pokemon list
function Pokemon(name, type, weight, height, image, moves) {
    this.name = name
    this.type = type
    this.weight = weight
    this.height = height
    this.image = image
    this.moves = moves
}

function getPokedex() {
    return new Promise( (resolve, reject) => {
        const SITE = 'https://pokeapi.co';
        let output = [];
        let urls = [];
        axios.get(`${SITE}/api/v2/pokemon?limit=50/`)
            .then(response => {
                response.data.results.forEach(pokemon => {
                    urls.push(`${SITE}/api/v2/pokemon/${pokemon.name}`);
                });
            })
            .then(() => {
                let promises = (() => {
                    return urls.map((url) => axios.get(url));
                })();

                Promise.all(promises).then((res) => {
                    res.forEach((result) => {
                        console.log(`${result.data.name} [${result.data.id}]`);
                    });
                }).catch(err => console.log(err));
            })
            .catch(err => {
                console.error(err);
                reject(err);
            })
            .catch( err => {
                console.error('Data not found for this Pokemon');
                reject(err);
            });
    }).catch(err => {
        console.error(err);
        reject(err);
    });
}

// Page routes
app.get('/', function(req, res){
    res.render('home');
});

app.get('/pokedex', async function(req, res){
    try{
        const pokemonList = await getPokedex();
        // This API call is to get the names of the pokemon
        console.log(pokemonList)
        res.render('pokedex');
    } catch(e){
        console.error(e);
    }
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