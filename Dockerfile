# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the entire backend folder
COPY carestream-backend/pom.xml carestream-backend/
COPY carestream-backend/src carestream-backend/src

# Build only the backend
WORKDIR /app/carestream-backend
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/carestream-backend/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
