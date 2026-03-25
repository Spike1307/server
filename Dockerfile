# Use an official OpenJDK image as a base image
FROM eclipse-temurin:21

# Set the working directory inside the container
WORKDIR /server

# Copy the built jar file into the container
# For Maven users
# COPY target/demo-0.0.1-SNAPSHOT.jar app.jar
# For Gradle users (uncomment the line below)
# COPY build/libs/demo-0.0.1-SNAPSHOT.jar app.jar
COPY target/server-0.0.1-SNAPSHOT.jar server.jar

# Expose the application port (change if necessary)
EXPOSE 8000

# Command to run the application
ENTRYPOINT ["java", "-jar", "server.jar"]