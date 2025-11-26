# ENNO COIFFEUR - Appointment Management Platform

A full-stack appointment management system built for a luxury barbershop in Geneva, Switzerland.

## 🌟 Features

### Admin Dashboard
- ✅ Create and manage users (Clients, Barbers, Admins)
- ✅ View all appointments across the shop
- ✅ Manage services (price, duration, description)
- ✅ Configure barber schedules and working hours
- ✅ View comprehensive statistics and analytics
- ✅ Generate reports (daily, weekly, monthly)
- ✅ Approve/cancel/edit appointments
- ✅ Visual charts for revenue and bookings

### Barber Dashboard
- ✅ View personal appointments
- ✅ See personal statistics (revenue, bookings)
- ✅ Confirm/complete appointments
- ✅ Track most popular services
- ✅ View upcoming schedule

### Client Portal
- ✅ Book new appointments
- ✅ View upcoming and past appointments
- ✅ Cancel appointments (with 2-hour restriction)
- ✅ See available time slots in real-time
- ✅ View service prices and durations

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom JWT-based auth
- **Charts**: Recharts
- **Styling**: Tailwind CSS with custom gold/black/white theme

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## 🚀 Installation

### 1. Clone the repository

\`\`\`bash
cd c:\Users\Admin\Desktop\Enno
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set up Supabase Database

1. Go to your Supabase project: https://mofwhurbhzafkjdcnqoy.supabase.co
2. Navigate to the SQL Editor
3. Copy and paste the contents of \`database/schema.sql\`
4. Run the SQL to create all tables and sample data


### 5. Run the development server

\`\`\`bash
npm run dev
\`\`\`

The application will be available at [http://localhost:3000](http://localhost:3000)

## 👥 Admin Account

Create your own admin account in production. You can create users via the app UI or insert an admin directly in your database. Do not use demo credentials.

## 📱 User Roles & Permissions

### Admin
- Full system access
- Create/manage all users
- View all appointments
- Manage services and pricing
- Configure barber schedules
- Access all statistics

### Barber
- View personal appointments only
- See personal statistics
- Confirm/complete appointments
- Cannot manage users or services

### Client
- Book appointments
- View personal bookings
- Cancel appointments (2+ hours before)
- Cannot see other clients' data

## 🗂 Project Structure

\`\`\`
Enno/
├── app/
│   ├── admin/              # Admin dashboard pages
│   ├── barber/             # Barber dashboard pages
│   ├── client/             # Client portal pages
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── admin/          # Admin-only endpoints
│   │   ├── barber/         # Barber endpoints
│   │   └── client/         # Client endpoints
│   ├── login/              # Login page
│   └── layout.tsx          # Root layout
├── components/
│   └── ui/                 # Reusable UI components
├── contexts/               # React contexts
├── lib/                    # Utilities and configs
│   ├── supabase.ts        # Supabase client
│   ├── auth.ts            # Authentication logic
│   ├── utils.ts           # Helper functions
│   └── database.types.ts  # TypeScript types
├── database/
│   └── schema.sql         # Database schema
└── public/                # Static assets
\`\`\`

## 🔑 Key Features Explained

### Appointment Booking System

The system prevents double-booking by:
1. Checking barber working hours
2. Verifying service duration fits in available slots
3. Checking for overlapping appointments
4. Respecting break times and blocked days

### Time Slot Generation

Available slots are generated based on:
- Barber's working hours for the selected day
- Service duration
- Existing appointments
- 15-minute increments

### Cancellation Policy

Clients can cancel appointments only if:
- The appointment is more than 2 hours away
- The appointment status is not already "canceled"

### Statistics

- Real-time calculations
- Period filtering (day/week/month)
- Revenue tracking
- Popular service analysis
- Peak hours identification
- Barber performance metrics

## 🎨 Design Theme

The application uses a luxury barbershop aesthetic:
- **Primary Color**: Gold (#D4AF37)
- **Secondary**: Black/White
- **Style**: Glassmorphism with soft shadows
- **Typography**: Inter font family
- **Components**: Rounded cards with smooth transitions

## 📊 Database Schema

### Tables

1. **users** - All system users
2. **barbers** - Barber-specific data (working hours, breaks)
3. **clients** - Client-specific data (loyalty points)
4. **services** - Available services
5. **appointments** - Booking records

See \`database/schema.sql\` for full schema details.

## 🔐 Security Features

- Password hashing with bcrypt
- Role-based access control
- Protected routes for each user type
- Server-side validation
- SQL injection prevention via Supabase

## 🌐 API Endpoints

### Authentication
- POST \`/api/auth/login\` - User login
- POST \`/api/auth/logout\` - User logout

### Admin
- POST \`/api/admin/create-user\` - Create new user
- GET/POST/PATCH/DELETE \`/api/admin/services\` - Manage services
- GET/POST/PATCH/DELETE \`/api/admin/appointments\` - Manage appointments
- GET \`/api/admin/stats\` - Get statistics
- GET/PATCH \`/api/admin/barbers\` - Manage barbers

### Barber
- GET \`/api/barber/stats/:id\` - Get barber statistics

### Client
- GET/DELETE \`/api/client/appointments\` - Manage appointments
- GET \`/api/client/available-slots\` - Get available time slots

## 🚧 Future Enhancements

- [ ] Email/WhatsApp notifications
- [ ] Loyalty points system
- [ ] Multi-language support (EN/FR/AL)
- [ ] Photo upload for profiles
- [ ] Admin notes for clients
- [ ] Barber ranking leaderboard
- [ ] Export reports to PDF
- [ ] Calendar view for appointments
- [ ] Recurring appointments

## 📝 License

Private project for ENNO COIFFEUR - Geneva, Switzerland

## 🤝 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for ENNO COIFFEUR**
# ennocoiffeur
# ennocoiffeur
# ennocoiffeur
