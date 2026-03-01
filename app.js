const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('<h1>Hello World! Denna sida körs på min Contabo VPS via ett deploy-skript.</h1>');
});

// Viktigt: Lyssna på 0.0.0.0 för att ta emot trafik utifrån
app.listen(port, '0.0.0.0', () => {
  console.log(`Webbservern är igång på port ${port}`);
});