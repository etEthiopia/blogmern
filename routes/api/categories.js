const router = require("express").Router();

const authenticate = require("../../middleware/authenticate");
// Category Model
const Category = require("../../models/Category");
const CategoryRepository = require("../../repositories/categoryRepository");
const { findActiveCategoriesService, addCategoryService } = require("../../services/CategoryServices");
const categoryRepo = new CategoryRepository();

// @Route GET api/categories
// @desc Returns All Visible Categorys
// @access Public
router.get("/", async (req, res) => {
    await findActiveCategoriesService()
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
    await addCategoryService(req.body.title).then((result) => {
        if (result.success) {
            res.status(201).json(result.value);
        } else {
            if (result.message === "Duplicate Category") {
                res.status(400).json(result);
            } else {
                res.status(500).json(result);
            }
        }
    })

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
    await findAllCategoriesService()
        .then(categories =>
            res.json(categories)
        )
        .catch(err => res.json({
            message: err,
            success: false
        }))
});


module.exports = router;