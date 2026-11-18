const express = require('express');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const studentRoutes = require('./routes/students');
const AppError = require('./utils/AppError');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.use('/api/students', studentRoutes);

app.use((req, res, next) => {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl} - Route not found`, 404));
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT);
}

module.exports = app;
