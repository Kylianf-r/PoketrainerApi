import { randomInt } from 'node:crypto';
import express from 'express';
import { v4 } from 'uuid';


const app = express();
const port = 3000;
const capturedHistory: number[] = [];
let lastEncounter = 0;

async function callPoke(id : number){
    const getpoke = await fetch('https://pokeapi.co/api/v2/pokemon/'+id);
    const data = await getpoke.json();

    const poke = {
        "pokemon": {
            "id": data.id,
            "name": data.name,
            // "sprite": data.,
            "types": data.types,
            "stats": data.stats
        },
        // "captureRate": 190
    };
    return poke;
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/wild', (async (req, res) => {
    const randomId = randomInt(1,1025);
    lastEncounter = randomId;
    const randomPoke = await callPoke(randomId)

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(randomPoke));
}))

app.post('/capture/:id', (async(req, res) => {
    const luck = randomInt(1,100);
    const captureRate = randomInt(1,100);
    const id = req.params.id;
    res.setHeader('Content-Type', 'application/json');

    if (id != lastEncounter){
        res.statusCode = 400;
        res.end(JSON.stringify("This Pokémon was not the last encounter."))
    }

    if (Number.isInteger(Number(id))) {
        res.statusCode = 200;
        if (luck >= captureRate){
            if (!capturedHistory.includes(Number(id))) {
                capturedHistory.unshift(Number(id));
            }
            res.statusCode = 201;
            const curPoke = await callPoke(lastEncounter);
            const resultat = {
                "success": true,
                "captured": {
                    "uuid": v4(),
                    "pokemonId": lastEncounter,
                    "name": curPoke.pokemon.name,
                    "nickname": curPoke.pokemon.name,
                    "capturedAt": new Date().toISOString()
                }
            }
            res.end(JSON.stringify(resultat));
        } else{
            const resultat = { "success": false, "message": "Oh non ! Le Pokémon s'est échappé !" }
            res.end(JSON.stringify(resultat));}
    } else {
        res.statusCode = 400;
        res.end(JSON.stringify("Invalid Pokémon ID"));
    }
}))

app.get("/pokedex", (async(req, res) =>  {
    res.setHeader('Content-Type', 'application/json');
    const resultat: any[] = [];

    for (const id of capturedHistory) {
        resultat.push(await callPoke(Number(id)));
    }

    res.statusCode = 200;
    res.end(JSON.stringify(resultat));
}))

export { app };

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Serveur Express démarré sur http://127.0.0.1:${port}/`);
    });
}

