# WEBLAB HS25 - Technologie-Radar

Dies ist das WEBLAB Projekt von Dario Sartori für das HS25.
Ziel ist die Aufgabenstellung [Technologieradar](https://github.com/web-programming-lab/web-programming-lab-projekt/blob/95134d1041bce5140a3e29f034154216fcffd7ff/Technologie-Radar.md) umzusetzen.
Der Umfang wird nicht angepasst

## Tech-Stack


- **Frontend:** Angular
- **Backend:** NestJS
- **Datenbank:** PostgreSQL + Prisma
- **Auth:** JWT
- **Testing:** Cypress + Jest

## Setup
### Database
- install PostgreSQL from https://www.postgresql.org/download/
- gegebenenfalls Passwort in /backend/.env DATABASE_URL anpassen
- cd backend
- psql -U postgres -h localhost -p 5432 -d postgres -c "CREATE SCHEMA IF NOT EXISTS techradar;"
- npm run db:migrate
- npm run db:seed

### Backend
- cd backend
- npm i
- npm run start:dev

### Frontend
- cd frontend
- npm i
- ng serve

## Usage
Aus dem Seed werden bereits zwei Benutzer erstellt, mit denen man sich einloggen kann:
- cto@example.com --> Rolle CTO
- emp@example.com --> Rolle Employee

Beide können mit dem Passwort 12345678 eingeloggt werden.

Über http://localhost:4200/viewer kann das Radar aufgerufen werden

Über http://localhost:4200/admin/technologies kann die Admin-Seite aufgerufen werden

## Tests
### Backend
- cd backend
- npm run test

### Frontend
- cd frontend
- npm run test

### Cypress
- frontend & backend starten
- cd frontend
- npm run e2e:open