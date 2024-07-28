const express = require('express');
const router = express.Router();
const {getBook} = require("../controllers/apiBookController")


router.get("/getBook/:isbn",getBook)


module.exports = router 