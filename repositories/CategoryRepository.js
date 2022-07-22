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

    // Creates A New Category
    async addCategory(title) {
        const newCategory = new Category({
            title: title
        });
        try {
            const addedCategory = await newCategory
                .save();
            return {
                success: true, value: addedCategory
            }
        }
        catch (err) {
            if (err.code === 11000) {
                return {
                    message: "Duplicate Category",
                    success: false
                };

            } else {
                return {
                    message: err,
                    success: false
                };
            }
        }
    }

    // Returns All Categories
    async findAllCategories() {

        const result = await Category.find({
        })
            .sort({
                title: 1
            });
        return result;
    }
}

module.exports = CategoryRepository;
