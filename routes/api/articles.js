const router = require("express").Router();

// Article Model
const Article = require("../../models/Article");

// @Route GET api/articles
// @desc Returns All Public, Approved, and Visible Articles
// @access Public
router.get("/", async (req, res) => {
    await Article.find({
        is_visible: true,
        is_approved: true,
        is_draft: false
    })
        .sort({
            createdOn: -1
        })
        .then(articles => {
            if (articles.length > 0) {
                res.json(articles)
            } else {
                res.status(204).json(articles)
            }

        })

        .catch(err => res.json({
            message: err,
            success: false
        }))
});

// @Route POST api/articles
// @desc Create an Article
// @access Private(Author)
router.post("/", async (req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        category: req.body.category,
        content: req.body.content,
        author_user_id: req.body.author_user_id,
        author_full_name: req.body.author_full_name,
        slug: req.body.slug,
        is_draft: req.body.is_draft
    });
    await newArticle
        .save()
        .then(article => res.status(201).json(article))
        .catch(
            (err) => {
                // Duplicate Entry
                if (err.code === 11000) {
                    res.status(400).json({
                        message: "Duplicate Slug",
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


// @Route GET api/articles/:slug
// @desc Returns A Single Public, Approved, and Visible Article By Slug
// @access Public
router.get("/:slug", async (req, res) => {
    await Article.findOne({
        is_visible: true,
        is_approved: true,
        is_draft: false,
        slug: req.params.slug
    })
        .then(article => {
            if (article !== null) {
                res.json(article)
            }
            else {
                res.status(404).json({
                    message: "Not Found",
                    success: false
                })
            }
        })

        .catch(err => res.status(500).json({
            message: err,
            success: false
        }));
});


// @Route PUT api/articles/
// @desc Change Title, Content, Category, And Picture Of An Article
// @access Private(Author)
router.put("/", async (req, res) => {
    await Article
        .findByIdAndUpdate(req.body.id, { title: req.body.title, content: req.body.content, thumbnail: req.body.thumbnail, category: req.body.category, is_edited: true }, {
            new: false
        })
        .then(article => {
            if (article !== null) {
                res.json(article)
            } else {
                res.status(404).json({
                    message: "Not Found",
                    success: false
                })
            }

        })
        .catch(
            (err) => {

                res.status(500).json({
                    message: err,
                    success: false
                });

            });
});


// @Route PUT api/articles/publish
// @desc Publish An Article
// @access Private(Author)
router.put("/publish", async (req, res) => {
    await Article
        .findByIdAndUpdate(req.body.id, { is_draft: false }, {
            new: false
        })
        .then(article => {
            if (article !== null) {
                res.json(article)
            } else {
                res.status(404).json({
                    message: "Not Found",
                    success: false
                })
            }

        })
        .catch(
            (err) => {

                res.status(500).json({
                    message: err,
                    success: false
                });

            });
});

// @Route PUT api/articles/visibility
// @desc Change Visibility Of An Article
// @access Private(Author)
router.put("/visibility", async (req, res) => {
    await Article
        .findByIdAndUpdate(req.body.id, { is_visible: req.body.is_visible }, {
            new: false
        })
        .then(article => {
            if (article !== null) {
                res.json(article)
            } else {
                res.status(404).json({
                    message: "Not Found",
                    success: false
                })
            }

        })
        .catch(
            (err) => {

                res.status(500).json({
                    message: err,
                    success: false
                });

            });
});


// @Route PUT api/articles/approval
// @desc Change Approval Of An Article
// @access Private(Admin)
router.put("/approval", async (req, res) => {
    await Article
        .findByIdAndUpdate(req.body.id, { is_approved: req.body.is_approved }, {
            new: false
        })
        .then(article => {
            if (article !== null) {
                res.json(article)
            } else {
                res.status(404).json({
                    message: "Not Found",
                    success: false
                })
            }

        })
        .catch(
            (err) => {

                res.status(500).json({
                    message: err,
                    success: false
                });

            });
});



// @Route DELETE api/articles/
// @desc Delete an Article
// @access Private(Author)
router.delete("/", async (req, res) => {
    Article.findByIdAndDelete(req.body.id)
        .then((article) => {
            if (article !== null) {
                res.json(
                    article
                )
            } else {
                res.status(404).json({
                    message: "Not Found",
                    success: false
                })
            }
        }).catch(err => res.status(500).json({
            message: err,
            success: false
        }))
});


module.exports = router;