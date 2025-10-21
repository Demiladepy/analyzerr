const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/', controller.createString);
router.get('/', controller.getStrings);
router.get('/:string_value', controller.getString);
router.delete('/:string_value', controller.deleteString);

module.exports = router;
