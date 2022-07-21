const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Admin Model
const Admin = require("../../models/Admin");

// @Route POST api/admins
// @desc Register A New Admin
// @access Public
router.post("/", async (req, res) => {
    const {
        full_name,
        email,
        password,
        adminkey
    } = req.body;

    // Simple Validation
    if (!full_name || !email || !password || !adminkey) {
        return res.status(400).json({
            success: false,
            message: 'Required fields are not available.'
        })
    }
    if (adminkey !== process.env.ADMIN_SECRET) {
        return res.status(400).json({
            success: false,
            message: 'Unauthorized'
        })
    }
    // Check Duplicate Email
    await Admin.findOne({
        email
    })
        .then(async (admin) => {
            if (admin) {
                res.status(400).json({
                    success: false,
                    message: 'An admin is already registered with that email.'
                })
            }

            else {
                const newAdmin = new Admin({
                    full_name,
                    email,
                    password
                })

                // Create salt & hash
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                        if (err) throw err;
                        newAdmin.password = hash;
                        newAdmin.save()
                            .then(admin => {

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
                                        res.status(201).json({
                                            token: token,
                                            admin: {
                                                id: admin.id,
                                                full_name: admin.full_name,
                                                email: admin.email

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


});


module.exports = router;
