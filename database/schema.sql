-- ENNO COIFFEUR Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'barber', 'client')),
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Barbers table (extends users)
CREATE TABLE barbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  working_hours JSONB DEFAULT '{}',
  break_times JSONB DEFAULT '[]',
  blocked_days JSONB DEFAULT '[]'
);

-- Clients table (extends users)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  loyalty_points INTEGER DEFAULT 0
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'canceled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_barbers_user_id ON barbers(user_id);
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_appointments_barber_id ON appointments(barber_id);
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Create a view for appointments with full details
CREATE VIEW appointment_details AS
SELECT 
  a.id,
  a.date,
  a.start_time,
  a.end_time,
  a.status,
  a.notes,
  a.created_at,
  s.name as service_name,
  s.price as service_price,
  s.duration_minutes,
  bu.name as barber_name,
  bu.email as barber_email,
  bu.phone as barber_phone,
  cu.name as client_name,
  cu.email as client_email,
  cu.phone as client_phone,
  a.barber_id,
  a.client_id,
  a.service_id
FROM appointments a
JOIN services s ON a.service_id = s.id
JOIN barbers b ON a.barber_id = b.id
JOIN users bu ON b.user_id = bu.id
JOIN clients c ON a.client_id = c.id
JOIN users cu ON c.user_id = cu.id;

-- Removed demo admin seed for production

-- Insert sample services
INSERT INTO services (name, price, duration_minutes, description) VALUES
('Classic Haircut', 45.00, 30, 'Traditional men''s haircut with styling'),
('Beard Trim', 25.00, 15, 'Professional beard shaping and grooming'),
('Haircut + Beard', 65.00, 45, 'Complete haircut and beard service'),
('Deluxe Package', 95.00, 60, 'Haircut, beard, hot towel treatment, and head massage'),
('Kids Haircut', 30.00, 20, 'Haircut for children under 12'),
('Shave', 35.00, 25, 'Traditional hot towel shave');
