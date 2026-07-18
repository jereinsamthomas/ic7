import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        clubCup: resolve(__dirname, 'tour-club-world-cup.html'),
        coopaDuo: resolve(__dirname, 'tour-coopa-duo.html'),
        districtoCup: resolve(__dirname, 'tour-districto-cup.html'),
        evolutionCup: resolve(__dirname, 'tour-evolution-cup.html'),
        intimateCup: resolve(__dirname, 'tour-intimate-cup.html'),
        worldCup: resolve(__dirname, 'tour-world-cup.html'),
        registration: resolve(__dirname, 'tournament-registration.html'),
      }
    }
  }
});
