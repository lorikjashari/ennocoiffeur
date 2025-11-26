# 🚀 Quick Start Guide - ENNO COIFFEUR

## Step-by-Step Setup

### 1️⃣ Install Dependencies

Open PowerShell in the project directory and run:

\`\`\`powershell
npm install
\`\`\`

This will install all required packages including:
- Next.js framework
- React and React DOM
- Supabase client
- UI components (shadcn/ui)
- Tailwind CSS
- TypeScript dependencies

### 2️⃣ Set Up Database

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Navigate to your project: https://mofwhurbhzafkjdcnqoy.supabase.co

2. **Run Database Schema**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"
   - Open the file \`database/schema.sql\` from this project
   - Copy ALL the SQL code
   - Paste it into the Supabase SQL Editor
   - Click "Run" or press Ctrl+Enter

3. **Verify Database Setup**
   - Go to "Table Editor" in Supabase
   - You should see these tables:
     - users
     - barbers
     - clients
     - services
     - appointments
   - Check that sample services were created

### 3️⃣ Verify Environment Variables

The \`.env.local\` file should already be configured. Verify it contains:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://mofwhurbhzafkjdcnqoy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

### 4️⃣ Start Development Server

\`\`\`powershell
npm run dev
\`\`\`

The application will start at: **http://localhost:3000**

### 5️⃣ First Login

1. Open your browser to http://localhost:3000
2. You'll be redirected to the login page
3. Sign in with your admin account (create one in your DB or via the app)

### 6️⃣ Create Test Users

After logging in as admin:

1. **Create a Barber**
   - Click "Manage Users"
   - Fill in the form:
     - Name: John Barber
     - Email: john@ennocoiffeur.ch
     - Password: barber123
     - Role: Barber
   - Click "Create User"

2. **Create a Client**
   - Click "Manage Users" again
   - Fill in the form:
     - Name: Test Client
     - Email: client@test.com
     - Password: client123
     - Role: Client
   - Click "Create User"

3. **Test Different Roles**
   - Log out
   - Log in as the barber (john@ennocoiffeur.ch / barber123)
   - Explore the barber dashboard
   - Log out and log in as the client
   - Try booking an appointment

## 🔍 Testing the Application

### Test Admin Features
- ✅ Create users (clients and barbers)
- ✅ Manage services (add, edit, delete)
- ✅ Configure barber schedules
- ✅ View all appointments
- ✅ View statistics and charts

### Test Barber Features
- ✅ View personal appointments
- ✅ Confirm pending appointments
- ✅ Mark appointments as completed
- ✅ View personal statistics

### Test Client Features
- ✅ Book a new appointment
- ✅ Select service, barber, date, and time
- ✅ View upcoming appointments
- ✅ Cancel an appointment
- ✅ View appointment history

## 🐛 Troubleshooting

### Database Connection Issues

If you get database errors:
1. Check that \`.env.local\` has the correct Supabase URL and key
2. Verify the database schema was run successfully
3. Check Supabase dashboard for any error messages

### "No Available Slots" When Booking

This could mean:
1. The barber's schedule isn't set (Admin → Barbers → Manage Schedule)
2. The selected date is a day off
3. All slots are booked
4. Check the barber's working hours in the database

### Login Issues

If you can't log in:
1. Make sure you ran the database schema (creates admin user)
2. Check the email and password are correct
3. Open browser console (F12) to see any error messages
4. Verify Supabase is running and accessible

### Build Errors

If \`npm install\` fails:
1. Make sure you have Node.js 18+ installed
2. Delete \`node_modules\` folder and \`package-lock.json\`
3. Run \`npm install\` again
4. If errors persist, try \`npm install --legacy-peer-deps\`

## 📊 Sample Data

The schema includes sample services:
- Classic Haircut - CHF 45.00 (30 min)
- Beard Trim - CHF 25.00 (15 min)
- Haircut + Beard - CHF 65.00 (45 min)
- Deluxe Package - CHF 95.00 (60 min)
- Kids Haircut - CHF 30.00 (20 min)
- Shave - CHF 35.00 (25 min)

## 🎯 Next Steps

1. **Customize Services**
   - Log in as admin
   - Go to Services
   - Add, edit, or remove services

2. **Set Up Barber Schedules**
   - Go to Barbers
   - Click "Manage Schedule" for each barber
   - Set working hours for each day

3. **Create Real Users**
   - Create actual barber accounts
   - Create client accounts
   - Update contact information

4. **Test Appointment Flow**
   - Log in as a client
   - Book several appointments
   - Log in as barber to confirm
   - Test cancellation policy

## 💡 Tips

- The first barber created won't have appointments until clients book
- Clients need to be created by admin first
- Time slots are generated in 15-minute increments
- Appointments can't be canceled within 2 hours of start time
- All times are in 24-hour format

## 🆘 Need Help?

If you encounter any issues:
1. Check the browser console (F12 → Console tab)
2. Check the terminal running \`npm run dev\` for errors
3. Verify database tables were created in Supabase
4. Make sure all environment variables are set

---

**Ready to go! 🎉**

Start the dev server with \`npm run dev\` and visit http://localhost:3000
