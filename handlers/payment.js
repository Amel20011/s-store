const storeData = require('../config/store-data');

module.exports = {
  sendPaymentOptions: async function(client, sender) {
    try {
      console.log(`💳 Mengirim info pembayaran ke ${sender}`);
      
      // Header message
      const headerMessage = `💳 *INFORMASI PEMBAYARAN ${storeData.storeName.toUpperCase()}*

Kami menerima berbagai metode pembayaran untuk kenyamanan Anda.`;
      
      await client.sendMessage(sender, headerMessage);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Buat list metode pembayaran
      const paymentList = {
        title: "METODE PEMBAYARAN",
        text: "Pilih metode untuk detail:",
        buttonText: "PILIH METODE",
        sections: [
          {
            title: "🏦 TRANSFER BANK",
            rows: storeData.paymentMethods.banks.map(bank => ({
              id: `bank_${bank.name.toLowerCase()}`,
              title: `${bank.icon || '🏦'} ${bank.name}`,
              description: `No. Rek: ${bank.number}`
            }))
          },
          {
            title: "📱 E-WALLET / QRIS",
            rows: storeData.paymentMethods.ewallets.map(ewallet => ({
              id: `ewallet_${ewallet.name.toLowerCase()}`,
              title: `${ewallet.icon || '📱'} ${ewallet.name}`,
              description: `No: ${ewallet.number}`
            }))
          },
          {
            title: "💰 LAINNYA",
            rows: [
              {
                id: "payment_cod",
                title: "💰 Cash on Delivery (COD)",
                description: storeData.paymentMethods.cod.available ? 
                  `Tersedia (Fee: Rp ${storeData.paymentMethods.cod.fee.toLocaleString('id-ID')})` : 
                  "Tidak tersedia"
              },
              {
                id: "payment_qris",
                title: "📲 QRIS",
                description: "Scan bayar dengan QR Code"
              }
            ]
          }
        ]
      };
      
      try {
        await client.sendMessage(sender, paymentList);
      } catch (error) {
        console.log("⚠️  Gagal kirim list pembayaran");
        await sendFallbackPayment(client, sender);
      }
      
      // Kirim detail rekening setelah delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const detailMessage = `📋 *DETAIL REKENING BANK:*

${storeData.paymentMethods.banks.map(bank => 
  `${bank.icon || '🏦'} *${bank.name}*\n` +
  `No. Rek: *${bank.number}*\n` +
  `Atas Nama: *${bank.holder}*\n`
).join('\n')}

*PENTING:*
1. Konfirmasi pembayaran maksimal 3 jam setelah transfer
2. Simpan bukti transfer
3. Kirim screenshot ke admin untuk konfirmasi
4. Status akan diperbarui otomatis

💡 *TIP:* Gunakan QRIS untuk pembayaran lebih cepat!`;
      
      await client.sendMessage(sender, detailMessage);
      
      // Kirim button untuk konfirmasi
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const confirmButtons = {
        text: "✅ *KONFIRMASI PEMBAYARAN*",
        buttons: [
          {
            buttonId: 'btn_confirm_payment',
            buttonText: { displayText: '📸 Kirim Bukti Bayar' }
          },
          {
            buttonId: 'btn_contact_admin',
            buttonText: { displayText: '👤 Hubungi Admin' }
          },
          {
            buttonId: 'btn_check_order',
            buttonText: { displayText: '📦 Cek Pesanan' }
          }
        ],
        footer: "Klik untuk konfirmasi pembayaran"
      };
      
      await client.sendMessage(sender, confirmButtons);
      
    } catch (error) {
      console.error("❌ Error di payment.js:", error);
      await client.sendMessage(sender, "❌ Maaf, info pembayaran sedang tidak dapat diakses.");
    }
  }
};

// Fallback payment info
async function sendFallbackPayment(client, sender) {
  let paymentText = `💳 *METODE PEMBAYARAN:*

🏦 *TRANSFER BANK:*
${storeData.paymentMethods.banks.map(bank => 
  `• ${bank.name}: ${bank.number} (${bank.holder})`
).join('\n')}

📱 *E-WALLET:*
${storeData.paymentMethods.ewallets.map(ewallet => 
  `• ${ewallet.name}: ${ewallet.number}`
).join('\n')}

💰 *CASH ON DELIVERY (COD):*
${storeData.paymentMethods.cod.available ? 
  `Tersedia untuk area: ${storeData.paymentMethods.cod.areas.join(', ')}\n` +
  `Biaya: Rp ${storeData.paymentMethods.cod.fee.toLocaleString('id-ID')}` : 
  'Saat ini tidak tersedia'}

📋 *PROSEDUR PEMBAYARAN:*
1. Lakukan transfer ke rekening di atas
2. Simpan bukti transfer
3. Kirim bukti ke admin
4. Tunggu konfirmasi (maks 3 jam)
5. Pesanan akan diproses

Untuk pertanyaan, ketik: *owner*`;
  
  await client.sendMessage(sender, paymentText);
}
