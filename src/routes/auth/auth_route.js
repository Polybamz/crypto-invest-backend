const express = require('express');
const router = express.Router();
const { AuthController } = require('../../controllers/registration/auth_controller');

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/user', AuthController.getUser);

module.exports = router;