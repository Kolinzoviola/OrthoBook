# Collins OrthoCare - Backend Server

Express.js backend API for the Collins OrthoCare appointment booking system.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite (via Prisma ORM)
- **Validation**: Zod
- **Security**: Helmet, CORS

## Prerequisites

- Node.js 18+ and npm

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure as needed:

```bash
cp .env.example .env
```

Default configuration:
- Database: SQLite (file-based, located at `./prisma/dev.db`)
- Port: 3001
- CORS Origin: http://localhost:5173

### 3. Initialize Database

Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Seed Database (Optional)

Populate the database with sample data:

```bash
npm run db:seed
```

This creates:
- 2 visit types (Video and In-Person consultations)
- 3 sample appointments

### 5. Start Development Server

```bash
npm run dev
```

The server will start on http://localhost:3001

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Appointments

- `GET /api/appointments` - Get all appointments (with optional filters)
  - Query params: `status`, `email`, `date`, `startDate`, `endDate`
- `GET /api/appointments/:id` - Get specific appointment
- `POST /api/appointments` - Create new appointment
- `PATCH /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment (soft delete)
- `GET /api/appointments/stats/summary` - Get appointment statistics

### Visit Types

- `GET /api/visit-types` - Get all visit types
- `GET /api/visit-types/:id` - Get specific visit type

## Database Schema

### Appointment Model

```prisma
model Appointment {
  id              String   @id @default(uuid())
  visitType       String   // "InPerson" or "Video"
  visitDuration   Int
  date            String
  time            String
  firstName       String
  lastName        String
  email           String
  phone           String
  reasonForVisit  String
  injuryDate      String?
  painScale       Int?
  additionalNotes String?
  files           String?  // JSON array
  status          String   @default("Scheduled")
  reminder24hSent Boolean  @default(false)
  reminder2hSent  Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### VisitType Model

```prisma
model VisitType {
  id          String  @id
  name        String
  duration    Int
  description String
}
```

## Development

### Database Management

View database with Prisma Studio:

```bash
npm run prisma:studio
```

Create new migration:

```bash
npm run prisma:migrate
```

### Build for Production

```bash
npm run build
npm start
```

## Switching to PostgreSQL

To use PostgreSQL instead of SQLite:

1. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/orthocare"
```

3. Run migrations:

```bash
npm run prisma:migrate
```

## API Request Examples

### Create Appointment

```bash
curl -X POST http://localhost:3001/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "visitType": "InPerson",
    "visitDuration": 30,
    "date": "2025-11-01",
    "time": "9:00 AM",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+234 801 234 5678",
    "reasonForVisit": "Knee pain",
    "painScale": 5
  }'
```

### Get All Appointments

```bash
curl http://localhost:3001/api/appointments
```

### Filter by Status

```bash
curl "http://localhost:3001/api/appointments?status=Scheduled"
```

### Update Appointment

```bash
curl -X PATCH http://localhost:3001/api/appointments/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Completed"
  }'
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

Error response format:

```json
{
  "error": "Error message here"
}
```
