const router = require("express").Router();

// Middleware
const authenticate = require('../../middleware/authenticate')

// Article Model
const Article = require("../../models/Article");
const Author = require("../../models/Author");

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

// @Route GET api/category/:id
// @desc Returns All Public, Approved, and Visible Articles Searched On Categories 
// @access Public
router.get("/category/:name", async (req, res) => {
    await Article.find({
        is_visible: true,
        is_approved: true,
        is_draft: false,
        category: req.params.name
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

// @Route GET api/author/:user_id
// @desc Returns All Public, Approved, and Visible Articles Searched On Authors 
// @access Public
router.get("/author/:user_id", async (req, res) => {
    await Article.find({
        is_visible: true,
        is_approved: true,
        is_draft: false,
        author_user_id: req.params.user_id
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
router.post("/", authenticate, async (req, res) => {

    const { title, category, content, author_full_name, slug, thumbnail, is_draft } = req.body;

    const newArticle = new Article({
        title: title,
        category: category,
        content: content,
        author_user_id: req.user.user_id,
        author_full_name: author_full_name,
        thumbnail: thumbnail,
        slug: slug,
        is_draft: is_draft
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
router.put("/", authenticate, async (req, res) => {
    const { title, category, content, thumbnail } = req.body;
    await Article
        .findByIdAndUpdate(req.body.id, { title: title, content: content, thumbnail: thumbnail, category: category, is_edited: true }, {
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
router.put("/publish", authenticate, async (req, res) => {
    await Article
        .findByIdAndUpdate(req.body.id, { is_draft: false, }, {
            new: false
        })
        .then(article => {
            if (article !== null) {
                Author.findOneAndUpdate({ user_id: req.user.user_id }, { $inc: { articles: 1 }, })
                    .then(() => {
                        res.json(article)
                    })
                    .catch(
                        (err) => {
                            res.json({ ...article, message: err })
                        });

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
router.put("/visibility", authenticate, async (req, res) => {
    await Article
        .findByIdAndUpdate(req.body.id, { is_visible: req.body.is_visible }, {
            new: false
        })
        .then(article => {
            if (article !== null) {
                Author.findOneAndUpdate({ user_id: req.user.user_id }, { $inc: { articles: article.is_visible && !req.body.is_visible - 1 ? !article.is_visible && req.body.is_visible ? 1 : 0 : 0 }, })
                    .then(() => {
                        res.json(article)
                    })
                    .catch(
                        (err) => {
                            res.json({ ...article, message: err })
                        });
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
router.put("/approval", authenticate, async (req, res) => {
    if (req.user.user_id !== process.env.ADMIN_PUBLIC) {
        return res.status(400).json({
            success: false,
            message: 'Unauthorized'
        })
    }
    await Article
        .findByIdAndUpdate(req.body.id, { is_approved: req.body.is_approved }, {
            new: false
        })
        .then(article => {
            if (article !== null) {
                // res.json(article)
                Author.findOneAndUpdate({ user_id: req.user.user_id }, { $inc: { articles: article.is_approved && !req.body.is_approved - 1 ? !article.is_approved && req.body.is_approved ? 1 : 0 : 0 }, })
                    .then(() => {
                        res.json(article)
                    })
                    .catch(
                        (err) => {
                            res.json({ ...article, message: err })
                        });
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
router.delete("/", authenticate, async (req, res) => {
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


// @Route GET api/articles_all
// @desc Returns All Articles
// @access Private(Admin)
router.get("/", authenticate, async (req, res) => {
    if (req.user.user_id !== process.env.ADMIN_PUBLIC) {
        return res.status(400).json({
            success: false,
            message: 'Unauthorized'
        })
    }
    await Article.find({
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


// @Route PUT api/read/
// @desc Increment Read Of An Article
// @access Public
router.put("/read", async (req, res) => {
    const { id, author_user_id } = req.body;
    await Article.findById(
        id
    ).then(current_article => {
        if (current_article === null) {
            return res.status(404).json({
                success: false,
                message: 'Not Found'
            })
        }
        if (author_user_id !== current_article.author_user_id) {
            return res.status(404).json({
                success: false,
                message: 'Not Found'
            })
        }
        Author.findOneAndUpdate(
            {
                user_id: author_user_id
            }, {
            $inc: { reads: 1 },
        }, {
            new: false
        }
        )
            .then(() => {



                const c_previous_read_on = current_article.previous_read_on;
                const c_date = Date.now();
                //Days 1000 * 3600
                const diffDays = ((c_date - c_previous_read_on) / (1000 * 60)) % 60;
                if (diffDays > 1) {
                    Article
                        .findOneAndUpdate({
                            id: id,
                            is_visible: true,
                            is_approved: true,
                            is_draft: false
                        }, {
                            current_read: 1,
                            previous_read: current_article.current_read,
                            previous_read_on: current_article.current_read_on,
                            current_read_on: c_date,
                            $inc: { reads: 1 },
                        }, {
                            new: false
                        })
                        .then(article => {
                            if (article !== null) {
                                res.json({
                                    success: true
                                })
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
                }
                else {
                    Article
                        .findOneAndUpdate({
                            id: id,
                            is_visible: true,
                            is_approved: true,
                            is_draft: false
                        }, {
                            current_read_on: c_date,
                            $inc: { reads: 1, current_read: 1 },
                        }, {
                            new: false
                        })
                        .then(article => {
                            if (article !== null) {
                                res.json({
                                    success: true
                                })
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
                }
            }).catch(
                (err) => {

                    res.status(500).json({
                        message: err,
                        success: false
                    });

                });
    })

});


module.exports = router;