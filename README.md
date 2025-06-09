# Gaming Gear Hub

A full-stack e-commerce platform for gaming peripherals and accessories, built with Angular for the frontend and Spring Boot for the backend.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Product Catalog**: Browse gaming gear across multiple categories
- **Shopping Cart**: Add/remove items and manage quantities
- **Admin Dashboard**: Manage products, categories, and orders
- **Responsive Design**: Works on desktop and mobile devices

## 🛠 Tech Stack

### Frontend
- Angular 15+
- TypeScript
- Angular Material
- RxJS
- SCSS

### Backend
- Java 17
- Spring Boot 3.x
- Spring Security
- JPA/Hibernate
- MySQL

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later)
- Angular CLI (v15 or later)
- Java 17 or later
- MySQL 8.0+

### Frontend Setup

```bash
# Navigate to frontend directory
cd gaming_gear_hub_frontend

# Install dependencies
npm install

# Start development server
ng serve
```

### Backend Setup

1. Create a MySQL database named `gaming_gear_hub`
2. Update database configuration in `Gaming_Gear_Hub/src/main/resources/application.properties`
3. Run the Spring Boot application:

```bash
# Navigate to backend directory
cd Gaming_Gear_Hub

# Run the application
./mvnw spring-boot:run
```

## 📂 Project Structure

```
Gaming_Project/
├── Gaming_Gear_Hub/         # Backend (Spring Boot)
│   ├── src/
│   └── pom.xml
│
└── gaming_gear_hub_frontend/ # Frontend (Angular)
    ├── src/
    └── package.json
```

## 🌐 API Documentation

API documentation is available at `http://localhost:8080/swagger-ui.html` when the backend is running.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [Angular](https://angular.io/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Angular Material](https://material.angular.io/)
