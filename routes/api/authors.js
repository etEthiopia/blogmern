const router = require("express").Router();

// Author Model
const Author = require("../../models/Author");

// @Route GET api/Authors
// @desc Returns All Authors
// @access Public
router.get("/", async (req, res) => {
    await Author.find()
        .sort({
            createdOn: -1
        })
        .then(items => res.json(items))

        .catch(err => res.status(500).json({
            message: err,
            success: false
        }))
});


module.exports = router;
