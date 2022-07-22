const CategoryRepository = require("../repositories/CategoryRepository");

const categoryRepo = new CategoryRepository();

// Returns Active Categories
module.exports.findActiveCategoriesService = async () => {
    return await categoryRepo.findActiveCategories();
};

// Creates A New Category
module.exports.addCategoryService = async (title) => {
    return await categoryRepo.addCategory(title);
}

// Returns ALl Categories
module.exports.findAllCategoriesService = async () => {
    return await categoryRepo.findAllCategories();
};
