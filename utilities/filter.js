/*
    This is a utility module for implementing filtering functions of the pokemon list.
*/

/*
    Master filter function. Returns an array of pokemon filtered by given parameters.
    Example usage:

    filter(pokemon, {
        types: ['fire', 'flying'],
        name: 'charizard',
        weight: [500, 1000],
        height: [10, 20]
    });
*/

function filterPokemon(pokemon, params){
    let filtered = pokemon;
    if(!pokemon) throw 'Pokemon list is empty.';
    if(params.types){
        filtered = filterByType(filtered, params.types);
    }
    if(params.name){
        filtered = filterByName(filtered, params.name);
    }
    if(params.weight){
        filtered = filterByWeight(filtered, params.weight[0], params.weight[1]);
    }
    if(params.height){
        filtered = filterByHeight(filtered, params.height[0], params.height[1]);
    }
    return filtered;
}

// Given a list of pokemon and an array of filter strings, return an array filtered by type given an array of type strings.
/* Example usage:
cache.downloadCache().then(res => {
    console.log(filter.filterByType(res, ['flying', 'fire']));
});
*/
function filterByType(pokemon, typeFilter){
    let types = ['normal', 'water', 'fire', 'grass', 'electric', 'fighting', 'flying', 'rock', 'bug',
                 'poison', 'steel', 'ground', 'ice', 'psychic', 'ghost', 'fairy'];
    let check = (pokeTypes) => typeFilter.map(item => item.toLowerCase()).every(type => {
        return pokeTypes.includes(type);
    });
    if(!check(types)){
        throw 'Given types does not match available types.';
    }
    return pokemon.filter(poke => {
        let types = [];
        poke.type.forEach(pType => {
            types.push(pType.type.name);
        });
        return check(types);
    });
}
// Given a list of pokemon, return an array of pokemon whose name match a given substring
function filterByName(pokemon, nameString){
    return pokemon.filter(poke => poke.name.includes(nameString.toLowerCase()));
}
// Given a list of pokemon, return an array of pokemon whose weight resides in a specific range
function filterByWeight(pokemon, startWeight, endWeight){
    return pokemon.filter(poke => {
        if(poke.weight >= startWeight && poke.weight <= endWeight){
            return true;
        }else return false;
    });
}
// Given a list of pokemon, return an array of pokemon whose height resides in a specific range
function filterByHeight(pokemon, startHeight, endHeight){
    return pokemon.filter(poke => {
        if(poke.height >= startHeight && poke.height <= endHeight){
            return true;
        }else return false;
    });
}

// Exports
exports.filterByType = filterByType;
exports.filterByName = filterByName;
exports.filterByWeight = filterByWeight;
exports.filterByHeight = filterByHeight;
exports.filterPokemon = filterPokemon;