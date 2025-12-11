const appSettings = require('../config/settings');

module.exports = {
  sendSettings: async function(client, sender) {
    try {
      console.log(`⚙️  Mengirim pengaturan ke ${sender}`);
      
      const settingsMessage = `⚙️ *PENGATURAN BOT ${appSettings.botSettings.name}*

*Versi:* ${appSettings.botSettings.version}
*Status:* ${appSettings.botSettings.autoReply ? 'Aktif' : 'Nonaktif'}
*Bahasa:* ${appSettings.botSettings.language === 'id' ? 'Indonesia' : 'English'}

*Fitur yang aktif:*`;
      
      await client.sendMessage(sender, settingsMessage);
      
      // Buat list pengaturan
      const settingsList = {
        title: "PENGATURAN BOT",
        text: "Pilih pengaturan yang ingin diubah:",
        buttonText: "UBAH PENGATURAN",
        sections: [
          {
            title: "🔔 NOTIFIKASI",
            rows: [
              {
                id: "setting_notif_order",
                title: "📦 Notif Pesanan Baru",
                description: appSettings.notifications.newOrder ? "AKTIF" : "NONAKTIF"
              },
              {
                id: "setting_notif_payment",
                title: "💳 Notif Konfirmasi Bayar",
                description: appSettings.notifications.paymentConfirm ? "AKTIF" : "NONAKTIF"
              },
              {
                id: "setting_notif_admin",
                title: "👤 Notif ke Admin",
                description: appSettings.notifications.adminAlert ? "AKTIF" : "NONAKTIF"
              }
            ]
          },
          {
            title: "💳 PEMBAYARAN",
            rows: [
              {
                id: "setting_pay_cod",
                title: "💰 Cash on Delivery",
                description: appSettings.payment.allowCOD ? "DIIZINKAN" : "TIDAK"
              },
              {
                id: "setting_pay_auto",
                title: "🤖 Auto Konfirmasi",
                description: appSettings.payment.autoConfirm ? "AKTIF" : "MANUAL"
              },
              {
                id: "setting_pay_timeout",
                title: "⏰ Timeout Pembayaran",
                description: `${appSettings.payment.paymentTimeout} jam`
              }
            ]
          },
          {
            title: "🔧 LAINNYA",
            rows: [
              {
                id: "setting_lang",
                title: "🌐 Bahasa",
                description: appSettings.botSettings.language === 'id' ? "Indonesia" : "English"
              },
              {
                id: "setting_reset",
                title: "🔄 Reset Chat",
                description: "Reset percakapan dengan bot"
              },
              {
                id: "setting_help",
                title: "❓ Bantuan Teknis",
                description: "Panduan penggunaan bot"
              }
            ]
          }
        ]
      };
      
      try {
        await client.sendMessage(sender, settingsList);
      } catch (error) {
        console.log("⚠️  Gagal kirim list settings");
        await sendFallbackSettings(client, sender);
      }
      
      // Info untuk admin/owner
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const adminInfo = `👑 *INFORMASI UNTUK ADMIN:*

Bot ini dibuat khusus untuk toko online dengan fitur:
✅ Support iOS button list
✅ Katalog produk interaktif
✅ Multi metode pembayaran
✅ Auto reply 24/7
✅ Database order

*Perintah Admin (jika ada akses):*
• /stats - Lihat statistik
• /backup - Backup data
• /broadcast - Kirim broadcast
• /logout - Logout dari bot

Untuk akses admin, hubungi developer.`;
      
      await client.sendMessage(sender, adminInfo);
      
      // Button untuk admin
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const adminButtons = {
        text: "🔧 *TOOLS ADMIN:*",
        buttons: [
          {
            buttonId: 'btn_stats',
            buttonText: { displayText: '📊 Stats Bot' }
          },
          {
            buttonId: 'btn_restart',
            buttonText: { displayText: '🔄 Restart Bot' }
          },
          {
            buttonId: 'btn_logout',
            buttonText: { displayText: '🚪 Logout Bot' }
          }
        ],
        footer: "Hanya untuk admin yang berwenang"
      };
      
      await client.sendMessage(sender, adminButtons);
      
    } catch (error) {
      console.error("❌ Error di settings.js:", error);
      await client.sendMessage(sender, "⚙️ Pengaturan bot:\nAuto Reply: Aktif\nLanguage: Indonesia\nVersion: 1.0.0");
    }
  }
};

// Fallback settings
async function sendFallbackSettings(client, sender) {
  const fallbackText = `⚙️ *PENGATURAN BOT:*

1. *NOTIFIKASI:*
   • Pesanan Baru: ${appSettings.notifications.newOrder ? 'AKTIF' : 'NONAKTIF'}
   • Konfirmasi Bayar: ${appSettings.notifications.paymentConfirm ? 'AKTIF' : 'NONAKTIF'}

2. *PEMBAYARAN:*
   • COD: ${appSettings.payment.allowCOD ? 'DIIZINKAN' : 'TIDAK'}
   • Auto Konfirmasi: ${appSettings.payment.autoConfirm ? 'AKTIF' : 'MANUAL'}

3. *UMUM:*
   • Bahasa: ${appSettings.botSettings.language === 'id' ? 'Indonesia' : 'English'}
   • Auto Reply: ${appSettings.botSettings.autoReply ? 'AKTIF' : 'NONAKTIF'}

Untuk perubahan pengaturan, hubungi developer bot.`;
  
  await client.sendMessage(sender, fallbackText);
}
