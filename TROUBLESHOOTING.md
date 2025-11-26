# Troubleshooting Guide - ENNO COIFFEUR

## Common Issues and Solutions

### 🔴 Installation Issues

#### Problem: `npm install` fails
**Symptoms:**
- Errors during package installation
- Missing dependencies
- Version conflicts

**Solutions:**
1. Check Node.js version (must be 18+)
   \`\`\`bash
   node --version
   \`\`\`

2. Clear npm cache
   \`\`\`bash
   npm cache clean --force
   \`\`\`

3. Delete and reinstall
   \`\`\`bash
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install
   \`\`\`

4. Try with legacy peer deps
   \`\`\`bash
   npm install --legacy-peer-deps
   \`\`\`

---

### 🔴 Database Issues

#### Problem: "Failed to fetch" errors
**Symptoms:**
- API calls return 500 errors
- Data doesn't load
- Login fails

**Solutions:**
1. Verify Supabase is running
   - Check https://mofwhurbhzafkjdcnqoy.supabase.co
   - Should show Supabase project page

2. Check environment variables
   - Verify \`.env.local\` exists
   - Confirm URL and key are correct
   - Restart dev server after changes

3. Verify database schema
   - Go to Supabase SQL Editor
   - Run: \`SELECT * FROM users;\`
   - Should return at least the admin user

#### Problem: Tables don't exist
**Symptoms:**
- Error: "relation does not exist"
- Missing data

**Solutions:**
1. Run the schema file again
   - Open \`database/schema.sql\`
   - Copy all content
   - Paste in Supabase SQL Editor
   - Execute

2. Check table creation
   - Go to Table Editor in Supabase
   - Verify all tables exist:
     - users
     - barbers
     - clients
     - services
     - appointments

---

### 🔴 Authentication Issues

#### Problem: Can't login as admin
**Symptoms:**
- "Invalid email or password" error
- Login always fails

**Solutions:**
1. Verify admin user exists
   ```sql
   SELECT * FROM users WHERE role = 'admin';
   ```

2. Reset an admin password (example)
   ```sql
   UPDATE users 
   SET password_hash = '<bcrypt-hash-here>'
   WHERE id = '<admin-user-id>';
   ```
   Use a strong password and generate a fresh bcrypt hash.

3. Check bcrypt hashing
   - Open browser console (F12)
   - Look for bcrypt errors
   - Verify bcryptjs is installed

#### Problem: Redirect loops after login
**Symptoms:**
- Page keeps redirecting
- Can't access dashboard

**Solutions:**
1. Clear browser data
   - Clear localStorage
   - Clear cookies
   - Hard refresh (Ctrl+Shift+R)

2. Check role in database
   \`\`\`sql
   SELECT email, role FROM users;
   \`\`\`

3. Verify user object in localStorage
   - Open browser console
   - Run: \`localStorage.getItem('user')\`
   - Should have valid JSON with role

---

### 🔴 Booking Issues

#### Problem: "No available slots" when booking
**Symptoms:**
- All time slot fields empty
- Can't select any time

**Solutions:**
1. Check barber schedule
   - Login as admin
   - Go to Barbers → Manage Schedule
   - Verify working hours are set for selected day

2. Verify the day isn't blocked
   \`\`\`sql
   SELECT blocked_days FROM barbers WHERE id = 'barber-uuid';
   \`\`\`

3. Check for existing appointments
   \`\`\`sql
   SELECT * FROM appointments 
   WHERE barber_id = 'barber-uuid' 
   AND date = '2024-01-15';
   \`\`\`

4. Verify service duration is reasonable
   - Should be 15, 30, 45, or 60 minutes
   - Check in services table

#### Problem: "Time slot already booked" error
**Symptoms:**
- Booking fails with conflict error
- Time appears available but can't book

**Solutions:**
1. Check for overlapping appointments
   \`\`\`sql
   SELECT * FROM appointments 
   WHERE barber_id = 'barber-uuid' 
   AND date = 'selected-date'
   AND status != 'canceled';
   \`\`\`

2. Refresh the available slots
   - Go back and select date again
   - Slots should update

3. Check timezone settings
   - Times should be in same timezone
   - Check server and database timezone

---

### 🔴 Display Issues

#### Problem: Styles not loading
**Symptoms:**
- Plain HTML with no styling
- Components look broken

**Solutions:**
1. Verify Tailwind is running
   - Check \`tailwind.config.ts\` exists
   - Verify \`globals.css\` imports Tailwind

2. Restart dev server
   \`\`\`bash
   # Press Ctrl+C to stop
   npm run dev
   \`\`\`

3. Clear Next.js cache
   \`\`\`bash
   Remove-Item -Recurse -Force .next
   npm run dev
   \`\`\`

#### Problem: Components not rendering
**Symptoms:**
- Blank pages
- Missing UI elements

**Solutions:**
1. Check browser console for errors
   - Press F12
   - Look at Console tab
   - Fix any JavaScript errors

2. Verify component imports
   - Check file paths
   - Ensure components exist

3. Check for TypeScript errors
   - Look at terminal running dev server
   - Fix any type errors

---

### 🔴 Data Issues

#### Problem: Statistics showing 0 or NaN
**Symptoms:**
- Dashboard shows no data
- Charts are empty

**Solutions:**
1. Create test data
   - Book some appointments
   - Complete them
   - Check stats again

2. Verify date calculations
   - Check period filter (day/week/month)
   - Ensure dates are in correct format

3. Check SQL queries
   - Look at network tab in browser
   - Verify API responses

#### Problem: Appointments not showing
**Symptoms:**
- Lists are empty
- Data exists in database

**Solutions:**
1. Check user ID mapping
   \`\`\`sql
   -- For barbers
   SELECT b.id, u.id as user_id, u.name 
   FROM barbers b 
   JOIN users u ON b.user_id = u.id;
   
   -- For clients
   SELECT c.id, u.id as user_id, u.name 
   FROM clients c 
   JOIN users u ON c.user_id = u.id;
   \`\`\`

2. Verify foreign key relationships
   - Check barber_id, client_id, service_id exist
   - Ensure they reference valid records

3. Check status filter
   - Appointment might be filtered out
   - Try changing status filter

---

### 🔴 Performance Issues

#### Problem: Slow page loads
**Symptoms:**
- Pages take long to load
- API calls are slow

**Solutions:**
1. Check database indexes
   - Verify indexes exist (see schema.sql)
   - Add indexes for frequently queried columns

2. Optimize queries
   - Use \`.select()\` to limit columns
   - Add pagination for large lists

3. Check network tab
   - Press F12 → Network
   - Look for slow requests
   - Optimize heavy queries

---

### 🔴 Development Server Issues

#### Problem: Port already in use
**Symptoms:**
- Can't start dev server
- "Port 3000 is already in use"

**Solutions:**
1. Kill the process
   \`\`\`bash
   # Find process on port 3000
   netstat -ano | findstr :3000
   
   # Kill the process (replace PID)
   taskkill /PID <PID> /F
   \`\`\`

2. Use different port
   \`\`\`bash
   npm run dev -- -p 3001
   \`\`\`

#### Problem: Changes not reflecting
**Symptoms:**
- Code changes don't appear
- Still seeing old version

**Solutions:**
1. Hard refresh browser
   - Ctrl+Shift+R (Windows)
   - Clear cache

2. Restart dev server
   - Stop with Ctrl+C
   - Start again with \`npm run dev\`

3. Check file is saved
   - Verify file was actually saved
   - Check no syntax errors

---

## 🔍 Debugging Tips

### Enable Verbose Logging

Add to your API routes:
\`\`\`typescript
console.log('Request:', request)
console.log('Data:', data)
console.log('Error:', error)
\`\`\`

### Check Browser Console

Always check browser console (F12) for:
- JavaScript errors
- Network requests
- API responses

### Check Server Logs

Terminal running \`npm run dev\` shows:
- API route errors
- Build errors
- Runtime errors

### Use Network Tab

Browser DevTools → Network:
- See all API calls
- Check request/response
- View timing

### Database Queries

Test queries directly in Supabase:
- Go to SQL Editor
- Run queries
- Verify data

---

## 🆘 Still Having Issues?

### Collect Debug Information

1. **Browser Console Output**
   - F12 → Console
   - Copy errors

2. **Server Output**
   - Terminal logs
   - Error stack traces

3. **Database State**
   \`\`\`sql
   SELECT COUNT(*) as user_count FROM users;
   SELECT COUNT(*) as barber_count FROM barbers;
   SELECT COUNT(*) as client_count FROM clients;
   SELECT COUNT(*) as service_count FROM services;
   SELECT COUNT(*) as appointment_count FROM appointments;
   \`\`\`

4. **Environment Check**
   - Node version: \`node --version\`
   - npm version: \`npm --version\`
   - OS: Windows version

5. **Network Requests**
   - F12 → Network
   - Screenshot of failed requests

### Clean Install

As last resort:
\`\`\`bash
# Backup your .env.local
Copy-Item .env.local .env.backup

# Clean everything
Remove-Item -Recurse -Force node_modules, .next, package-lock.json

# Reinstall
npm install

# Restore environment
Copy-Item .env.backup .env.local

# Start fresh
npm run dev
\`\`\`

---

## 📞 Support Checklist

Before asking for help:
- [ ] Checked browser console
- [ ] Checked server logs
- [ ] Verified database is running
- [ ] Tried restarting dev server
- [ ] Cleared cache and cookies
- [ ] Checked this troubleshooting guide
- [ ] Collected debug information

---

**Last Updated**: November 2024
