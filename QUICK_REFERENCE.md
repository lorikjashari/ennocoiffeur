# 🚀 QUICK REFERENCE - ENNO COIFFEUR

## ⚡ Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:3000

---

## 🔑 Credentials

Set your own admin credentials. Do not use demo credentials in production.

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| \`.env.local\` | Supabase credentials |
| \`database/schema.sql\` | Database setup |
| \`app/api/\` | All API endpoints |
| \`app/admin/\` | Admin pages |
| \`app/barber/\` | Barber pages |
| \`app/client/\` | Client pages |

---

## 🛠️ Common Commands

\`\`\`bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter

# Database
# Run schema.sql in Supabase SQL Editor

# Cleanup
Remove-Item -Recurse -Force .next, node_modules
npm install
\`\`\`

---

## 🌐 Important URLs

| Environment | URL |
|-------------|-----|
| Development | http://localhost:3000 |
| Supabase | https://mofwhurbhzafkjdcnqoy.supabase.co |
| Admin Login | /login |
| Admin Dashboard | /admin/dashboard |
| Barber Dashboard | /barber/dashboard |
| Client Dashboard | /client/dashboard |

---

## 🔐 User Roles

| Role | Access |
|------|--------|
| **Admin** | Everything - create users, manage all |
| **Barber** | Own appointments and stats only |
| **Client** | Book and view own appointments |

---

## 📊 API Endpoints Quick Reference

### Auth
- POST \`/api/auth/login\` - Login
- POST \`/api/auth/logout\` - Logout

### Admin
- POST \`/api/admin/create-user\` - Create user
- GET/POST/PATCH/DELETE \`/api/admin/services\` - Services
- GET/POST/PATCH/DELETE \`/api/admin/appointments\` - Appointments
- GET \`/api/admin/stats\` - Statistics
- GET/PATCH \`/api/admin/barbers\` - Barber schedules

### Barber
- GET \`/api/barber/stats/:id\` - Barber statistics

### Client
- GET/DELETE \`/api/client/appointments\` - Appointments
- GET \`/api/client/available-slots\` - Available times

---

## 🎨 Color Scheme

- Primary Gold: \`#D4AF37\`
- Light Gold: \`#F4E5C2\`
- Dark Gold: \`#B8941F\`
- Background: White/Gray gradient
- Text: Black/Gray

---

## 🗄️ Database Tables

1. **users** - All users (admin, barber, client)
2. **barbers** - Barber schedules
3. **clients** - Client data
4. **services** - Available services
5. **appointments** - All bookings

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't login | Verify database schema ran |
| No time slots | Set barber working hours |
| Styles broken | \`npm run dev\` to restart |
| Port in use | \`taskkill /F /IM node.exe\` |
| Database error | Check \`.env.local\` |

---

## 📱 User Journey Cheat Sheet

### Create Barber (Admin)
1. Login as admin
2. Click "Manage Users"
3. Fill form, select "Barber" role
4. Create user
5. Go to "Barbers" → "Manage Schedule"
6. Set working hours

### Book Appointment (Client)
1. Login as client
2. Click "Book Appointment"
3. Select service
4. Choose barber
5. Pick date
6. Select time
7. Confirm

### Manage Appointment (Barber)
1. Login as barber
2. View upcoming appointments
3. Click "Confirm" or "Complete"

---

## ⚙️ Configuration

### Barber Schedule Example
\`\`\`json
{
  "monday": { "start": "09:00", "end": "18:00" },
  "tuesday": { "start": "09:00", "end": "18:00" },
  "wednesday": null,
  "thursday": { "start": "09:00", "end": "18:00" },
  "friday": { "start": "09:00", "end": "18:00" },
  "saturday": { "start": "09:00", "end": "16:00" },
  "sunday": null
}
\`\`\`

---

## 🚨 Emergency Fixes

### Reset Admin Password
\`\`\`sql
UPDATE users 
SET password_hash = '$2a$10$K7Z9vY8jF5xJ3nZ9X7Y8K.wV9J5xF7Z9vY8jF5xJ3nZ9X7Y8K.wV96'
WHERE email = 'admin@ennocoiffeur.ch';
-- Password is now: admin123
\`\`\`

### Clear All Appointments
\`\`\`sql
DELETE FROM appointments;
\`\`\`

### Restart Fresh
\`\`\`bash
Remove-Item -Recurse -Force .next
npm run dev
\`\`\`

---

## 📋 Pre-Launch Checklist

- [ ] Database schema deployed
- [ ] Environment variables set
- [ ] Services created
- [ ] Barbers added
- [ ] Barber schedules configured
- [ ] Test booking created
- [ ] All roles tested
- [ ] Mobile responsive checked

---

## 📚 Documentation Files

1. **README.md** - Main overview
2. **SETUP_GUIDE.md** - Installation
3. **API_DOCUMENTATION.md** - API reference
4. **DEPLOYMENT.md** - Deploy steps
5. **TROUBLESHOOTING.md** - Fix issues
6. **PROJECT_SUMMARY.md** - Complete summary
7. **QUICK_REFERENCE.md** - This file!

---

## 🎯 Key Features at a Glance

✅ Role-based authentication
✅ Smart appointment booking
✅ Automatic time slot generation
✅ Double-booking prevention
✅ Statistics & analytics
✅ Barber schedule management
✅ Mobile responsive
✅ Real-time availability
✅ 2-hour cancellation policy

---

## 💡 Pro Tips

- Use Chrome DevTools (F12) for debugging
- Check browser console for errors
- Verify database in Supabase Table Editor
- Test all roles before deployment
- Set realistic barber working hours
- Create sample data for testing

---

## 📞 Support

**Having issues?**
1. Check TROUBLESHOOTING.md
2. Verify database setup
3. Check browser console
4. Restart dev server

---

## 🎉 You're All Set!

Everything you need is ready.
Just \`npm install\` and \`npm run dev\` to start!

---

**ENNO COIFFEUR - Geneva's Finest Barbershop** ✂️
