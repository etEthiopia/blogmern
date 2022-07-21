const Category = require("../models/Category");

class CategoryRepository {

    // Returns Active Categories
    async findActiveCategories() {

        const result = await Category.find({
            is_active: true,
        })
            .sort({
                title: 1
            });
        return result;
    }
}

module.exports = CategoryRepository;
