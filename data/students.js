const AppError = require('../utils/AppError');

let students = [
  {
    id: 1,
    name: 'Amina Hassan',
    email: 'amina.hassan@example.com',
    age: 21,
    course: 'Computer Science',
    gpa: 3.8,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Marcus Chen',
    email: 'marcus.chen@example.com',
    age: 22,
    course: 'Data Science',
    gpa: 3.9,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    age: 20,
    course: 'Software Engineering',
    gpa: 3.4,
    status: 'Inactive'
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'david.kim@example.com',
    age: 23,
    course: 'Computer Science',
    gpa: 3.1,
    status: 'Active'
  },
  {
    id: 5,
    name: 'Fatima Al-Mansoor',
    email: 'fatima.almansoor@example.com',
    age: 19,
    course: 'Information Technology',
    gpa: 3.7,
    status: 'Active'
  }
];

const findStudentOrThrow = (id) => {
  const numericId = Number(id);
  const student = Number.isInteger(numericId)
    ? students.find((item) => item.id === numericId)
    : null;

  if (!student) {
    throw new AppError(`Student with ID ${id} not found`, 404);
  }

  return student;
};

const findByEmail = (email, excludeId = null) => {
  const normalizedEmail = email.trim().toLowerCase();
  const numericExcludeId = excludeId !== null ? Number(excludeId) : null;

  return students.find(
    (student) =>
      student.email.toLowerCase() === normalizedEmail &&
      (numericExcludeId === null || student.id !== numericExcludeId)
  );
};

const matchesFilter = (student, filters) => {
  const { name, email, status, course, minGpa, maxGpa } = filters;

  if (name && !student.name.toLowerCase().includes(name.trim().toLowerCase())) {
    return false;
  }
  if (email && !student.email.toLowerCase().includes(email.trim().toLowerCase())) {
    return false;
  }
  if (status && student.status.toLowerCase() !== status.trim().toLowerCase()) {
    return false;
  }
  if (course && !student.course.toLowerCase().includes(course.trim().toLowerCase())) {
    return false;
  }
  if (minGpa !== undefined && !Number.isNaN(Number(minGpa)) && student.gpa < Number(minGpa)) {
    return false;
  }
  if (maxGpa !== undefined && !Number.isNaN(Number(maxGpa)) && student.gpa > Number(maxGpa)) {
    return false;
  }

  return true;
};

const getNextId = () => {
  return students.length > 0 ? Math.max(...students.map((item) => item.id)) + 1 : 1;
};

const getAll = (filters = {}) => {
  return students.filter((student) => matchesFilter(student, filters));
};

const create = (studentData) => {
  const newStudent = {
    id: getNextId(),
    name: studentData.name.trim(),
    email: studentData.email.trim().toLowerCase(),
    age: Number(studentData.age),
    course: studentData.course.trim(),
    gpa: Number(studentData.gpa),
    status: studentData.status.trim()
  };

  students.push(newStudent);
  return newStudent;
};

const update = (id, studentData) => {
  const student = findStudentOrThrow(id);

  student.name = studentData.name.trim();
  student.email = studentData.email.trim().toLowerCase();
  student.age = Number(studentData.age);
  student.course = studentData.course.trim();
  student.gpa = Number(studentData.gpa);
  student.status = studentData.status.trim();

  return student;
};

const patch = (id, patchData) => {
  const student = findStudentOrThrow(id);

  if (patchData.name !== undefined) student.name = patchData.name.trim();
  if (patchData.email !== undefined) student.email = patchData.email.trim().toLowerCase();
  if (patchData.age !== undefined) student.age = Number(patchData.age);
  if (patchData.course !== undefined) student.course = patchData.course.trim();
  if (patchData.gpa !== undefined) student.gpa = Number(patchData.gpa);
  if (patchData.status !== undefined) student.status = patchData.status.trim();

  return student;
};

const remove = (id) => {
  const student = findStudentOrThrow(id);
  const index = students.indexOf(student);
  students.splice(index, 1);
};

const getStats = () => {
  const total = students.length;
  if (total === 0) {
    return {
      total: 0,
      averageGpa: 0,
      countByCourse: {},
      countByStatus: {}
    };
  }

  const gpaSum = students.reduce((acc, student) => acc + student.gpa, 0);
  const averageGpa = Number((gpaSum / total).toFixed(2));

  const countByCourse = students.reduce((acc, student) => {
    acc[student.course] = (acc[student.course] || 0) + 1;
    return acc;
  }, {});

  const countByStatus = students.reduce((acc, student) => {
    acc[student.status] = (acc[student.status] || 0) + 1;
    return acc;
  }, {});

  return {
    total,
    averageGpa,
    countByCourse,
    countByStatus
  };
};

module.exports = {
  findStudentOrThrow,
  findByEmail,
  getAll,
  create,
  update,
  patch,
  remove,
  getStats
};
