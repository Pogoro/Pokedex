const { Client } = require('pg');
const requests = require('./requests.js')
/*
    This is a utility module for caching and querying the postgres database.
*/

// The following is for a local testing PostGres database. It will be used if not deployed on Heroku.
const LOCAL_USER = 'api';
const LOCAL_PASS = 'testpass';
const LOCAL_HOST = 'localhost:5432';
const LOCAL_DB = 'pokemon_api';
// PostGres client
const client = new Client({
    connectionString: process.env.DATABASE_URL || `postgresql://${LOCAL_USER}:${LOCAL_PASS}@${LOCAL_HOST}/${LOCAL_DB}`
});

client.connect();

// Example of how to query data:

// updateCache().then(() => {
//     console.log("Finished caching!");
//     client.query('SELECT data FROM pokemon WHERE ID = 1;').then(res => {
//         console.log(JSON.parse(res.rows[0].data));
//     });
// });

function updateCache(){
    return new Promise((resolve, reject) => {
        let pokemon = [];
        requests.getAllPokemon().then(res => {
            pokemon = res;
            let promises = [];
            pokemon.forEach(pokemon => {
                promises.push(
                    client.query(`INSERT INTO pokemon (id, data) VALUES ($1, $2)
                                ON CONFLICT (id)
                                DO
                                    UPDATE SET data = $2;`,
                    [pokemon.id, JSON.stringify(pokemon)])
                );
            });
            Promise.all(promises).then(res => {
                resolve();
            });
        })
        .catch(err => {
            reject(err);
        });

    });
}

// Export statements
exports.updateCache = updateCache;