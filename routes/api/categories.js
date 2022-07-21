const router = require("express").Router();

const authenticate = require("../../middleware/authenticate");
// Category Model
const Category = require("../../models/Category");
const CategoryRepository = require("../../repositories/categoryRepository");
const categoryRepo = new CategoryRepository();

// @Route GET api/categories
// @desc Returns All Visible Categorys
// @access Public
router.get("/", async (req, res) => {
    await categoryRepo.findActiveCategories()
        .then(categories =>
            res.json(categories)
        )
        .catch(err => res.json({
            message: err,
            success: false
        }))
});

// @Route POST api/categories
// @desc Create an Category
// @access Private(Admin)
router.post("/", authenticate, async (req, res) => {

    if (req.user.user_id !== process.env.ADMIN_PUBLIC) {
        return res.status(400).json({
            success: false,
            message: 'Unauthorized'
        })
    }
    const newCategory = new Category({
        title: req.body.title
    });
    await newCategory
        .save()
        .then(category => res.status(201).json(category))
        .catch(
            (err) => {
                // Duplicate Entry
                if (err.code === 11000) {
                    res.status(400).json({
                        message: "Duplicate Category",
                        success: false
                    });
                } else {
                    res.status(500).json({
                        message: err,
                        success: false
                    });
                }
            });

});

// @Route GET api/categories/all
// @desc Returns All Categorys
// @access Private(Admin)
router.get("/all", authenticate, async (req, res) => {
    if (req.user.user_id !== process.env.ADMIN_PUBLIC) {
        return res.status(400).json({
            success: false,
            message: 'Unauthorized'
        })
    }
    await Category.find({

    })
        .sort({
            title: 1
        })
        .then(categories => {
            if (categories.length > 0) {
                res.json(categories)
            } else {
                res.status(204).json(categories)
            }

        })

        .catch(err => res.json({
            message: err,
            success: false
        }))
});


module.exports = router;