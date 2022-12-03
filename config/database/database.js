import dotenv from 'dotenv';

dotenv.config();

const username = process.env.ATLAS_USERNAME;

const password = process.env.ATLAS_PASS;

const config = {
    database: `mongodb+srv://${username}:${password}@dietary-care-xtrun.mongodb.net/dietarycare?retryWrites=true&w=majority`,
};

export default config;
