const handleError = (res = {}, err = {}, msg = '', status = 500) => res.status(status).send({
    status,
    error: {
        display_message: msg,
        error: err,
    },
});

const addAllergenKeyIfMissing = (products) => products.map((product) => {
    const { allergens } = product;
    if (!allergens) {
        return {
            ...product,
            allergens: '',
        };
    }
    return product;
});

const checkIfAllergic = (products, userAllergens) => {
    const { ingredients, allergens, category } = products[0];

    const allergiesList = new RegExp(userAllergens.toLowerCase().replace(',', '|'), 'ig');

    const checkIngredients = ingredients.match(allergiesList);
    const checkAllergens = allergens.match(allergiesList);

    let allergicTo = '';

    if (checkIngredients || checkAllergens) {
        if (checkIngredients != null) allergicTo = checkIngredients.join();
        else allergicTo = checkAllergens.join();

        return { isAllergic: 1, allergicTo, category };
    }

    return { isAllergic: 0 };
};

const titleCase = (string) => {
    const sentence = string.split(' ');
    for (let i = 0; i < sentence.length; i += 1) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(' ');
};

const convertToRepresentationalForm = (products) => products.map((product) => {
    const {
        product_name: productName, brand_name: brandName, link, img,
    } = product;
    return {
        link,
        img,
        product_name: titleCase(productName),
        brand_name: titleCase(brandName),
    };
});

const convertToLowerCase = (products) => products.map((product) => {
    const {
        product_name: productName, brand_name: brandName, category, ingredients, allergens,
    } = product;
    return {
        ...product,
        product_name: productName.toLowerCase(),
        brand_name: brandName.toLowerCase(),
        category: category.toLowerCase(),
        ingredients: ingredients.toLowerCase(),
        allergens: allergens.toLowerCase(),
    };
});

export {
    handleError,
    addAllergenKeyIfMissing,
    checkIfAllergic,
    convertToRepresentationalForm,
    convertToLowerCase,
};
