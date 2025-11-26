# API Documentation - ENNO COIFFEUR

Base URL: \`http://localhost:3000\` (development) or your production domain

## Authentication

All protected endpoints require a valid user session. Users must be logged in and have appropriate role permissions.

---

## Authentication Endpoints

### Login
**POST** \`/api/auth/login\`

Authenticate a user and create a session.

**Request Body:**
\`\`\`json
{
  "email": "admin@ennocoiffeur.ch",
  "password": "admin123"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "user": {
    "id": "uuid",
    "name": "Admin",
    "email": "admin@ennocoiffeur.ch",
    "phone": "+41 22 123 45 67",
    "role": "admin",
    "photo_url": null
  }
}
\`\`\`

**Error Response (401 Unauthorized):**
\`\`\`json
{
  "error": "Invalid email or password"
}
\`\`\`

---

### Logout
**POST** \`/api/auth/logout\`

Logout the current user.

**Response (200 OK):**
\`\`\`json
{
  "success": true
}
\`\`\`

---

## Admin Endpoints

### Create User
**POST** \`/api/admin/create-user\`

Create a new user (admin, barber, or client).

**Required Role:** Admin

**Request Body:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+41 22 123 45 67",
  "role": "barber"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "barber",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
\`\`\`

---

### Services

#### Get All Services
**GET** \`/api/admin/services\`

Retrieve all services.

**Response (200 OK):**
\`\`\`json
{
  "services": [
    {
      "id": "uuid",
      "name": "Classic Haircut",
      "price": 45.00,
      "duration_minutes": 30,
      "description": "Traditional men's haircut with styling",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
\`\`\`

#### Create Service
**POST** \`/api/admin/services\`

Create a new service.

**Required Role:** Admin

**Request Body:**
\`\`\`json
{
  "name": "Premium Haircut",
  "price": 60.00,
  "duration_minutes": 45,
  "description": "Premium haircut with consultation"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "service": {
    "id": "uuid",
    "name": "Premium Haircut",
    "price": 60.00,
    "duration_minutes": 45,
    "description": "Premium haircut with consultation"
  }
}
\`\`\`

#### Update Service
**PATCH** \`/api/admin/services\`

Update an existing service.

**Required Role:** Admin

**Request Body:**
\`\`\`json
{
  "id": "uuid",
  "name": "Updated Name",
  "price": 50.00,
  "duration_minutes": 35,
  "description": "Updated description"
}
\`\`\`

#### Delete Service
**DELETE** \`/api/admin/services?id=uuid\`

Delete a service.

**Required Role:** Admin

---

### Appointments

#### Get All Appointments
**GET** \`/api/admin/appointments\`

Get all appointments (admin) or filtered by barber.

**Query Parameters:**
- \`barberId\` (optional): Filter by barber ID

**Response (200 OK):**
\`\`\`json
{
  "appointments": [
    {
      "id": "uuid",
      "date": "2024-01-15",
      "start_time": "10:00:00",
      "end_time": "10:30:00",
      "status": "confirmed",
      "notes": null,
      "service": {
        "id": "uuid",
        "name": "Classic Haircut",
        "price": 45.00,
        "duration_minutes": 30
      },
      "barber": {
        "id": "uuid",
        "user": {
          "name": "John Barber",
          "email": "john@ennocoiffeur.ch"
        }
      },
      "client": {
        "id": "uuid",
        "user": {
          "name": "Client Name",
          "email": "client@example.com"
        }
      }
    }
  ]
}
\`\`\`

#### Create Appointment
**POST** \`/api/admin/appointments\`

Create a new appointment.

**Request Body:**
\`\`\`json
{
  "barber_id": "uuid",
  "client_id": "uuid",
  "service_id": "uuid",
  "date": "2024-01-15",
  "start_time": "10:00:00",
  "end_time": "10:30:00",
  "status": "pending",
  "notes": "Client prefers short cut"
}
\`\`\`

**Response (200 OK):**
Returns the created appointment with full details.

**Error (409 Conflict):**
\`\`\`json
{
  "error": "Time slot is already booked"
}
\`\`\`

#### Update Appointment
**PATCH** \`/api/admin/appointments\`

Update appointment status or details.

**Request Body:**
\`\`\`json
{
  "id": "uuid",
  "status": "confirmed"
}
\`\`\`

#### Delete Appointment
**DELETE** \`/api/admin/appointments?id=uuid\`

Delete an appointment.

---

### Statistics

#### Get Admin Statistics
**GET** \`/api/admin/stats?period=month\`

Get comprehensive statistics for the shop.

**Query Parameters:**
- \`period\`: \`day\`, \`week\`, or \`month\` (default: month)

**Response (200 OK):**
\`\`\`json
{
  "totalAppointments": 150,
  "totalRevenue": 6750.00,
  "totalClients": 45,
  "totalBarbers": 3,
  "mostBookedBarber": {
    "name": "John Barber",
    "count": 65
  },
  "mostPopularService": {
    "name": "Classic Haircut",
    "count": 85
  },
  "peakHours": [
    { "hour": 14, "count": 25 },
    { "hour": 10, "count": 22 },
    { "hour": 16, "count": 20 }
  ],
  "appointmentsByDay": {
    "2024-01-01": 5,
    "2024-01-02": 8,
    "2024-01-03": 6
  }
}
\`\`\`

---

### Barbers

#### Get All Barbers
**GET** \`/api/admin/barbers\`

Get all barbers with their schedules.

**Response (200 OK):**
\`\`\`json
{
  "barbers": [
    {
      "id": "uuid",
      "working_hours": {
        "monday": { "start": "09:00", "end": "18:00" },
        "tuesday": { "start": "09:00", "end": "18:00" },
        "wednesday": { "start": "09:00", "end": "18:00" },
        "thursday": { "start": "09:00", "end": "18:00" },
        "friday": { "start": "09:00", "end": "18:00" },
        "saturday": { "start": "09:00", "end": "16:00" },
        "sunday": null
      },
      "break_times": [],
      "blocked_days": [],
      "user": {
        "id": "uuid",
        "name": "John Barber",
        "email": "john@ennocoiffeur.ch",
        "phone": "+41 22 123 45 67"
      }
    }
  ]
}
\`\`\`

#### Update Barber Schedule
**PATCH** \`/api/admin/barbers\`

Update barber's working hours, breaks, or blocked days.

**Request Body:**
\`\`\`json
{
  "id": "uuid",
  "working_hours": {
    "monday": { "start": "08:00", "end": "17:00" },
    "tuesday": { "start": "08:00", "end": "17:00" },
    "wednesday": null,
    "thursday": { "start": "08:00", "end": "17:00" },
    "friday": { "start": "08:00", "end": "17:00" },
    "saturday": { "start": "09:00", "end": "14:00" },
    "sunday": null
  },
  "break_times": [
    { "start": "12:00", "end": "13:00" }
  ],
  "blocked_days": ["2024-12-25", "2024-01-01"]
}
\`\`\`

---

## Barber Endpoints

### Get Barber Statistics
**GET** \`/api/barber/stats/:id?period=month\`

Get statistics for a specific barber.

**Required Role:** Barber (own stats only) or Admin

**Query Parameters:**
- \`period\`: \`day\`, \`week\`, or \`month\`

**Response (200 OK):**
\`\`\`json
{
  "totalAppointments": 50,
  "totalRevenue": 2250.00,
  "mostSelectedService": {
    "name": "Classic Haircut",
    "count": 30
  },
  "appointmentsByDay": {
    "2024-01-01": 2,
    "2024-01-02": 3
  }
}
\`\`\`

---

## Client Endpoints

### Get Client Appointments
**GET** \`/api/client/appointments?clientId=uuid\`

Get all appointments for a specific client.

**Required Role:** Client (own appointments only) or Admin

**Response (200 OK):**
Same format as admin appointments endpoint.

### Cancel Appointment
**DELETE** \`/api/client/appointments?id=uuid\`

Cancel an appointment (must be 2+ hours before start time).

**Required Role:** Client (own appointments only) or Admin

**Response (200 OK):**
\`\`\`json
{
  "success": true
}
\`\`\`

**Error (400 Bad Request):**
\`\`\`json
{
  "error": "Cannot cancel appointment less than 2 hours before start time"
}
\`\`\`

---

### Get Available Time Slots
**GET** \`/api/client/available-slots?barberId=uuid&date=2024-01-15&duration=30\`

Get available time slots for booking.

**Query Parameters:**
- \`barberId\` (required): Barber UUID
- \`date\` (required): Date in YYYY-MM-DD format
- \`duration\` (required): Service duration in minutes

**Response (200 OK):**
\`\`\`json
{
  "slots": [
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "14:00",
    "14:15",
    "14:30"
  ]
}
\`\`\`

**Empty Response (no slots available):**
\`\`\`json
{
  "slots": []
}
\`\`\`

---

## Error Codes

- **200 OK**: Request successful
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required or failed
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict (e.g., time slot already booked)
- **500 Internal Server Error**: Server error

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production:
- Login attempts: 5 per minute
- API calls: 100 per minute per user
- Booking attempts: 10 per minute

---

## Data Types

### User Roles
- \`admin\`: Full system access
- \`barber\`: Access to own appointments and stats
- \`client\`: Access to own appointments and booking

### Appointment Status
- \`pending\`: Awaiting confirmation
- \`confirmed\`: Confirmed by barber
- \`completed\`: Service completed
- \`canceled\`: Canceled by client or admin

### Time Format
- Times are stored as \`HH:MM:SS\` (24-hour format)
- Dates are stored as \`YYYY-MM-DD\`
- Timestamps use ISO 8601 format

---

## Best Practices

1. **Always validate input data** on both client and server
2. **Check user permissions** before allowing operations
3. **Handle errors gracefully** and return meaningful messages
4. **Use transactions** for operations that modify multiple tables
5. **Log important events** for debugging and auditing
6. **Sanitize user input** to prevent SQL injection and XSS

---

## Testing with cURL

### Login
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@ennocoiffeur.ch","password":"admin123"}'
\`\`\`

### Get Services
\`\`\`bash
curl http://localhost:3000/api/admin/services
\`\`\`

### Create Appointment
\`\`\`bash
curl -X POST http://localhost:3000/api/admin/appointments \\
  -H "Content-Type: application/json" \\
  -d '{
    "barber_id":"uuid",
    "client_id":"uuid",
    "service_id":"uuid",
    "date":"2024-01-15",
    "start_time":"10:00:00",
    "end_time":"10:30:00",
  {
    "email": "your-admin@example.com",
    "password": "your-strong-password"
  }
---

**Last Updated**: November 2024
