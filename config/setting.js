module.exports = {
  // Pengaturan Umum Bot
  botSettings: {
    name: "StoreBot",
    version: "1.0.0",
    autoReply: true,
    allowGroups: false,
    maxProductsPerPage: 10,
    language: "id"
  },
  
  // Pengaturan Notifikasi
  notifications: {
    newOrder: true,
    paymentConfirm: true,
    adminAlert: true,
    dailyReport: true
  },
  
  // Pengaturan Pembayaran
  payment: {
    autoConfirm: false,
    paymentTimeout: 24, // jam
    allowCOD: true,
    allowTransfer: true,
    allowEWallet: true
  },
  
  // Pengaturan Pengiriman
  shipping: {
    defaultCourier: "jne",
    allowPickup: true,
    autoCalculate: false
  },
  
  // Pengaturan Database
  database: {
    saveOrders: true,
    saveCustomers: true,
    backupInterval: 24 // jam
  },
  
  // Pengaturan Keamanan
  security: {
    blockSpam: true,
    maxMessagesPerMinute: 10,
    requirePhoneVerification: false
  }
};
