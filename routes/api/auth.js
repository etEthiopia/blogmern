const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Author Model
const Author = require("../../models/Author");

// Admin Model
const Admin = require("../../models/Admin");

// // Auth Middleware
// const auth = require("../../middleware/auth");


// @Route GET api/auth
// @desc Authenticate Author
// @access Public
router.post("/", async (req, res) => {
    const {
        email,
        password
    } = req.body;

    // Simple Validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Required fields are not available.'
        })
    }

    await Author.findOne({
        email
    })
        .then(author => {
            if (!author) {
                res.status(400).json({
                    success: false,
                    message: 'Sign in error'
                })
            } else {
                if (author.is_active) {
                    // Validate Password
                    bcrypt.compare(password, author.password)
                        .then(isMatch => {
                            if (!isMatch) {
                                res.status(400).json({
                                    success: false,
                                    message: 'Sign in error'
                                })
                            } else {
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
                                        res.json({
                                            token: token,
                                            author: {
                                                id: author.id,
                                                user_id: author.user_id,
                                                profile_pic: author.profile_pic,
                                                full_name: author.full_name,
                                                email: author.email
                                            },
                                            success: true
                                        })
                                    }
                                )
                            }
                        })
                        .catch(err => res.json({
                            message: err,
                            success: false
                        }))
                } else {
                    res.status(400).json({
                        success: false,
                        message: 'Access Denied'
                    })
                }
            }


        })
        .catch(err => res.status(500).json({
            message: err,
            success: false
        }))


});

// @Route GET api/auth/admin
// @desc Authenticate Admin
// @access Public
router.post("/admin", async (req, res) => {
    const {
        email,
        password
    } = req.body;

    // Simple Validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Required fields are not available.'
        })
    }

    await Admin.findOne({
        email
    })
        .then(admin => {
            if (!admin) {
                res.status(400).json({
                    success: false,
                    message: 'Sign in error'
                })
            } else {

                // Validate Password
                bcrypt.compare(password, admin.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            res.status(400).json({
                                success: false,
                                message: 'Sign in error'
                            })
                        } else {
                            jwt.sign({
                                id: admin.id,
                                user_id: process.env.ADMIN_PUBLIC
                            },
                                process.env.JWT_SECRET, {
                                expiresIn: "1 day"
                            },
                                (err, token) => {
                                    if (err) {
                                        throw err;
                                    }
                                    res.json({
                                        token: token,
                                        admin: {
                                            id: admin.id,
                                            user_id: process.env.ADMIN_PUBLIC,
                                            full_name: admin.full_name,
                                            email: admin.email
                                        },
                                        success: true
                                    })
                                }
                            )
                        }
                    })
                    .catch(err => res.json({
                        message: err,
                        success: false
                    }))

            }


        })
        .catch(err => res.status(500).json({
            message: err,
            success: false
        }))


});


// @Route GET api/auth/author
// @desc Get author data
// @access Private
// router.get('/author', auth, (req, res) => {
//     Author.findById(req.user.id)
//         .select('-password')
//         .then(author => res.json(author));
// })


module.exports = router;