import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from './config/database/database';
import Products from './models/products';
import {
    handleError, addAllergenKeyIfMissing, checkIfAllergic, convertToRepresentationalForm, convertToLowerCase,
} from './utils/utils';
import localisable from './config/strings/localisable';

const { database } = config;

const makeConnection = () => {
    mongoose.connect(database, { useNewUrlParser: true }).then(() => {
        // console.log('Connected to MongoDB');
    }).catch((err) => console.error(err));
};

makeConnection();

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).send({
    status: 200,
    message: localisable.welcomeMessage,
    valid_endpoints: [
        {
            endpoint: '/products',
            method: 'GET',
            description: localisable.endpoint_1_description,
        },
        {
            endpoint: '/products/allergyCheck',
            method: 'POST',
            description: localisable.endpoint_2_description,
        },
        {
            endpoint: '/products/add',
            method: 'POST',
            description: localisable.endpoint_3_description,
        },
        {
            endpoint: '/products/recommend',
            method: 'POST',
            description: localisable.endpoint_4_description,
        },
    ],
}));

app.get('/products', (req, res) => {
    Products.find({}, (err, products) => {
        if (err) {
            const msg = localisable.somethingWentWrong;
            return handleError(res, err, msg);
        }
        return res.status(200).send({
            status: 200,
            message: localisable.success,
            count: products.length,
            data: { products },
        });
    });
});

app.post('/products/allergyCheck', (req, res) => {
    const { body: { query, user_allergens: userAllergens } = {} } = req;
    Products.find({ ...query }, (err, products) => {
        if (err) {
            const msg = localisable.somethingWentWrong;
            return handleError(res, err, msg);
        }
        if (products.length) {
            const { isAllergic, allergicTo = '', category } = checkIfAllergic(products, userAllergens);
            return res.status(200).send({
                status: 200,
                message: localisable.success,
                product_exists: 1,
                data: {
                    isAllergic,
                    allergicTo,
                    category,
                },
            });
        }
        return res.status(200).send({
            status: 200,
            message: localisable.success,
            product_exists: 0,
        });
    });
});

app.post('/products/add', (req, res) => {
    const { body: { products, secretKey } } = req;
    if (products && products.length) {
        if (secretKey === process.env.ADD_PASS) {
            let updatedProducts = addAllergenKeyIfMissing(products);
            updatedProducts = convertToLowerCase(updatedProducts);
            Products.insertMany(updatedProducts, (err, result) => {
                if (err) {
                    const msg = localisable.failed;
                    return handleError(res, err, msg, 500);
                }
                const count = result.length;
                return res.status(200).send({
                    status: 200,
                    message: localisable.success,
                    count,
                });
            });
        } else {
            const msg = 'Unauthorized';
            handleError(res, {}, msg, 403);
        }
    } else {
        const msg = localisable.nothingToAdd;
        handleError(res, {}, msg, 400);
    }
});

app.post('/products/recommend', (req, res) => {
    const { body: { query } } = req;
    Products.find({ ...query }, (err, products) => {
        if (err) {
            const msg = localisable.somethingWentWrong;
            return handleError(res, err, msg);
        }
        const updatedProducts = convertToRepresentationalForm(products);
        return res.status(200).send({
            status: 200,
            message: localisable.success,
            count: products.length,
            data: { products: updatedProducts },
        });
    });
});

app.delete('/products/deleteAll', (req, res) => {
    const { body: { secretKey } } = req;
    if (secretKey === process.env.DELETE_PASS) {
        Products.deleteMany({}, (err, result) => {
            if (err) {
                const msg = localisable.failed;
                return handleError(res, err, msg, 500);
            }
            const { deletedCount } = result;
            return res.status(200).send({
                status: 200,
                message: localisable.success,
                deletedCount,
                data: result,
            });
        });
        return;
    }
    const msg = 'Unauthorized';
    handleError(res, {}, msg, 403);
});

app.listen(port);
