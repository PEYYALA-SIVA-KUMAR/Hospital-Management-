# Hospital Management System (Full Stack)

## Overview
Frontend (HTML/CSS/JS) + Spring Boot backend + Oracle DB.

## Prerequisites
- Java 22
- Oracle XE running locally
- Maven Wrapper included (no separate Maven install needed)

## Backend (Spring Boot)
Run from the `backend` folder:

```bash
.\mvnw.cmd spring-boot:run
```

Backend runs on:
```
http://127.0.0.1:8081
```

## Frontend (Live Server)
Open with VS Code Live Server (not file://):
```
http://127.0.0.1:5500/docs/index.html
```

If Live Server uses a different port, it's OK — backend CORS allows any localhost port.

## Admin Login
Admin credentials are read from:
`backend/src/main/resources/application.properties`

Example:
```
app.admin.email=siva@gmail.com
app.admin.password=siva123
```

## Useful Test URL
Check backend is running:
```
http://127.0.0.1:8081/api/doctors
```

## Project Structure
- `docs/` ? Frontend (GitHub Pages compatible)
- `backend/` ? Spring Boot application
- `database/` ? Oracle SQL schema
