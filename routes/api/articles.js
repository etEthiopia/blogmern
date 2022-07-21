const router = require("express").Router();

// Upload
const multer = require("multer");

// Middleware
const authenticate = require('../../middleware/authenticate')

// Article Model
const Article = require("../../models/Article");
const Author = require("../../models/Author");

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });

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
            createdAt: -1
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

// @Route GET api/latest/:page
// @desc Returns Paginated Public, Approved, and Visible Articles
// @access Public
router.get("/latest/:page", async (req, res) => {
    await Article.paginate({
        is_visible: true,
        is_approved: true,
        is_draft: false
    }, { page: req.params.page, limit: 5, sort: { createdAt: -1 } })
        .then(articles =>
            res.json(articles)
        )
        .catch(err => res.json({
            message: err,
            success: false
        }))
});

// @Route GET api/latest/:page
// @desc Returns Paginated Public, Approved, and Visible Articles
// @access Public
router.get("/trending/:page/:limit", async (req, res) => {
    await Article.paginate({
        is_visible: true,
        is_approved: true,
        is_draft: false
    }, { page: req.params.page, limit: req.params.limit, sort: { trending: -1 } })
        .then(articles =>
            res.json(articles)
        )
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
            createdAt: -1
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
            createdAt: -1
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

// @Route POST api/upload_thumbnail
// @desc Upload Thumbnail for an Article
// @access Public
router.post("/upload_thumbnail", upload.single("file"), (req, res) => {
    console.log(req.body);
    res.status(201).json({ success: true });
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

// @Route POST api/articles/:slug
// @desc Get an Authors Article
// @access Private(Author)
router.get("/author_article/:slug", authenticate, async (req, res) => {
    await Article.findOne({
        author_user_id: req.user.user_id,
        slug: req.params.slug
    })
        .then(article => {
            if (article === null) {
                res.status(404).json({
                    message: "Not Found",
                    success: false
                })
            } else {
                res.status(200).json(article)
            }
        })
        .catch(
            (err) =>
                res.status(500).json({
                    message: err,
                    success: false
                }))



});


// @Route PUT api/articles/
// @desc Change Title, Content, Category, And Picture Of An Article
// @access Private(Author)
router.put("/", authenticate, async (req, res) => {
    const { title, content, id } = req.body;
    console.log(req.body);
    await Article
        .findByIdAndUpdate(id, { title: title, content: content, is_edited: true }, {
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
// @access Private(Author) authenticate
router.delete("/:id", authenticate, async (req, res) => {
    Article.findByIdAndDelete(req.params.id)
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
            createdAt: -1
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


// @Route GET api/my_articles/:page
// @desc Returns My Articles
// @access Private(Author)
router.get("/my_articles/:page", authenticate, async (req, res) => {
    await Article.paginate({
        author_user_id: req.user.user_id
    }, { page: req.params.page, limit: 5, sort: { createdAt: -1 } })
        .then(articles => {
            res.json(articles);

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
                const pureTimeDiff = (c_date - c_previous_read_on) / 1000;
                const diffDays = (pureTimeDiff / 60) % 60;
                console.log(diffDays);
                if (diffDays > 1) {
                    Article
                        .findOneAndUpdate({
                            _id: id,
                            is_visible: true,
                            is_approved: true,
                            is_draft: false
                        }, {
                            current_read: 1,
                            trending: 1000 / (c_date - current_article.current_read_on),
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
                            _id: id,
                            is_visible: true,
                            is_approved: true,
                            is_draft: false
                        }, {
                            current_read_on: c_date,
                            trending: pureTimeDiff === 0 ? 0 : (current_article.current_read + 1) / pureTimeDiff,
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