# Hospital Management Backend (Spring Boot)

## Requirements
- Java 22
- Maven
- Oracle XE running locally

## Configuration
Edit `src/main/resources/application.properties` if needed:

```
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:XE
spring.datasource.username=system
spring.datasource.password=system
```

Default admin login (demo):
- Email: `admin@medilane.com`
- Password: `admin123`

## Run
From the `backend` folder:

```
mvn spring-boot:run
```

## API Endpoints

Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Doctors
- `GET /api/doctors`

Patient
- `GET /api/patient/appointments`
- `POST /api/patient/appointments`
- `POST /api/patient/payments`

Admin
- `GET /api/admin/patients`
- `GET /api/admin/appointments`
- `PATCH /api/admin/appointments/{id}/status`
- `DELETE /api/admin/appointments/{id}`
