const router = require("express").Router();

// Upload
const multer = require("multer");

// Middleware
const authenticate = require('../../middleware/authenticate')

// Article Model
const Article = require("../../models/Article");
const Author = require("../../models/Author");
const { findPublicArticlesService, findLatestArticlesService, findTrendingArticlesService, findArticlesInCategoryService, findArticlesByAuthorService, addArticleService, findArticleBySlugService, updateArticleService, deleteArticleService, readArticleService } = require("../../services/ArticleServices");
const { incrementArticlesService, updateAuthorArticlesService } = require("../../services/AuthorServices");

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
    await findPublicArticlesService(false)
        .then(articles => {
            res.json(articles);
        })
        .catch(err => res.status(500).json({
            message: err,
            success: false
        }))
});

// @Route GET api/latest/:page
// @desc Returns Paginated Public, Approved, and Visible Articles
// @access Public
router.get("/latest/:page", async (req, res) => {

    await findLatestArticlesService(req.params.page)
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
    await findTrendingArticlesService(req.params.page, req.params.limit)
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
router.get("/category/:name:/page", async (req, res) => {

    await findArticlesInCategoryService(req.params.name, req.params.page)
        .then(articles => {
            res.json(articles);

        })
        .catch(err => res.json({
            message: err,
            success: false
        }))
});

// @Route GET api/author/:user_id
// @desc Returns All Public, Approved, and Visible Articles Searched On Authors 
// @access Public
router.get("/author/:user_id/:page", async (req, res) => {
    await findArticlesByAuthorService(req.params.user_id, req.params.page, true)
        .then(articles => {
            res.json(articles);

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
    res.status(201).json({ success: true });
});

// @Route POST api/articles
// @desc Create an Article
// @access Private(Author)
router.post("/", authenticate, async (req, res) => {
    await addArticleService(req.body, req.user.user_id)
        .then(result => {
            if (result.success) {
                res.status(201).json(result.value);
            } else {
                if (result.message === "Duplicate Slug") {
                    res.status(400).json(result);
                } else {
                    res.status(500).json(result);
                }
            }
        })


});


// @Route GET api/articles/:slug
// @desc Returns A Single Public, Approved, and Visible Article By Slug
// @access Public
router.get("/:slug", async (req, res) => {
    await findArticleBySlugService(req.params.slug)
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
    await findArticleBySlugService(req.params.slug, req.user.user_id)
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
    await updateArticleService(id, { title: title, content: content, is_edited: true }, null)
        .then(result => {
            if (result.success) {
                res.json(result.value)
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
    await updateArticleService(req.body.id, { is_draft: false }, true)
        .then(result => {
            if (result.success) {
                res.json(result.value);
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
    await updateArticleService(req.body.id, { is_visible: req.body.is_visible }, req.body.is_visible)
        .then(result => {
            if (result.success) {
                res.json(result.value)

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
    await updateArticleService(req.body.id, { is_approved: req.body.is_approved }, req.body.is_approved)
        .then(result => {
            if (result.success) {
                res.json(result.value)

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
    await deleteArticleService(req.params.id)
        .then(result => {
            if (result.success) {
                res.json(result.value)


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


// @Route GET api/articles_all
// @desc Returns All Articles
// @access Private(Admin)
router.get("/articles_all", authenticate, async (req, res) => {
    if (req.user.user_id !== process.env.ADMIN_PUBLIC) {
        return res.status(400).json({
            success: false,
            message: 'Unauthorized'
        })
    }
    await findPublicArticlesService(false)
        .then(articles => {
            res.json(articles);
        })
        .catch(err => res.status(500).json({
            message: err,
            success: false
        }))
});


// @Route GET api/my_articles/:page
// @desc Returns My Articles
// @access Private(Author)
router.get("/my_articles/:page", authenticate, async (req, res) => {

    await findArticlesByAuthorService(req.user.user_id, req.params.page, false)
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
    const id = req.body._id;
    const author_user_id = req.body.author_user_id;
    await readArticleService(id, author_user_id)
        .then((result) => {
            console.log(result);
            if (result !== undefined) {
                if (result.success) {
                    res.json({
                        success: true
                    })
                } else {
                    res.status(result.message === "Not Found" ? 404 : 500).json(result);
                }
            } else {
                res.status(500).json({
                    message: "Error",
                    success: false
                });
            }
        })

});


module.exports = router;