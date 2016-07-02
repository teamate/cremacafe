/**
 * Created by nadavbara on 01/07/2016.
 */
var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
    console.log('got here');
    res.send('login successfully');
})

module.exports = router;