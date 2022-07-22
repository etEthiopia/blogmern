const router = require("express").Router();

const authenticate = require("../../middleware/authenticate");
const { findCommentsOfArticle, addCommentService } = require("../../services/CommentServices");


// @Route GET api/comments/:article_id
// @desc Returns Comments of An Article
// @access Public
router.get("/:article_id", async (req, res) => {
    await findCommentsOfArticle(req.params.article_id, "-")
        .then(comments =>
            res.json(comments)
        )
        .catch(err => res.json({
            message: err,
            success: false
        }))
});

// @Route GET api/comments/:article_id/:search_text
// @desc Returns Searched Comments of An Article
// @access Public
router.get("/:article_id/:search_text", async (req, res) => {
    await findCommentsOfArticle(req.params.article_id, req.params.search_text)
        .then(comments =>
            res.json(comments)
        )
        .catch(err => res.json({
            message: err,
            success: false
        }))
});

// @Route POST api/comments/
// @desc Create a Comment
// @access Private(Author)
router.post("/", authenticate, async (req, res) => {
    console.log("before res");
    const { body, article_id } = req.body;

    await addCommentService({
        author_user_id: req.user.user_id,
        body: body,
        article_id: article_id
    }).then((result) => {
        if (result.success) {
            res.status(201).json(result.value);
        } else {
            res.status(500).json(result);
        }
    })

});




module.exports = router;