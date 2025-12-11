const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const fs = require('fs');
const path = require('path');

// Import handlers
const menuHandler = require('./handlers/menu');
const storeHandler = require('./handlers/store');
const paymentHandler = require('./handlers/payment');
const ownerHandler = require('./handlers/owner');
const settingsHandler = require('./handlers/settings');

// Import config
const storeData = require('./config/store-data');
const appSettings = require('./config/settings');

const app = express();
const PORT = process.env.PORT || 3000;

// Buat folder data jika belum ada
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

// Initialize WhatsApp Client with iOS support
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "store-bot"
  }),
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
  console.log('╔════════════════════════════════════════╗');
  console.log('║      SCAN QR CODE UNTUK LOGIN         ║');
  console.log('╚════════════════════════════════════════╝');
  qrcode.generate(qr, { small: true });
  console.log('\n📱 Scan QR Code di atas dengan WhatsApp');
  console.log('📊 Status: Menunggu scan...');
});

// When client is ready
client.on('ready', () => {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   ✅ BOT WHATSAPP STORE SIAP PAKAI!   ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`\n🏪 Store: ${storeData.storeName}`);
  console.log(`👤 Owner: ${storeData.ownerName}`);
  console.log(`📞 Phone: ${storeData.storePhone}`);
  console.log('\n🚀 Bot sedang berjalan...');
  console.log('📱 Support iOS button list: AKTIF');
});

// Message handler
client.on('message', async (message) => {
  try {
    const text = message.body.toLowerCase() || '';
    const sender = message.from;
    const isGroup = message.from.endsWith('@g.us');
    
    // Skip pesan dari group jika setting nonaktif
    if (isGroup && !appSettings.allowGroups) return;
    
    // Log pesan
    console.log(`📩 Pesan dari: ${message.from} -> ${message.body.substring(0, 50)}...`);
    
    // Handle commands
    if (text === 'menu' || text === 'm' || text === 'mulai') {
      await menuHandler.sendMenu(client, sender);
    }
    else if (text === 'store' || text === 'produk' || text === 'produk?') {
      await storeHandler.sendProducts(client, sender);
    }
    else if (text.includes('bayar') || text.includes('payment') || text.includes('pembayaran')) {
      await paymentHandler.sendPaymentOptions(client, sender);
    }
    else if (text === 'owner' || text === 'admin' || text === 'cs') {
      await ownerHandler.sendOwnerInfo(client, sender);
    }
    else if (text === 'setting' || text === 'settings' || text === 'pengaturan') {
      await settingsHandler.sendSettings(client, sender);
    }
    else if (text === 'help' || text === 'bantuan' || text === '?') {
      await sendHelpMessage(client, sender);
    }
    else if (text === 'status' || text === 'cek') {
      await sendStatus(client, sender);
    }
    else if (text === 'promo' || text.includes('diskon')) {
      await sendPromo(client, sender);
    }
    else if (text === 'test') {
      await client.sendMessage(sender, '✅ Bot aktif dan berjalan normal!');
    }
    else if (text.startsWith('pesan') || text.startsWith('order')) {
      await handleOrder(client, sender, text);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    try {
      await client.sendMessage(message.from, '❌ Maaf, terjadi error. Silakan coba lagi atau hubungi owner.');
    } catch (e) {}
  }
});

// Fungsi bantuan
async function sendHelpMessage(client, sender) {
  const helpText = `🛍️ *BOT BANTUAN ${storeData.storeName.toUpperCase()}*

*PERINTAH YANG TERSEDIA:*
• *menu* - Tampilkan menu utama
• *store* - Lihat produk yang dijual
• *bayar* - Info cara pembayaran
• *owner* - Hubungi pemilik toko
• *setting* - Pengaturan bot
• *promo* - Lihat promo hari ini
• *status* - Cek status bot
• *help* - Tampilkan bantuan ini

*CONTOH PEMESANAN:*
pesan [nama produk] [jumlah]
Contoh: pesan nasi goreng 2

📱 *Bot ini support button untuk iOS & Android*`;
  
  await client.sendMessage(sender, helpText);
}

async function sendStatus(client, sender) {
  const statusText = `📊 *STATUS BOT*

🏪 Store: ${storeData.storeName}
✅ Status: Aktif & Online
🕒 Jam Operasional: ${storeData.operationalHours}
👤 Owner: ${storeData.ownerName}
📞 Telp: ${storeData.storePhone}

Bot ini berjalan dengan baik!
Terakhir diupdate: ${new Date().toLocaleDateString('id-ID')}`;
  
  await client.sendMessage(sender, statusText);
}

async function sendPromo(client, sender) {
  const promoText = `🎉 *PROMO SPESIAL HARI INI!*

🔥 *DISCOUNT 30%* untuk pembelian pertama!
Gunakan kode: WELCOME30

🎁 *BUY 1 GET 1* untuk produk tertentu
📦 *FREE ONGKIR* min. pembelian Rp 100.000

⏰ *Promo berlaku sampai:* ${new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString('id-ID')}

*Syarat & Ketentuan:*
1. Promo tidak bisa digabung
2. Minimal pembelian Rp 50.000
3. Berlaku untuk 100 customer pertama

Ketik *store* untuk lihat produk!`;
  
  await client.sendMessage(sender, promoText);
}

async function handleOrder(client, sender, text) {
  const orderText = `🛒 *FORMAT PEMESANAN*

Untuk memesan, silakan gunakan format:
*pesan [nama produk] [jumlah]*

Contoh:
• pesan nasi goreng 2
• pesan ayam bakar 1
• pesan es teh 3

Atau ketik *store* dulu untuk melihat produk yang tersedia.

Setelah pesan, admin akan menghubungi Anda untuk konfirmasi.`;
  
  await client.sendMessage(sender, orderText);
}

// Error handling
client.on('auth_failure', (msg) => {
  console.error('❌ Auth failure:', msg);
});

client.on('disconnected', (reason) => {
  console.log('❌ Client disconnected:', reason);
});

// Start Express server
app.use(express.json());
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    store: storeData.storeName,
    owner: storeData.ownerName,
    message: 'WhatsApp Store Bot is running!'
  });
});

app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`🌐 Server berjalan di http://localhost:${PORT}`);
  console.log(`📡 Webhook siap menerima request`);
});

// Initialize WhatsApp
console.log('🚀 Memulai WhatsApp Store Bot...');
client.initialize();

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Menghentikan bot...');
  client.destroy();
  process.exit(0);
});
