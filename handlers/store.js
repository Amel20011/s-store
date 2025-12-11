const fs = require('fs');
const path = require('path');

// Load produk dari file
let products = [];
try {
  const productsData = fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8');
  products = JSON.parse(productsData);
} catch (error) {
  console.log("⚠️  File products.json tidak ditemukan, menggunakan data default");
  products = [
    {
      id: "1",
      name: "Nasi Goreng Spesial",
      price: 25000,
      stock: 50,
      category: "makanan",
      description: "Nasi goreng dengan telur, ayam, dan sayuran",
      emoji: "🍛"
    },
    {
      id: "2",
      name: "Ayam Bakar Madu",
      price: 35000,
      stock: 30,
      category: "makanan",
      description: "Ayam bakar dengan saus madu spesial",
      emoji: "🍗"
    },
    {
      id: "3",
      name: "Es Teh Manis",
      price: 8000,
      stock: 100,
      category: "minuman",
      description: "Es teh dengan gula pasir",
      emoji: "🥤"
    },
    {
      id: "4",
      name: "Mie Goreng Jawa",
      price: 20000,
      stock: 40,
      category: "makanan",
      description: "Mie goreng khas Jawa dengan bumbu rempah",
      emoji: "🍜"
    },
    {
      id: "5",
      name: "Jus Alpukat",
      price: 15000,
      stock: 25,
      category: "minuman",
      description: "Jus alpukat segar dengan susu kental manis",
      emoji: "🥑"
    }
  ];
}

module.exports = {
  sendProducts: async function(client, sender) {
    try {
      console.log(`🛒 Mengirim produk ke ${sender}`);
      
      // Hitung kategori
      const categories = [...new Set(products.map(p => p.category))];
      
      // Pesan header
      const headerMessage = `🛒 *KATALOG PRODUK*

Total: *${products.length} produk* tersedia
Kategori: ${categories.map(c => c.toUpperCase()).join(', ')}`;
      
      await client.sendMessage(sender, headerMessage);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Buat list produk dengan section per kategori
      const sections = [];
      
      categories.forEach(category => {
        const categoryProducts = products.filter(p => p.category === category);
        const rows = categoryProducts.map(product => ({
          id: `product_${product.id}`,
          title: `${product.emoji || '📦'} ${product.name}`,
          description: `Rp ${product.price.toLocaleString('id-ID')} | Stok: ${product.stock}`
        }));
        
        sections.push({
          title: `📁 ${category.toUpperCase()}`,
          rows: rows.slice(0, 10) // Max 10 per section
        });
      });
      
      // Tambahkan section kategori
      sections.push({
        title: "🏷️ PILIH KATEGORI",
        rows: categories.map(category => ({
          id: `category_${category}`,
          title: `📂 ${category.charAt(0).toUpperCase() + category.slice(1)}`,
          description: `Lihat semua produk ${category}`
        }))
      });
      
      const productList = {
        title: "PRODUK KAMI",
        text: "Pilih produk untuk detail lebih lanjut:",
        buttonText: "LIHAT PRODUK",
        sections: sections
      };
      
      try {
        await client.sendMessage(sender, productList);
      } catch (error) {
        console.log("⚠️  Gagal kirim list produk, gunakan fallback");
        await sendFallbackProducts(client, sender);
      }
      
      // Kirim button action
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const actionButtons = {
        text: "🛒 *MAU PESAN?*",
        buttons: [
          {
            buttonId: 'btn_order_how',
            buttonText: { displayText: '❓ Cara Pesan' }
          },
          {
            buttonId: 'btn_promo',
            buttonText: { displayText: '🎉 Lihat Promo' }
          },
          {
            buttonId: 'btn_menu',
            buttonText: { displayText: '🏠 Menu Utama' }
          }
        ],
        footer: "Klik 'Cara Pesan' untuk tutorial pemesanan"
      };
      
      await client.sendMessage(sender, actionButtons);
      
    } catch (error) {
      console.error("❌ Error di store.js:", error);
      await client.sendMessage(sender, "❌ Maaf, katalog produk sedang tidak dapat diakses. Silakan coba lagi nanti.");
    }
  },
  
  // Fungsi untuk mendapatkan detail produk
  getProductDetail: async function(client, sender, productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
      await client.sendMessage(sender, "❌ Produk tidak ditemukan.");
      return;
    }
    
    const detailMessage = `${product.emoji || '📦'} *${product.name.toUpperCase()}*

💵 Harga: Rp ${product.price.toLocaleString('id-ID')}
📦 Stok: ${product.stock} unit
🏷️ Kategori: ${product.category}
📝 Deskripsi: ${product.description}

*Untuk memesan, ketik:*
pesan ${product.name} 1

Atau hubungi owner untuk pertanyaan lebih lanjut.`;
    
    await client.sendMessage(sender, detailMessage);
  }
};

// Fallback untuk produk
async function sendFallbackProducts(client, sender) {
  let productText = `🛒 *PRODUK YANG TERSEDIA:*\n\n`;
  
  products.slice(0, 15).forEach((product, index) => {
    productText += `${index + 1}. ${product.emoji || '📦'} *${product.name}*\n`;
    productText += `   💵 Rp ${product.price.toLocaleString('id-ID')}\n`;
    productText += `   📦 Stok: ${product.stock}\n`;
    productText += `   📝 ${product.description.substring(0, 50)}...\n\n`;
  });
  
  if (products.length > 15) {
    productText += `\n...dan ${products.length - 15} produk lainnya.\n`;
  }
  
  productText += `\n*Cara pesan:* ketik "pesan [nama produk] [jumlah]"`;
  
  await client.sendMessage(sender, productText);
}
