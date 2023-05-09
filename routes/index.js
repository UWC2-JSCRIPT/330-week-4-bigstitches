const { Router } = require("express");
const router = Router();

// anything that comes in on this route should use this file
router.use((req, res, next) => {
    const { email, password } = req.body
    // console.log(`${req.method} ${req.url} ${email} ${password}`);
    next();
})

router.use("/login", require('./login'));
router.use("/login/signup", require('./login'));
router.use("/login/:userId/notes", require('./notes'));


// capture errors when the transactionid is not valid
// use an error handling middleware - put it last
router.use((err, _req, res, _next) => {
    if (err.message.includes("Cast to ObjetId failed")) {
        res.status(400).send('Invalid id provided');
    } else {
        // 500 internal server error, client can't fix
        res.status(500).send('something broke!');
        console.log('unexpected error: ', err)
    }
});

module.exports = router;