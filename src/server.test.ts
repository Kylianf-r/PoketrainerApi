import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { server } from './server.js'; // Assure-toi que le serveur est bien exporté à la fin de ton server.ts

const port = 3001; // On utilise un port différent pour les tests
const baseUrl = `http://127.0.0.1:${port}`;

// S'exécute une seule fois avant tous les tests
beforeAll(() => {
    server.listen(port, '127.0.0.1');
});

// S'exécute une seule fois après tous les tests
afterAll(() => {
    server.close();
});

describe('Tests des routes de l\'API Pokétrainer', () => {

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