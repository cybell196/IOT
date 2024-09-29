const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Cấu hình Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Tài liệu API cho dự án của bạn',
    },
    servers: [
      {
        url: 'http://localhost:3002', // URL của server API
      },
    ],
  },
  apis: ['src/routes/*.js', 'src/controllers/*.js'], // Quét cả routes và controllers
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Định tuyến tới API docs
};

module.exports = setupSwagger;
