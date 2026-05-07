const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/memberController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', MemberController.getAll);
router.get('/:id', MemberController.getOne);
router.post('/', MemberController.create);
router.put('/:id', MemberController.update);
router.delete('/:id', MemberController.remove);

module.exports = router;
