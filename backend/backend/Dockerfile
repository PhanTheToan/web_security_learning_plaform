FROM maven:3.9-eclipse-temurin-17

WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw -q -DskipTests dependency:go-offline

COPY src/ src/

EXPOSE 8082

CMD ["./mvnw", "spring-boot:run"]
