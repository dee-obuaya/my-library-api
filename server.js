if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const app = require('./app');
const dbUrl = process.env.MONGO_DEV_URL;
const PORT = process.env.PORT || 3000;

/* Connecting to the database and then starting the server. */
main()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Serving on port ${PORT}`);
        });
    })
    .catch(err => console.error.bind(console, 'connection error:'));
async function main() {
    await mongoose.connect(dbUrl);
}
