import mongoose from 'mongoose';

const ProductsSchema = mongoose.Schema({
    brand_name: String,
    product_name: String,
    ingredients: String,
    allergens: String,
    category: String,
    link: String,
    img: String,
});

const Products = mongoose.model('Products', ProductsSchema);

export default Products;
