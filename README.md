DesaFix

A web-based hostel facilities complaint and feedback management system designed to streamline the reporting and resolution of facility issues in student hostels.

Overview:

DesaFix provides an efficient platform for students to report facility problems at any time, eliminating the need to visit service counters during limited hours. The system enables hostel management and maintenance staff to track, prioritize, and resolve complaints effectively.

Features:

Complaint Submission - Students can submit facility issues with descriptions, photos, and urgency levels
Status Tracking - Real-time tracking of complaint status (Pending, In Progress, Resolved)
Admin Dashboard - Management interface for staff to view, update, and manage complaints
User Authentication - Secure login system for students and administrators
Feedback System - Students can rate and provide feedback after issue resolution

Technology Stack:

Frontend: React/Next.js
Backend: Next.js API routes
Database: PostgreSQL with Supabase
Hosting: Vercel
Authentication: Supabase Auth

Installation:

bash# Clone the repository
git clone https://github.com/dharshaan020905/desafix.git

# Navigate to project directory
cd desafix

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
