/*
    This is a utility module for implementing filtering functions of the pokemon list.
*/

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

}

// Exports
exports.filterByType = filterByType;