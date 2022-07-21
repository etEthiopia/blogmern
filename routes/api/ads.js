const router = require("express").Router();

const authenticate = require("../../middleware/authenticate");
// Ad Model
const Ad = require("../../models/Ad");


// @Route GET api/ads
// @desc Returns All Visible Ads
// @access Public
router.get("/", async (req, res) => {
    await Ad.find({
        is_active: true,
    })
        .sort({
            createdAt: 1
        })
        .then(ads => {
            if (ads.length > 0) {
                res.json(ads)
            } else {
                res.status(204).json(ads)
            }

        })

        .catch(err => res.json({
            message: err,
            success: false
        }))
});

// @Route POST api/ads
// @desc Create an Ad
// @access Private(Admin)
router.post("/", authenticate, async (req, res) => {

    const { title, company, picture, link } = req.body;

    if (req.user.user_id !== process.env.ADMIN_PUBLIC) {
        return res.status(400).json({
            success: false,
            message: 'Unauthorized'
        })
    }
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var nextyear = new Date(year + 1, month, day);
    const newAd = new Ad({
        title: title,
        company: company,
        picture: picture,
        link: link,
        expiry_date: nextyear
    });
    await newAd
        .save()
        .then(ad => res.status(201).json(ad))
        .catch(
            (err) => {
                // Duplicate Entry
                if (err.code === 11000) {
                    res.status(400).json({
                        message: "Duplicate Ad",
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

// @Route GET api/ads
// @desc Returns All Ads
// @access Private(Admin)
router.get("/", async (req, res) => {
    if (req.user.user_id !== process.env.ADMIN_PUBLIC) {
        return res.status(400).json({
            success: false,
            message: 'Unauthorized'
        })
    }
    await Ad.find({
    })
        .sort({
            createdAt: 1
        })
        .then(ads => {
            if (ads.length > 0) {
                res.json(ads)
            } else {
                res.status(204).json(ads)
            }

        })

        .catch(err => res.json({
            message: err,
            success: false
        }))
});

// @Route PUT api/ads/
// @desc Change Title, Company, Picture, Is Active, Expiry Date, And Link Of An Ad
// @access Private(Admin)
router.put("/", authenticate, async (req, res) => {
    if (req.user.user_id !== process.env.ADMIN_PUBLIC) {
        return res.status(400).json({
            success: false,
            message: 'Unauthorized'
        })
    }
    const { title, company, picture, link, is_active, expiry_date } = req.body;
    await Ad
        .findByIdAndUpdate(req.body.id, { title: title, company: company, picture: picture, link: link, is_active: is_active, expiry_date: expiry_date }, {
            new: false
        })
        .then(ad => {
            if (ad !== null) {
                res.json(ad)
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