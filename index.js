//require express
var express = require('express');
//reqiure body parser
var bodyParser = require('body-parser');
//Require Axios for API calls
const axios = require('axios');
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

//server setup
app.listen(port, function () {
    console.log('Listening on port ' + port)
});