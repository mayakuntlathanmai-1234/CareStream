# CareStream Hospital Management System

A full-stack Hospital Management System built with Spring Boot and React.

## Features
- **Role-Based Access**: Specialized dashboards for Admin, Doctors, and Patients.
- **Appointment Booking**: Patients can select doctors and schedule visits.
- **Medical Records**: Secure tracking of patient clinical history.
- **Modern UI**: Clinical aesthetic using Tailwind CSS and Lucide icons.
- **Security**: JWT-based authentication with Spring Security.

## Tech Stack
- **Backend**: Java 17, Spring Boot 3, Spring Security, JWT, JPA, H2.
- **Frontend**: React 18, Vite, Tailwind CSS, Axios, Lucide React.

---

## Setup Instructions (Eclipse)

### Prerequisites
- JDK 17 or higher
- Maven 3.6+
- Node.js (for frontend)

### 1. Import Backend into Eclipse
1. Open Eclipse IDE.
2. Select **File > Import...**
3. Choose **Maven > Existing Maven Projects**.
4. Browse to the `carestream-backend` directory.
5. Click **Finish**.
6. Wait for Maven to download dependencies.
7. Right-click on `CareStreamApplication.java` and select **Run As > Java Application**.

### 2. Run Frontend
1. Open a terminal in the `carestream-frontend` directory.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.
4. Access the app at `http://localhost:5173`.

---

## Default Credentials
- **Admin**: `admin` / `admin123`
- **Doctor**: `janesmith` / `doctor123`
- **Patient**: `john_doe` / `patient123`

## Database Access (MySQL)
- **Database Name**: `carestream_db`
- **User**: `root`
- **Password**: `ADST@143`
- **JDBC URL**: `jdbc:mysql://localhost:3306/carestream_db`
