# Design System

Version: 1.0

This document defines the visual identity of the Committee Management System.

Every page, component and feature must follow this design system.

Never create custom styles unless absolutely necessary.

Always use reusable components.

---

# Design Philosophy

The application should feel like a premium fintech product.

Inspired by

- Revolut
- Monzo
- Stripe Dashboard
- Google Pay
- EasyPaisa
- Linear
- Vercel Dashboard

The design should be

- Clean
- Minimal
- Modern
- Professional
- Fast
- Friendly
- Trustworthy

---

# Design Principles

Every screen should

Be simple.

Have one clear purpose.

Avoid clutter.

Keep plenty of white space.

Large touch targets.

Readable typography.

Consistent spacing.

Smooth animations.

Accessibility first.

---

# Color Palette

Primary

Emerald Green

Used for

- Primary Buttons
- Active States
- Success
- Progress

Secondary

Slate Gray

Used for

Secondary Buttons

Muted Text

Borders

Backgrounds

Status Colors

Success

Green

Warning

Orange

Danger

Red

Info

Blue

Neutral

Gray

---

# Light Theme

Background

White

Card

Very Light Gray

Primary Text

Almost Black

Secondary Text

Gray

Border

Light Gray

---

# Dark Theme

Background

Near Black

Card

Dark Gray

Primary Text

White

Secondary Text

Light Gray

Border

Medium Gray

---

# Border Radius

Buttons

Medium

Cards

Large

Dialogs

Large

Input Fields

Medium

Badges

Rounded

Avatars

Full Circle

---

# Shadows

Use soft shadows only.

No harsh shadows.

Cards

Small

Dialogs

Medium

Dropdown

Medium

Floating Buttons

Large

---

# Typography

Use one font family throughout the application.

Recommended

Geist

Fallback

Inter

Font Sizes

Display

Hero Titles

Page Title

Section Title

Card Title

Body

Small Text

Caption

Font Weight

Regular

Medium

Semibold

Bold

Avoid Extra Bold.

---

# Icons

Use Lucide React.

Icon Sizes

Small

Medium

Large

Use outlined icons.

Avoid filled icons.

---

# Buttons

Primary

Filled

Green

White Text

Secondary

Outlined

Neutral

Danger

Red

Success

Green

Ghost

Transparent

Icon Button

Square

Loading Button

Spinner

Disabled Button

Reduced Opacity

---

# Cards

Cards should contain

Title

Subtitle

Body

Actions

Cards should have

Rounded Corners

Padding

Soft Shadow

Hover Effect

---

# Inputs

Text Input

Email

Password

Phone

Textarea

Number

Search

Date Picker

Select

Checkbox

Radio

Switch

Every input should include

Label

Placeholder

Validation

Helper Text

Error Message

---

# Tables

Responsive

Sticky Header

Pagination

Sorting

Filtering

Search

Empty State

Loading State

Hover State

Selectable Rows

---

# Forms

Use

React Hook Form

Validation

Zod

Every form should have

Title

Description

Grouped Inputs

Validation

Submit Button

Cancel Button

Loading State

Success Message

Error Message

---

# Dialogs

Confirmation Dialog

Delete Dialog

Success Dialog

Warning Dialog

Image Preview

Always include

Close Button

Escape Key Support

Background Blur

---

# Navigation

Mobile

Bottom Navigation

Desktop

Sidebar

Tablet

Collapsible Sidebar

Current Page

Highlighted

---

# Bottom Navigation

Home

Committees

Payments

Notifications

Profile

Always visible on mobile.

---

# Sidebar

Dashboard

Committees

Members

Payments

Reports

Notifications

Profile

Settings

Admin

---

# App Header

Logo

Page Title

Search

Notification Icon

Profile Avatar

---

# Dashboard Cards

Cards include

Title

Value

Trend

Icon

Optional Chart

---

# Statistics

Use

Progress Bars

Mini Charts

Badges

Icons

Never use excessive charts.

---

# Empty States

Every page should include

Illustration

Helpful Message

Primary Action

Example

"No Committees Yet"

Button

Create Committee

---

# Loading States

Use Skeleton Components.

Avoid spinners whenever possible.

Only use spinners for

Buttons

Full Page Loading

Authentication

---

# Error States

Every error should include

Icon

Simple Explanation

Retry Button

Support Link

---

# Notifications

Toast

Top Right (Desktop)

Top Center (Mobile)

Success

Green

Warning

Orange

Error

Red

Info

Blue

---

# Badges

Active

Green

Pending

Yellow

Completed

Blue

Rejected

Red

Archived

Gray

---

# Avatars

Circle

Show initials if no image.

Support image upload.

---

# Image Upload

Drag and Drop

Browse Button

Preview

Remove Button

Crop Support

Compression

---

# File Upload

Allowed

Images

PDF

Excel

Maximum Size

Configurable

Show Upload Progress

---

# Search

Instant Search

Debounced

Highlight Results

Recent Searches

Suggestions

---

# Pagination

Desktop

Traditional Pagination

Mobile

Load More

Infinite Scroll where appropriate.

---

# Charts

Use Recharts.

Chart Types

Line

Bar

Area

Pie

Donut

Keep colors minimal.

---

# Animations

Use Framer Motion.

Animation Speed

Fast

Examples

Fade

Slide

Scale

Accordion

Page Transition

Keep animations subtle.

---

# Accessibility

Keyboard Navigation

Screen Reader Support

Focus States

High Contrast

Minimum Touch Target

44px

---

# Responsive Breakpoints

Mobile

Tablet

Laptop

Desktop

Wide Desktop

Mobile is the priority.

---

# Reusable Components

Button

Card

Avatar

Badge

Input

Textarea

Select

Checkbox

Radio

Switch

Modal

Dialog

Drawer

Dropdown

Table

Pagination

Search

Calendar

Chart

Tabs

Accordion

Alert

Toast

Breadcrumb

Skeleton

Tooltip

Progress

QRCode

ImageUploader

FileUploader

LoadingOverlay

EmptyState

ErrorState

ConfirmDialog

StatCard

PageHeader

SectionHeader

FilterBar

DataTable

---

# Naming Convention

Components

PascalCase

Example

CommitteeCard

Hooks

camelCase

Example

useCommittee

Types

PascalCase

Services

camelCase

Models

PascalCase

Constants

UPPER_CASE

---

# UI Consistency Rules

Never use different button styles on different pages.

Never change spacing randomly.

Never use different icon sizes for similar actions.

Never use inconsistent colors.

Always reuse components.

Never duplicate UI.

Everything should come from reusable components.

---

# Final Goal

The application should look like a professionally designed fintech product.

Every screen should feel like it belongs to the same application.

Users should immediately feel that the application is modern, trustworthy and easy to use.

Whenever a new feature is added, it must follow this design system exactly.