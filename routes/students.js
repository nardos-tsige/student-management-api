const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const validateStudent = require('../middleware/validateStudent');

router
  .route('/')
  .get(studentController.getAllStudents)
  .post(validateStudent({ isPartial: false }), studentController.createStudent);

// Route order matters: /stats must precede /:id to prevent "stats" from matching as an ID parameter
router.get('/stats', studentController.getStudentStats);

router
  .route('/:id')
  .get(studentController.getStudentById)
  .put(validateStudent({ isPartial: false }), studentController.updateStudent)
  .patch(validateStudent({ isPartial: true }), studentController.patchStudent)
  .delete(studentController.deleteStudent);

module.exports = router;
