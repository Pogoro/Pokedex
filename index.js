var express = require('express');
var bodyParser = require('body-parser');
const axios = require('axios');
const rax = require('retry-axios');
var fetch = require('node-fetch');
var nodemailer = require('nodemailer');
const { Client } = require('pg');
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
// PostGres client
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false
    }
});

client.connect();

updateCache();

// This is the Pokemon data object that gets inserted into the pokemon list
function Pokemon(id, name, type, weight, height, image, moves) {
    this.id = id
    this.name = name
    this.type = type
    this.weight = weight
    this.height = height
    this.image = image
    this.moves = moves
}
// Returns an array of Pokemon objects for their IDs in the given range, from startNum to endNum.
function getPokedex(startNum=1,endNum=25) {
    const interceptID = rax.attach();
    return new Promise( (resolve, reject) => {
        const SITE = 'https://pokeapi.co';
        let output = [];
        let urls = [];
        // Get the URLs of all the queried pokemon
        for(let id = startNum; id <= endNum && id <= 893; id++){
            urls.push(`${SITE}/api/v2/pokemon/${id}`);
        }
        // Get a list of promises for each GET
        let promises = (() => {
            return urls.map((url) => axios.get(url, {timeout: 5000}));
        })();
        // Complete all promises and push to output
        // TODO: Account for going over max number of pokemon. As of 11/12/2020, this num is 893
        Promise.all(promises).then((res) => {
            res.forEach((result) => {
                output.push(new Pokemon(
                    result.data.id,
                    result.data.name,
                    result.data.types,
                    result.data.weight,
                    result.data.height,
                    result.data.sprites.front_default,
                    result.data.moves
                ));
            });   
            // Resolve the pending promise with the output
            resolve(output);
        }).catch(err => {
            console.log(err);
        });

    }).catch(err => {
        console.error(err);
        reject(err);
    });
    res.render('')
}

async function updateCache(){
    let pokemon = [];
    const STEP = 25;
    const MAX_POKEMON = 893;

    for(let i = 1; i <= MAX_POKEMON; i += STEP){
        console.log(i);
        let list = await getPokedex(i, i + STEP);
        pokemon = pokemon.concat(list);
    }
    const tableName = 'pokemon';
    pokemon.forEach((pokemon) => {
        client.query(`INSERT INTO ${tableName} (id, data) VALUES (${pokemon.id}, pokemon);`);
    });
}
// Page routes
app.get('/', function(req, res){
    res.render('home');
});
app.get('/pokedex', async function(req, res){
    try{
        //const pokemonList = await getPokedex();
        // This API call is to get the names of the pokemon
        //console.log(pokemonList)
        pokemonList.forEach(element => {
            console.log(element.name)
        });
        res.render('pokedex', {
            pokemon: pokemonList
        });
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