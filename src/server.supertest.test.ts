import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from './server.js';

describe('Supertest - Routes de l API Pokétrainer', () => {

    it('GET /wild devrait retourner un vrai Pokémon (Statut 200)', async () => {
        // La magie Supertest : on lui passe directement le serveur et la route
        const response = await request(app).get('/wild');

        // Vérifications HTTP
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/json');

        // On vérifie que la structure est correcte
        expect(response.body).toHaveProperty('pokemon');
        expect(response.body.pokemon).toHaveProperty('id');
        expect(response.body.pokemon).toHaveProperty('name');

        // On s'assure que les types de données sont bons
        expect(typeof response.body.pokemon.id).toBe('number');
        expect(typeof response.body.pokemon.name).toBe('string');
    });

    it('404 (Not Found) /wild', async () => {

    });

    /*it('POST /capture/:id avec un mauvais ID devrait renvoyer une erreur 400', async () => {
        // Supertest permet d'enchaîner le type de requête très facilement
        const response = await request(server).post('/capture/6');

        expect(response.status).toBe(400);
        expect(response.text).toContain('This Pokémon was not the last encounter.');
    });

    it('GET /pokedex devrait retourner un tableau', async () => {
        const response = await request(server).get('/pokedex');

        expect(response.status).toBe(200);
        // On utilise response.body directement
        expect(Array.isArray(response.body)).toBe(true);
    });*/

});