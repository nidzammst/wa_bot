const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { fetchMessageFromFlip, fetchJsonData } = require('./utils')
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox"]
  }
});

client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
  console.log('Client is ready!');
});

let temporaryDataArray = [];

// Fungsi untuk menyimpan chat dan nomor WhatsApp sementara
const saveTemporaryData = async (question, answer, category, waNumber, name, description) => {
  try {
    // Tambahkan objek ke dalam array temporaryDataArray
    temporaryDataArray.push({
      question,
      answer,
      category,
      waNumber,
      name,
      description,
      timestamp: Date.now(),
    });

    // Atur timeout untuk menghapus objek setelah 10 menit
    setTimeout(() => {
      // Hapus objek yang memiliki timestamp lebih dari 10 menit yang lalu
      const currentTime = Date.now();
      temporaryDataArray = temporaryDataArray.filter(
        (data) => currentTime - data.timestamp <= 10 * 60 * 1000
      );

      console.log('Old data deleted after 10 minutes.');
    }, 10 * 60 * 1000); // 10 menit dalam milidetik

  } catch (error) {
    console.error('Error:', error.message);
  }
};
const removeDataByWaNumber = (waNumber) => {
  try {
    // Filter array untuk menciptakan array baru tanpa objek yang memiliki waNumber tertentu
    let filteredData = temporaryDataArray.filter((data) => data.waNumber !== waNumber);

    // Update temporaryDataArray dengan array baru yang telah difilter
    temporaryDataArray = filteredData;
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Get the current time with WIB (Western Indonesian Time) timezone
const currentTime = new Date();
const timezoneOptionsWIB = { timeZone: 'Asia/Jakarta' };
const currentTimeWIB = new Intl.DateTimeFormat('id-ID', { timeStyle: 'short', ...timezoneOptionsWIB }).format(currentTime);

let timeOfDay;

if (currentTimeWIB >= 0 && currentTimeWIB < 12) {
    timeOfDay = "Pagi"
} else if (currentTimeWIB >= 12 && currentTimeWIB < 15) {
    timeOfDay = "Siang"
} else if (currentTimeWIB >= 15 && currentTimeWIB < 18) {
    timeOfDay = "Sore"
} else {
    timeOfDay = "Malam"
}

client.on('message', (message) => {
  if(message.body === 'hello') {
    message.reply('World');
  }
}