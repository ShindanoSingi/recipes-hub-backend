const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Mongo DB connection established successfully');
})

db.on('error', (err) => {
    console.log(`Mongo DB connection error: ${err}`);
});

module.exports = db;