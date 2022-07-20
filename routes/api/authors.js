const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require("../../middleware/authenticate");


// Author Model
const Author = require("../../models/Author");

// @Route POST api/authors
// @desc Register A New Author
// @access Public
router.post("/", async (req, res) => {
    const {
        full_name,
        user_id,
        email,
        password,
        profile_pic
    } = req.body;

    // Simple Validation
    if (!full_name || !email || !password || !user_id || !profile_pic) {
        return res.status(400).json({
            success: false,
            message: 'Required fields are not available.'
        })
    }
    // Check Duplicate Email
    await Author.findOne({
        email
    })
        .then((author) => {
            if (author) {
                res.status(400).json({
                    success: false,
                    message: 'A author is already registered with that email.'
                })
            } else {
                Author.findOne({
                    user_id
                })
                    .then(author => {
                        if (author) {
                            res.status(400).json({
                                success: false,
                                message: 'A author is already registered with that email.'
                            });
                        }
                        else {
                            const newAuthor = new Author({
                                full_name,
                                user_id,
                                email,
                                password,
                                profile_pic
                            })

                            // Create salt & hash
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(newAuthor.password, salt, (err, hash) => {
                                    if (err) throw err;
                                    newAuthor.password = hash;
                                    newAuthor.save()
                                        .then(author => {

                                            jwt.sign({
                                                id: author.id,
                                                user_id: author.user_id
                                            },
                                                process.env.JWT_SECRET, {
                                                expiresIn: "60 days"
                                            },
                                                (err, token) => {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                    res.status(201).json({
                                                        token: token,
                                                        author: {
                                                            id: author.id,
                                                            full_name: author.full_name,
                                                            user_id: author.user_id,
                                                            email: author.email,
                                                            profile_pic: author.profile_pic,
                                                            is_active: author.is_active
                                                        },
                                                        success: true
                                                    })
                                                }
                                            )


                                        })
                                })
                            })
                        }
                    })
                    .catch(err => res.json({
                        message: err,
                        success: false
                    }))
            }

        })
        .catch(err => res.json({
            message: err,
            success: false
        }))


});

// @Route GET api/authors
// @desc Returns All Public, Approved, and Visible Authors
// @access Public
router.get("/", async (req, res) => {
    await Author.find({
        is_active: true,
    })
        .sort({
            full_name: 1
        })
        .then(authors => {
            if (authors.length > 0) {
                res.json(authors)
            } else {
                res.status(204).json(authors)
            }

        })

        .catch(err => res.json({
            message: err,
            success: false
        }))
});

// @Route GET api/authors
// @desc Changes Author active status
// @access Private(Admin)
router.get("/authors_all", authenticate, async (req, res) => {
    if (req.user.user_id !== process.env.ADMIN_PUBLIC) {
        return res.status(400).json({
            success: false,
            message: 'Unauthorized'
        })
    }
    await Author.find({
    })
        .sort({
            title: 1
        })
        .then(authors => {
            if (authors.length > 0) {
                res.json(authors)
            } else {
                res.status(204).json(authors)
            }

        })

        .catch(err => res.json({
            message: err,
            success: false
        }))
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
    await Author
        .findByIdAndUpdate(req.body.id, { is_active: req.body.is_active }, {
            new: false
        })
        .then(author => {
            if (author !== null) {
                res.json(author)
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


module.exports = router;
