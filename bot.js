const { Builder, By, Key, until } = require('selenium-webdriver');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config(); // Adicione esta linha para carregar variáveis de ambiente

const app = express();
const port = 3000;
let capturedMessage;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const TOKEN = process.env.DISCORD_TOKEN; // Use a variável de ambiente para o token

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    if (message.author.bot && message.author.username === 'Spidey Bot') {
        capturedMessage = message.content.slice(-9);
        console.log(capturedMessage);
    }
});

// Habilitar CORS
app.use(cors());

app.get('/capturedMessage', (req, res) => {
    res.json({ capturedMessage: capturedMessage });
});

client.login(TOKEN);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
