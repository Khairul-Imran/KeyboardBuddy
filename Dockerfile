FROM node:21 AS ng-builder

RUN npm i -g @angular/cli

WORKDIR /ngapp

# . represents to use the same name e.g. /ngapp/package*.json
# frontend is the file name in this case
# Need to do this as your dockerfile is at the same level as your frontend/backend folder.
COPY frontend/package*.json .
COPY frontend/angular.json .
COPY frontend/tsconfig.* .
COPY frontend/src src
COPY frontend/ngsw-config.json .

# Commands in the cli
RUN npm ci && ng build

# Start 2nd stage
# Starting with this Linux server
FROM maven:3-eclipse-temurin-21 AS sb-builder

## Build the application
# Create a directory call /app
# go into the directory cd /app
WORKDIR /sbapp

# everything after this is in /app
# Same as above, but we are using articles in this case
COPY backend/mvnw .
COPY backend/mvnw.cmd .
COPY backend/pom.xml .
COPY backend/.mvn .mvn
COPY backend/src src
COPY --from=ng-builder /ngapp/dist/frontend/browser/ src/main/resources/static

# Build the application
RUN mvn package -Dmaven.test.skip=true

# Start 3rd stage
FROM openjdk:21-jdk-bullseye

WORKDIR /app 

COPY --from=sb-builder /sbapp/target/backend-0.0.1-SNAPSHOT.jar keyboardbuddy.jar

## Run the application
# Define environment variable 
ENV PORT=8080 

ENV SPRING_MAIL_HOST=
ENV SPRING_MAIL_PORT=
ENV SPRING_MAIL_USERNAME=
ENV SPRING_MAIL_PASSWORD=
ENV SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=
ENV SPRING_MAIL_PROPERTIES_MAIL_SMTP_ENABLE=

ENV STRIPE_API_KEY=

ENV LOCAL_CLIENT_URL=

# Expose the port
EXPOSE ${PORT}

# Run the program
ENTRYPOINT SERVER_PORT=${PORT} java -jar keyboardbuddy.jar