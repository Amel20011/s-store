const storeData = require('../config/store-data');

module.exports = {
  sendOwnerInfo: async function(client, sender) {
    try {
      console.log(`👤 Mengirim info owner ke ${sender}`);
      
      const ownerMessage = `👤 *INFORMASI PEMILIK ${storeData.storeName.toUpperCase()}*

*Nama:* ${storeData.ownerName}
*Role:* ${storeData.ownerRole}
*WhatsApp:* ${storeData.ownerPhone}
*Email:* ${storeData.ownerEmail}
*Jam Kerja:* ${storeData.operationalHours}

*Bisa dihubungi untuk:*
• Konfirmasi pembayaran
• Pertanyaan produk
• Komplain/keluhan
• Kerjasama bisnis
• Informasi lainnya

*Sosial Media Toko:*
📸 Instagram: ${storeData.socialMedia.instagram}
📘 Facebook: ${storeData.socialMedia.facebook}
🎵 TikTok: ${storeData.socialMedia.tiktok}`;
      
      await client.sendMessage(sender, ownerMessage);
      
      // Tunggu sebentar
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Buat button list untuk kontak
      const contactList = {
        title: "HUBUNGI KAMI",
        text: "Pilih cara menghubungi:",
        buttonText: "HUBUNGI",
        sections: [
          {
            title: "📞 TELEPON / CHAT",
            rows: [
              {
                id: "contact_whatsapp",
                title: "💬 Chat WhatsApp",
                description: "Chat langsung ke owner"
              },
              {
                id: "contact_call",
                title: "📞 Telepon Langsung",
                description: "Hubungi via telepon"
              },
              {
                id: "contact_email",
                title: "📧 Kirim Email",
                description: "Kirim email ke owner"
              }
            ]
          },
          {
            title: "📍 LOKASI & INFO",
            rows: [
              {
                id: "contact_location",
                title: "📍 Lokasi Toko",
                description: "Dapatkan alamat lengkap"
              },
              {
                id: "contact_about",
                title: "🏪 Tentang Toko",
                description: "Profil lengkap toko kami"
              },
              {
                id: "contact_faq",
                title: "❓ FAQ",
                description: "Pertanyaan yang sering diajukan"
              }
            ]
          }
        ]
      };
      
      try {
        await client.sendMessage(sender, contactList);
      } catch (error) {
        console.log("⚠️  Gagal kirim list kontak");
        await sendFallbackContact(client, sender);
      }
      
      // Kirim button quick action
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const quickButtons = {
        text: "⏩ *ACTION CEPAT:*",
        buttons: [
          {
            buttonId: 'btn_chat_owner',
            buttonText: { displayText: '💬 Chat Owner' }
          },
          {
            buttonId: 'btn_location',
            buttonText: { displayText: '📍 Dapatkan Lokasi' }
          },
          {
            buttonId: 'btn_menu',
            buttonText: { displayText: '🏠 Menu Utama' }
          }
        ],
        footer: "Klik untuk aksi cepat"
      };
      
      await client.sendMessage(sender, quickButtons);
      
    } catch (error) {
      console.error("❌ Error di owner.js:", error);
      await client.sendMessage(sender, `Hubungi Owner:\nNama: ${storeData.ownerName}\nWA: ${storeData.ownerPhone}`);
    }
  }
};

// Fallback contact info
async function sendFallbackContact(client, sender) {
  const fallbackText = `📞 *CARA HUBUNGI OWNER:*

1. *WHATSAPP:* ${storeData.ownerPhone}
2. *TELEPON:* ${storeData.ownerPhone}
3. *EMAIL:* ${storeData.ownerEmail}
4. *ALAMAT:* ${storeData.storeAddress}

*Format chat ke owner:*
"Hi Admin, saya ingin tanya tentang [produk/pesanan]"

*Jam Response:*
${storeData.operationalHours} (Setiap Hari)

Mohon bersabar menunggu balasan, terima kasih!`;
  
  await client.sendMessage(sender, fallbackText);
}
