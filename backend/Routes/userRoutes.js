const express = require('express');
const router = express.Router();
const { createOrUpdateUser, getUserById, deleteUser } = require('../Controller/userController');

router.post('/facebookuser', createOrUpdateUser);
router.get('/user/:id', getUserById);
router.delete('/deleteuser/:id', deleteUser);

module.exports = router;
