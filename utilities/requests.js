const axios = require('axios')
const rax = require('retry-axios');
/*
    This is a utility module for requests and other API calls.
*/
function Pokemon(id, name, type, weight, height, image, moves) {
    this.id = id
    this.name = name
    this.type = type
    this.weight = weight
    this.height = height
    this.image = image
    this.moves = moves
}
/* Returns a promise for an array of pokemon by their ids, from startNum to endNum. If endNum goes over the maximum number of pokemon,
   it returns as many pokemon as it can. */
function getPage(startNum=1, endNum=25){
    const interceptID = rax.attach();
    return new Promise((resolve, reject) => {
        const SITE = 'https://pokeapi.co';
        const MAX_ID = 893;
        let output = [];
        let urls = [];
        // Get the URLs of all the queried pokemon
        for(let id = startNum; id <= endNum && id <= MAX_ID; id++){
            urls.push(`${SITE}/api/v2/pokemon/${id}`);
        }
        // Get a list of promises for each GET
        let promises = (() => {
            return urls.map((url) => {
                let res = axios.get(url, {timeout: 5000}).catch(err => {
                    console.log(err);
                    if(err.response){
                        if(err.response.status == '404'){
                            return null;
                        }
                    } 
                });
                return res;
            });
        })();
        // Complete all promises and push to output
        Promise.all(promises).then((res) => {
            res.forEach((result) => {
                if(result){
                    output.push(new Pokemon(
                        result.data.id,
                        result.data.name,
                        result.data.types,
                        result.data.weight,
                        result.data.height,
                        result.data.sprites.front_default,
                        result.data.moves
                    ));
                }
            });   
            // Resolve the pending promise with the output
            resolve(output);
        }).catch(err => {
            console.log(err);
        });
    });
}
/* Returns a promise for an array of every pokemon. */
async function getAllPokemon(step=25){
    return new Promise(async function(resolve, reject){
        let pokemon = [];
        const MAX_POKEMON = 893;
        for(let i = 1; i <= MAX_POKEMON; i += step){
            let list = await getPage(i, i + step - 1);
            pokemon = pokemon.concat(list);
        }
        resolve(pokemon);
    });
}

async function getRandomPokemon() {
    return new Promise( async function(resolve, reject) {
        let getRandom = (max=840) => {
            return Math.floor(Math.random() * Math.floor(max));
        };
        axios.get(`https://pokeapi.co/api/v2/pokemon/${getRandom()}`)
        .then(result => {
            resolve(new Pokemon(
                result.data.id,
                result.data.name,
                result.data.types,
                result.data.weight,
                result.data.height,
                result.data.sprites.front_default,
                result.data.moves
            ));
        })
        .catch(err => {
            console.log(err)
        })
    })
}

// Exports
exports.Pokemon = Pokemon;
exports.getPage = getPage;
exports.getAllPokemon = getAllPokemon;
exports.getRandomPokemon = getRandomPokemon;