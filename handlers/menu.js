const storeData = require('../config/store-data');
const settings = require('../config/settings');

module.exports = {
  sendMenu: async function(client, sender) {
    try {
      console.log(`📋 Mengirim menu ke ${sender}`);
      
      // Header pesan
      const welcomeMessage = `🛍️ *SELAMAT DATANG DI ${storeData.storeName.toUpperCase()}*

Halo! 👋 Kami melayani dengan sepenuh hati.

📅 *Jam Operasional:* ${storeData.operationalHours}
📍 *Lokasi:* ${storeData.storeAddress}

Silakan pilih menu di bawah ini:`;

      // Kirim pesan welcome dulu
      await client.sendMessage(sender, welcomeMessage);
      
      // Tunggu sebentar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Buat button list untuk iOS
      const menuList = {
        title: "📱 MENU UTAMA",
        text: "Pilih salah satu opsi:",
        buttonText: "BUKA MENU",
        sections: [
          {
            title: "🛒 BELANJA",
            rows: [
              {
                id: "menu_store",
                title: "📦 LIHAT PRODUK",
                description: "Lihat semua produk yang tersedia"
              },
              {
                id: "menu_promo", 
                title: "🎉 PROMO HARI INI",
                description: "Diskon dan penawaran spesial"
              },
              {
                id: "menu_bestseller",
                title: "⭐ PRODUK TERLARIS",
                description: "Produk favorit pelanggan"
              }
            ]
          },
          {
            title: "💳 PEMBAYARAN & PESANAN",
            rows: [
              {
                id: "menu_payment",
                title: "💳 CARA BAYAR",
                description: "Metode pembayaran yang tersedia"
              },
              {
                id: "menu_order",
                title: "🛒 CARA PESAN",
                description: "Cara memesan produk"
              },
              {
                id: "menu_track",
                title: "🚚 LACAK PESANAN",
                description: "Cek status pengiriman"
              }
            ]
          },
          {
            title: "ℹ️ INFORMASI",
            rows: [
              {
                id: "menu_owner",
                title: "👤 HUBUNGI OWNER",
                description: "Chat langsung dengan admin"
              },
              {
                id: "menu_about",
                title: "🏪 TENTANG KAMI",
                description: "Profil toko kami"
              },
              {
                id: "menu_help",
                title: "❓ BANTUAN",
                description: "Panduan penggunaan bot"
              }
            ]
          }
        ]
      };

      // Kirim sebagai interactive message
      try {
        await client.sendMessage(sender, menuList);
      } catch (error) {
        console.log("⚠️  Gagal kirim list, gunakan fallback");
        await sendFallbackMenu(client, sender);
      }
      
      // Kirim button quick action
      const quickButtons = {
        text: "⏩ *ATAU PILIH CEPAT:*",
        buttons: [
          {
            buttonId: 'btn_store',
            buttonText: { displayText: '📦 Lihat Produk' }
          },
          {
            buttonId: 'btn_promo',
            buttonText: { displayText: '🎉 Lihat Promo' }
          },
          {
            buttonId: 'btn_owner',
            buttonText: { displayText: '👤 Hubungi Owner' }
          }
        ],
        footer: "Klik salah satu button di atas"
      };
      
      await new Promise(resolve => setTimeout(resolve, 500));
      await client.sendMessage(sender, quickButtons);
      
    } catch (error) {
      console.error("❌ Error di menu.js:", error);
      await client.sendMessage(sender, "❌ Maaf, terjadi kesalahan. Silakan coba *help* untuk bantuan.");
    }
  }
};

// Fallback jika list tidak support
async function sendFallbackMenu(client, sender) {
  const fallbackMenu = `📋 *MENU UTAMA ${storeData.storeName}*

*KETIK PERINTAH BERIKUT:*

1. 📦 *LIHAT PRODUK*
   Ketik: *store*

2. 🎉 *PROMO HARI INI*
   Ketik: *promo*

3. ⭐ *PRODUK TERLARIS*
   Ketik: *best*

4. 💳 *CARA BAYAR*
   Ketik: *bayar*

5. 🛒 *CARA PESAN*
   Ketik: *pesan*

6. 🚚 *LACAK PESANAN*
   Ketik: *lacak*

7. 👤 *HUBUNGI OWNER*
   Ketik: *owner*

8. 🏪 *TENTANG KAMI*
   Ketik: *about*

9. ❓ *BANTUAN*
   Ketik: *help*

10. ⚙️ *PENGATURAN*
    Ketik: *setting*

📱 *Support WhatsApp iOS & Android*`;
  
  await client.sendMessage(sender, fallbackMenu);
}
