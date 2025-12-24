# Module14 — Booking Service (NextLevel)

A lightweight backend for vehicle bookings built with Node.js, TypeScript, and Express. It provides user authentication, vehicle management, booking operations, and a scheduled job to auto-return expired bookings.

## Features

- User authentication (JWT)
- CRUD for vehicles and bookings
- PostgreSQL integration with automatic table creation on startup
- Background job for auto-returning bookings (cron)
- TypeScript for type safety

## Tech Stack

- Node.js + TypeScript
- Express
- PostgreSQL (`pg`)
- JWT for auth
- `cron` for scheduled jobs

## Quick Start

Prerequisites:

- Node.js (v18+ recommended)
- PostgreSQL

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the project root with the following variables (example):

```
connectionString=postgresql://user:password@localhost:5432/yourdb
port=3000
jwtSecret=your_jwt_secret
```

3. Run in development (hot reload via `tsx`):

```bash
npm run dev
```

4. Build (TypeScript) and run the compiled output:

```bash
npm run build
node dist/server.js
```

> Development script: `dev` runs `npx tsx watch ./src/server.ts`. The build script runs `tsc`.

## Environment Variables

- `connectionString` — PostgreSQL connection string (required).
- `port` — HTTP server port (optional; default handled in code).
- `jwtSecret` — secret for signing JWT tokens (required).

The config is loaded from `.env` and the keys are referenced in `src/config/index.ts`.

## Project Structure

- `src/app.ts` — Express app initialization
- `src/server.ts` — server bootstrap
- `src/config/` — configuration and DB setup (`db.ts` creates tables if missing)
- `src/modules/` — feature modules: `auth`, `users`, `bookings`, `vehicles`
- `src/services/` — background jobs and other services (`autoReturn.service.ts`)
- `src/middleware/` — authentication and logging middleware

## Database

The project uses PostgreSQL. On startup the application will attempt to create the tables used by the app (see `src/config/db.ts`). Ensure the `connectionString` points to a reachable database with appropriate credentials.

## Contributing

- Fork the repo and create a feature branch.
- Open a pull request with a clear description of the change.

## License

This project is provided as-is. Add a license file if you intend to open-source it.

---

If you'd like, I can also:

- Add example API usage (endpoints & payloads)
- Add a Postman collection or Swagger/OpenAPI spec
- Create a `.env.example` file

Files updated: [README.md](README.md)

## API Reference

Below are the main API endpoints, access rules, request examples, and typical responses.

**Auth**

1. User Registration
	- Access: Public
	- Description: Register a new user account
	- Endpoint: `POST /api/v1/auth/signup`
	- Request Body:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phone": "01712345678",
  "role": "customer"
}
```

	- Success Response (201 Created):

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
	 "id": 1,
	 "name": "John Doe",
	 "email": "john.doe@example.com",
	 "phone": "01712345678",
	 "role": "customer"
  }
}
```

2. User Login
	- Access: Public
	- Description: Login and receive JWT authentication token
	- Endpoint: `POST /api/v1/auth/signin`
	- Request Body:

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

	- Success Response (200 OK):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
	 "token": "<jwt_token>",
	 "user": {
		"id": 1,
		"name": "John Doe",
		"email": "john.doe@example.com",
		"phone": "+1234567890",
		"role": "customer"
	 }
  }
}
```

**Vehicle Endpoints**

3. Create Vehicle
	- Access: Admin only
	- Endpoint: `POST /api/v1/vehicles`
	- Headers: `Authorization: Bearer <jwt_token>`
	- Request Body:

```json
{
  "vehicle_name": "Toyota Camry 2024",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50,
  "availability_status": "available"
}
```

	- Success Response (201 Created): returns created vehicle object.

4. Get All Vehicles
	- Access: Public
	- Endpoint: `GET /api/v1/vehicles`
	- Success Response (200 OK): returns list or empty array with message "No vehicles found".

5. Get Vehicle by ID
	- Access: Public
	- Endpoint: `GET /api/v1/vehicles/:vehicleId`

6. Update Vehicle
	- Access: Admin only
	- Endpoint: `PUT /api/v1/vehicles/:vehicleId`
	- Headers: `Authorization: Bearer <jwt_token>`
	- Request Body: All fields optional (update name, price, availability, etc.)

7. Delete Vehicle
	- Access: Admin only
	- Endpoint: `DELETE /api/v1/vehicles/:vehicleId`
	- Headers: `Authorization: Bearer <jwt_token>`
	- Note: Only allowed if no active bookings exist for the vehicle.

**User Endpoints**

8. Get All Users
	- Access: Admin only
	- Endpoint: `GET /api/v1/users`
	- Headers: `Authorization: Bearer <jwt_token>`

9. Update User
	- Access: Admin or own profile
	- Endpoint: `PUT /api/v1/users/:userId`
	- Headers: `Authorization: Bearer <jwt_token>`
	- Request Body: fields optional (name, email, phone, role)

10. Delete User
	 - Access: Admin only
	 - Endpoint: `DELETE /api/v1/users/:userId`
	 - Headers: `Authorization: Bearer <jwt_token>`
	 - Note: Only allowed if no active bookings exist for the user.

**Booking Endpoints**

11. Create Booking
	 - Access: Customer or Admin
	 - Endpoint: `POST /api/v1/bookings`
	 - Headers: `Authorization: Bearer <jwt_token>`
	 - Request Body:

```json
{
  "customer_id": 1,
  "vehicle_id": 2,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20"
}
```

	 - Success Response (201 Created): booking object with calculated `total_price` and nested `vehicle` data.

12. Get All Bookings
	 - Access: Role-based (Admin sees all, Customer sees own)
	 - Endpoint: `GET /api/v1/bookings`
	 - Headers: `Authorization: Bearer <jwt_token>`

13. Update Booking
	 - Access: Role-based
	 - Endpoint: `PUT /api/v1/bookings/:bookingId`
	 - Headers: `Authorization: Bearer <jwt_token>`
	 - Request Body Examples:

Customer cancellation:
```json
{ "status": "cancelled" }
```

Admin mark as returned:
```json
{ "status": "returned" }
```

**Common Response Patterns**

Standard success:
```json
{ "success": true, "message": "Operation description", "data": ... }
```

Standard error:
```json
{ "success": false, "message": "Error description", "errors": ... }
```

**HTTP Status Codes**

- `200` — OK (GET, PUT, DELETE success)
- `201` — Created (POST success)
- `400` — Bad Request (validation)
- `401` — Unauthorized (missing/invalid token)
- `403` — Forbidden (insufficient permissions)
- `404` — Not Found (resource missing)
- `500` — Internal Server Error

---

If you want, I can format these as an OpenAPI (Swagger) spec or add example cURL/Postman requests for each endpoint.

