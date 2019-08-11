const express = require('express'),
    router = express.Router();

router.post("/check", require('../handlers/api/check'));
router.post("/verify", require('../handlers/api/verify'));
router.post("/awaitverify", require('../handlers/api/awaitverify'));

module.exports = router;