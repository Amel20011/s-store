const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

// Import handlers
const menuHandler = require('./handlers/menu');
const storeHandler = require('./handlers/store');
const paymentHandler = require('./handlers/payment');
const ownerHandler = require('./handlers/owner');
const settingsHandler = require('./handlers/settings');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize WhatsApp Client with iOS support config
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    },
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
    }
});

// Generate QR Code
client.on('qr', (qr) => {
    console.log('Scan QR Code ini di WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// When client is ready
client.on('ready', () => {
    console.log('✅ Bot WhatsApp Store siap digunakan!');
    console.log('📱 Support iOS button list aktif');
});

// Message handler
client.on('message', async (message) => {
    try {
        const text = message.body.toLowerCase() || '';
        const sender = message.from;
        
        // Handle different commands
        if (text === 'menu' || text === 'm') {
            await menuHandler.sendMenu(client, sender);
        }
        else if (text === 'store' || text === 'produk') {
            await storeHandler.sendProducts(client, sender);
        }
        else if (text.includes('bayar') || text.includes('payment')) {
            await paymentHandler.sendPaymentOptions(client, sender);
        }
        else if (text === 'owner' || text === 'admin') {
            await ownerHandler.sendOwnerInfo(client, sender);
        }
        else if (text === 'setting' || text === 'settings') {
            await settingsHandler.sendSettings(client, sender);
        }
        else if (text === 'help' || text === 'bantuan') {
            await sendHelpMessage(client, sender);
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
});

// Send help message
async function sendHelpMessage(client, sender) {
    const helpText = `🛍️ *TOKO BOT HELP*

Ketik:
• *menu* - Lihat menu utama
• *store* - Lihat produk
• *bayar* - Info pembayaran
• *owner* - Hubungi owner
• *setting* - Pengaturan

Bot ini support button list untuk iOS! 📱`;
    
    await client.sendMessage(sender, helpText);
}

// Start Express server for monitoring
app.get('/', (req, res) => {
    res.send('WhatsApp Store Bot is running!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Initialize WhatsApp client
client.initialize();
