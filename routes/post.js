const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    res.json({
        posts: {
            title: 'my first post',
            description: 'random data'
        }
    });/*  */

});

router.post('/', verify, (req, res) => {
    console.log(req.body);
    res.status(200).send();
});

module.exports = router;