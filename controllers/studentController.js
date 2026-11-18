const asyncHandler = require('../utils/asyncHandler');
const studentStore = require('../data/students');

const getAllStudents = asyncHandler(async (req, res) => {
  const students = studentStore.getAll(req.query);
  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

const getStudentStats = asyncHandler(async (req, res) => {
  const stats = studentStore.getStats();
  res.status(200).json({
    success: true,
    data: stats
  });
});

const getStudentById = asyncHandler(async (req, res) => {
  const student = studentStore.findStudentOrThrow(req.params.id);
  res.status(200).json({
    success: true,
    data: student
  });
});

const createStudent = asyncHandler(async (req, res) => {
  const newStudent = studentStore.create(req.body);
  res.status(201).json({
    success: true,
    data: newStudent
  });
});

const updateStudent = asyncHandler(async (req, res) => {
  const updatedStudent = studentStore.update(req.params.id, req.body);
  res.status(200).json({
    success: true,
    data: updatedStudent
  });
});

const patchStudent = asyncHandler(async (req, res) => {
  const updatedStudent = studentStore.patch(req.params.id, req.body);
  res.status(200).json({
    success: true,
    data: updatedStudent
  });
});

const deleteStudent = asyncHandler(async (req, res) => {
  studentStore.remove(req.params.id);
  res.status(204).send();
});

module.exports = {
  getAllStudents,
  getStudentStats,
  getStudentById,
  createStudent,
  updateStudent,
  patchStudent,
  deleteStudent
};
