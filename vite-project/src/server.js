import express from 'express';
import axios from 'axios';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Endpoint do pobrania aktualnego numeru patcha
app.get('/api/patch-version', async (req, res) => {
  try {
    const response = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
    const currentPatchVersion = response.data[0]; // Pobierz pierwszą pozycję, która zawiera aktualny numer patcha
    res.json({ patchVersion: currentPatchVersion });
  } catch (error) {
    console.error('Wystąpił błąd podczas pobierania numeru patcha:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas pobierania numeru patcha' });
  }
});

// Endpoint do pobrania listy championów
app.get('/api/champions', async (req, res) => {
  try {
    const response = await axios.get('https://ddragon.leagueoflegends.com/cdn/lol/version/data/en_US/champion.json');
    const champions = Object.keys(response.data.data);
    res.json({ champions });
  } catch (error) {
    console.error('Wystąpił błąd podczas pobierania listy championów:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas pobierania listy championów' });
  }
});

app.listen(PORT, () => {
  console.log(`Serwer Express.js działa na porcie ${PORT}`);
});