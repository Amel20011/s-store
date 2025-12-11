module.exports = {
  // Informasi Toko
  storeName: "TOKO MAKMUR JAYA",
  storePhone: "+6281234567890",
  storeAddress: "Jl. Raya Contoh No. 123, Jakarta Selatan",
  storeEmail: "tokomakmur@example.com",
  storeWebsite: "https://tokomakmur.example.com",
  
  // Informasi Pemilik
  ownerName: "Budi Santoso",
  ownerPhone: "+6289876543210",
  ownerEmail: "budi.santoso@example.com",
  ownerRole: "Pemilik & Manager",
  
  // Jam Operasional
  operationalHours: "08:00 - 22:00 WIB",
  operationalDays: "Senin - Minggu",
  
  // Metode Pembayaran
  paymentMethods: {
    banks: [
      {
        name: "BCA",
        number: "1234567890",
        holder: "BUDI SANTOSO",
        icon: "🏦"
      },
      {
        name: "BRI",
        number: "0987654321", 
        holder: "BUDI SANTOSO",
        icon: "🏦"
      },
      {
        name: "Mandiri",
        number: "5558889999",
        holder: "BUDI SANTOSO",
        icon: "🏦"
      }
    ],
    ewallets: [
      {
        name: "DANA",
        number: "081234567890",
        holder: "BUDI SANTOSO",
        icon: "📱"
      },
      {
        name: "OVO",
        number: "081234567890",
        holder: "BUDI SANTOSO",
        icon: "📱"
      },
      {
        name: "ShopeePay",
        number: "081234567890",
        holder: "BUDI SANTOSO",
        icon: "🛍️"
      }
    ],
    cod: {
      available: true,
      areas: ["Jakarta", "Bekasi", "Depok", "Tangerang", "Bogor"],
      fee: 10000
    }
  },
  
  // Pengiriman
  shipping: {
    couriers: ["JNE", "J&T", "SiCepat", "GoSend", "GrabExpress"],
    defaultFee: 15000,
    freeShippingMin: 100000
  },
  
  // Kontak Lainnya
  socialMedia: {
    instagram: "@tokomakmurjaya",
    facebook: "Toko Makmur Jaya",
    tiktok: "@tokomakmur"
  },
  
  // Kebijakan
  policies: {
    returnDays: 7,
    warranty: "1 tahun",
    minOrder: 50000
  }
};
