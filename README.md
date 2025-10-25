# Collins OrthoCare - Appointment Booking System

A modern, full-stack orthopedic appointment booking system with video consultation capabilities.

## Features

- **Online Booking**: Multi-step appointment booking wizard with date/time selection
- **Telemedicine**: Built-in video consultation functionality
- **Admin Dashboard**: View, manage, and export appointments
- **Appointment Management**: Create, view, update, and cancel appointments
- **Reminder System**: Automated appointment reminders
- **Export Options**: Export appointments to CSV and iCalendar formats
- **Responsive Design**: Mobile-first, fully responsive UI

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** - Modern build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **date-fns** - Date manipulation

### Backend
- **Node.js** with TypeScript
- **Express** - Web framework
- **Prisma ORM** - Database toolkit
- **SQLite** - Database (easily upgradable to PostgreSQL)
- **Zod** - Schema validation
- **Helmet & CORS** - Security

## Project Structure

```
OrthoBook/
├── server/                  # Backend API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── db.ts           # Database connection
│   │   ├── validation.ts   # Zod schemas
│   │   ├── seed.ts         # Database seeding
│   │   └── index.ts        # Server entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
│
├── api/                    # Frontend API client
│   ├── client.ts          # API functions
│   └── adapters.ts        # Data transformers
│
├── components/            # React components
├── pages/                 # Page components
├── context/              # React context providers
├── types.ts              # TypeScript types
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd OrthoBook
```

#### 2. Set Up Backend

```bash
cd server
npm install
```

Configure environment variables:
```bash
cp .env.example .env
```

Initialize database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

Seed database with sample data:
```bash
npm run db:seed
```

Start backend server:
```bash
npm run dev
```

The backend will run on http://localhost:3001

#### 3. Set Up Frontend

Open a new terminal:

```bash
cd OrthoBook  # Navigate to root directory
npm install
```

Configure environment variables:
```bash
cp .env.example .env
```

Start frontend development server:
```bash
npm run dev
```

The frontend will run on http://localhost:5173

### Development

With both servers running:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Health: http://localhost:3001/health

## API Endpoints

### Appointments

- `GET /api/appointments` - Get all appointments
  - Query params: `status`, `email`, `date`, `startDate`, `endDate`
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PATCH /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/stats/summary` - Get statistics

### Visit Types

- `GET /api/visit-types` - Get all visit types
- `GET /api/visit-types/:id` - Get visit type by ID

## Database Schema

### Appointment

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Unique identifier |
| visitType | String | "InPerson" or "Video" |
| date | String | ISO date (YYYY-MM-DD) |
| time | String | Time (e.g., "9:00 AM") |
| firstName | String | Patient first name |
| lastName | String | Patient last name |
| email | String | Patient email |
| phone | String | Patient phone |
| reasonForVisit | String | Consultation reason |
| injuryDate | String? | Optional injury date |
| painScale | Int? | Pain level (1-10) |
| status | String | Scheduled/Completed/Cancelled |
| reminder24hSent | Boolean | 24h reminder sent flag |
| reminder2hSent | Boolean | 2h reminder sent flag |

### VisitType

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| name | String | Visit type name |
| duration | Int | Duration in minutes |
| description | String | Description |

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

### Backend (server/.env)
```env
DATABASE_URL="file:./dev.db"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## Building for Production

### Frontend
```bash
npm run build
npm run preview
```

### Backend
```bash
cd server
npm run build
npm start
```

## Database Management

View database with Prisma Studio:
```bash
cd server
npm run prisma:studio
```

Create a new migration:
```bash
cd server
npm run prisma:migrate
```

## Switching to PostgreSQL

1. Update `server/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `server/.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/orthocare"
```

3. Run migrations:
```bash
cd server
npm run prisma:migrate
```

## Features Detail

### Booking Flow
1. Select visit type (Video or In-Person)
2. Choose date and time slot
3. Enter patient details
4. Provide clinical information
5. Confirm and book

### Admin Dashboard
- View all appointments grouped by date
- Filter by status, date, or email
- Export to CSV or iCalendar format
- Join video consultations
- Manage appointments

### Video Consultations
- Pre-call camera/microphone setup
- Real-time video streaming
- Call status management
- Secure consultation interface

## Development Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend
```bash
npm run dev              # Start dev server with hot reload
npm run build            # Compile TypeScript
npm start                # Run production build
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
npm run db:seed          # Seed database
```

## Troubleshooting

### Backend won't start
- Ensure port 3001 is available
- Check `server/.env` configuration
- Run `npm run prisma:generate`

### Frontend can't connect to backend
- Verify backend is running on port 3001
- Check `.env` VITE_API_URL setting
- Check CORS configuration in `server/src/index.ts`

### Database errors
- Delete `server/prisma/dev.db` and run migrations again
- Run `npm run prisma:generate` after schema changes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions, please open an issue on GitHub.
