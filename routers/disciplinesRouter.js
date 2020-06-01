const router = require('express').Router()
const Disciplines = require('../models/Disciplines');

// app.use(router)

router.route("/").post(async (req, res) => {
    try {
        await Disciplines.insertMany([
            {
                discipline: "Formation Skydiving (FS)",
            },
            {
                discipline: "Vertical Formation Skydiving (VFS)",
            },
            {
                discipline: "Freestyle",
            },
            {
                discipline: "Freefly",
            },
            {
                discipline: "Wingsuit",
            },
            {
                discipline: "Speed",
            },
            {
                discipline: "Dynamic Flying (D4W / D2W)",
            },
            {
                discipline: "Canopy piloting / swooping",
            }
        ]);
        res.send("ok");
    } catch (err) {
        console.log(err.message);
        res.send(" not ok");

    };
})

module.exports = router