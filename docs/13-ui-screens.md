# UI Screens Documentation

This document defines every screen in the application.

Each screen includes:

- Purpose
- Components
- Actions
- Navigation
- Permissions

---

# 1. Splash Screen

Purpose

Display application logo while loading.

Components

- Logo
- App Name
- Loading Indicator

Navigate

Automatically checks authentication.

If logged in

→ Dashboard

Otherwise

→ Login

---

# 2. Welcome Screen

Purpose

Introduce the application.

Components

- App Logo
- Illustration
- Short Description
- Login Button
- Register Button
- Continue with Google

---

# 3. Login Screen

Purpose

Authenticate existing users.

Components

- Email
- Password
- Remember Me
- Login Button
- Google Login
- Forgot Password
- Register Link

---

# 4. Register Screen

Purpose

Create a new account.

Fields

- Full Name
- Email
- Password
- Confirm Password
- Mobile Number
- WhatsApp Number
- Country
- City

Buttons

- Register
- Google Signup

---

# 5. Forgot Password

Fields

- Email

Buttons

- Send Reset Link

---

# 6. Dashboard

Purpose

Main user home.

Cards

Current Committees

Upcoming Payments

Pending Payments

Completed Committees

Wallet Summary

Recent Activities

Quick Actions

Create Committee

Join Committee

View Payments

Notifications

Bottom Navigation

Home

Committees

Payments

Notifications

Profile

---

# 7. My Committees

Purpose

Display all committees.

Each Card Shows

Committee Image

Committee Name

Contribution Amount

Frequency

Member Count

Next Payment

Status

Buttons

Open

Share

More Menu

---

# 8. Committee Details

Purpose

Main committee screen.

Tabs

Overview

Members

Payments

Turns

Reports

Activity

Chat

Overview Shows

Committee Name

Rules

Admin

Members

Contribution

Current Turn

Next Turn

Completion Progress

---

# 9. Create Committee

Fields

Committee Name

Description

Committee Image

Contribution Amount

Contribution Frequency

Daily

Weekly

Monthly

Maximum Members

Minimum Members

Start Date

Payment Due Date

Currency

Committee Visibility

Private

Public

Invite Only

Late Fee

Grace Period

Rules

Buttons

Save

Cancel

---

# 10. Edit Committee

Same as Create Committee.

Only Admin can access.

---

# 11. Invite Members

Methods

Email

WhatsApp

Share Link

QR Code

Pending Invitations List

---

# 12. Members Screen

Display

Profile Picture

Name

Phone

WhatsApp

Turn Number

Payment Status

Member Status

Admin Badge

Actions

View

Remove

Transfer Ownership

---

# 13. Payment Screen

Purpose

Submit payment.

Fields

Amount

Payment Method

Screenshot Upload

Notes

Buttons

Submit

Cancel

---

# 14. Payment History

Table

Date

Amount

Status

Approved By

Screenshot

Notes

Filters

Paid

Pending

Rejected

Late

Search

Sort

---

# 15. Payout Schedule

Cards

Current Recipient

Next Recipient

Remaining Turns

Completed Turns

Timeline View

---

# 16. Reports

Charts

Collection Report

Payment Trend

Late Payments

Committee Progress

Export

PDF

Excel

CSV

---

# 17. Notifications

Sections

Unread

Read

Each Notification

Title

Description

Date

Action Button

---

# 18. Committee Chat

Features

Messages

Images

Documents

Announcements

Pinned Messages

Typing Indicator

Read Receipts

---

# 19. Activity Timeline

Chronological List

Examples

Ahmed Joined

Ali Paid

Admin Approved Payment

Rule Updated

Member Removed

Committee Archived

---

# 20. Search

Search

Committee

Member

Payment

Activity

Recent Searches

Suggestions

---

# 21. User Profile

Profile Picture

Full Name

Email

Phone

WhatsApp

Country

City

Bio

Buttons

Edit

Change Password

Logout

---

# 22. Settings

Theme

Light

Dark

System

Language

English

Urdu

Notifications

Email

Push

WhatsApp

Privacy

Delete Account

---

# 23. Super Admin Dashboard

Cards

Total Users

Total Committees

Total Active Members

Monthly Growth

Revenue

Recent Registrations

Analytics

Charts

---

# 24. User Management

Table

Name

Email

Phone

Status

Committees

Actions

View

Suspend

Delete

---

# 25. Committee Management

Display

All Committees

Members

Status

Reports

Actions

View

Archive

Delete

---

# 26. Support Tickets

Table

Ticket ID

User

Status

Priority

Assigned To

Actions

Open

Reply

Close

---

# 27. 404 Page

Illustration

Message

Go Home Button

---

# 28. Loading Screens

Skeleton Cards

Skeleton Tables

Skeleton Forms

Loading Spinner

---

# 29. Error Page

Illustration

Message

Retry Button

Go Home

---

# Mobile Navigation

Bottom Navigation

🏠 Home

👥 Committees

💰 Payments

🔔 Notifications

👤 Profile

---

# Desktop Navigation

Sidebar

Dashboard

Committees

Payments

Reports

Notifications

Settings

Profile

Admin Panel

---

# Common Components

These components should be reusable across the entire application.

Buttons

Cards

Badges

Dialogs

Drawer

Avatar

Breadcrumb

Search Bar

Filters

Pagination

Data Table

Charts

Calendar

Date Picker

Form Inputs

Toast Notifications

Loading Skeleton

Progress Bar

Tabs

Accordion

Dropdown

Context Menu

Confirmation Dialog

QR Code

Image Upload

File Upload

---

# Design Principles

Every screen should:

- Be mobile-first
- Work on desktop
- Use Shadcn UI components
- Use Tailwind CSS
- Support Dark Mode
- Be accessible
- Show loading states
- Show empty states
- Show error states
- Use smooth animations
- Have consistent spacing
- Use reusable components

---

# Future Screens

Wallet

Subscription

Referral Program

Loan Management

Investment Tracker

AI Insights

Financial Dashboard

Multi-Currency Settings

Audit Logs

System Settings

Organization Management