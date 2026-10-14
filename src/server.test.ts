import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { server } from './server.js';

const port = 3001;
const baseUrl = `http://127.0.0.1:${port}`;

beforeAll(() => {
    server.listen(port, '127.0.0.1');
});

afterAll(() => {
    server.close();
});

describe('Tests des routes de l\'API Pokétrainer', () => {

    it('GET /wild devrait retourner un Pokémon mocké (Statut 200)', async () => {
        // réponse a envoyer (faux pokémon)
        const fausseReponsePokeApi = {
            id: 25,
            name: "pikachu",
            types: [{ type: { name: "electric" } }],
            stats: [{ base_stat: 35, stat: { name: "hp" } }]
        };
        //en cas de fetch on mock
        const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue({
            json: async () => fausseReponsePokeApi
        } as Response);
        const response = await fetch(`${baseUrl}/wild`);
        const data = await response.json();
        //Verif http
        expect(response.status).toBe(200);

        //verif pokemon mocké
        expect(data.pokemon.id).toBe(25);
        expect(data.pokemon.name).toBe("pikachu");

        //effacement mock
        vi.restoreAllMocks();
    });

    it('GET /wild devrait retourner un Pokémon (Statut 200)', async () => {
        // On fait une vraie requête HTTP avec le fetch natif
        const response = await fetch(`${baseUrl}/wild`);
        const data = await response.json();

        // Vérifications de la réponse HTTP
        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toContain('application/json');

        // Vérifications des données
        expect(data).toHaveProperty('pokemon');
        expect(data.pokemon).toHaveProperty('id');
        expect(data.pokemon).toHaveProperty('name');
    });

    it('POST /capture/:id avec un mauvais ID devrait renvoyer une erreur 400', async () => {
        // On tente de capturer un ID au hasard
        const response = await fetch(`${baseUrl}/capture/99999`, {
            method: 'POST'
        });

        // node:http renvoie le texte avec des guillemets via JSON.stringify
        const text = await response.text();

        expect(response.status).toBe(400);
        expect(text).toContain('This Pokémon was not the last encounter.');
    });

    it('GET /pokedex devrait retourner un tableau (Statut 200)', async () => {
        const response = await fetch(`${baseUrl}/pokedex`);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
    });
});