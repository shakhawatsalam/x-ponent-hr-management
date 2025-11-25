
# 📄 HR Management Application — Submission README

==============================================

## 🚀 Live Deployment

#### 🔗 Live URL:  https://x-ponent-hr-management.vercel.app/


## 📦 GitHub Repository

#### 🔗 URL:  https://github.com/shakhawatsalam/x-ponent-hr-management
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL=`

`JWT_SECRET=`


## 👥 Login Credentials

🔸 HR Account

Email: john@example.com

Password: password1234

🔸 Manager Account

Email: shawon@gmail.com

Password: password1234



# File Tree: x-ponent-hr-management
```
├── prisma
│   ├── migrations
│   │   ├── 20251123103458_init
│   │   │   └── migration.sql
│   │   ├── 20251124041734
│   │   │   └── migration.sql
│   │   ├── 20251125055000_add_employee_role
│   │   │   └── migration.sql
│   │   ├── 20251125082248_make_performance_rating_optional
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── app
│   │   ├── (auth)
│   │   │   ├── create-account
│   │   │   │   └── page.tsx
│   │   │   └── login
│   │   │       └── page.tsx
│   │   ├── (common)
│   │   │   └── unauthorized
│   │   │       └── page.tsx
│   │   ├── (dashoboard)
│   │   │   ├── attendance
│   │   │   │   └── page.tsx
│   │   │   ├── payroll
│   │   │   │   └── page.tsx
│   │   │   ├── performance
│   │   │   │   └── page.tsx
│   │   │   ├── users
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api
│   │   │   ├── attendance
│   │   │   │   ├── [id]
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── employees
│   │   │   │   └── route.ts
│   │   │   ├── login
│   │   │   │   └── route.ts
│   │   │   ├── logout
│   │   │   │   └── route.ts
│   │   │   ├── me
│   │   │   │   └── route.ts
│   │   │   ├── payroll
│   │   │   │   ├── attendance-days
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── performance
│   │   │   │   ├── [id]
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── register
│   │   │   │   └── route.ts
│   │   │   └── users
│   │   │       ├── [id]
│   │   │       │   └── route.ts
│   │   │       └── route.ts
│   │   ├── context
│   │   │   └── auth-provider.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── Dialogs
│   │   │   ├── AttendanceDialogs.tsx
│   │   │   ├── CreatePayrollDialog.tsx
│   │   │   ├── PerformanceDialogs.tsx
│   │   │   └── UserDialogs.tsx
│   │   ├── Forms
│   │   │   ├── AttendanceForm.tsx
│   │   │   ├── PayrollCalculation.tsx
│   │   │   ├── PayrollForm.tsx
│   │   │   ├── PerformanceForm.tsx
│   │   │   └── UserForm.tsx
│   │   ├── Tables
│   │   │   ├── AttendanceTable.tsx
│   │   │   ├── PayrollTable.tsx
│   │   │   ├── PerformanceTable.tsx
│   │   │   └── UsersTable.tsx
│   │   ├── auth
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── field.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── table.tsx
│   │   │   └── tooltip.tsx
│   │   ├── Loading.tsx
│   │   ├── Toast.tsx
│   │   ├── app-header.tsx
│   │   └── app-sidebar.tsx
│   ├── generated
│   ├── hooks
│   │   ├── use-mobile.ts
│   │   ├── useAttendance.ts
│   │   ├── usePayroll.ts
│   │   ├── usePerformance.ts
│   │   └── useUsers.ts
│   ├── lib
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   ├── types
│   │   └── types.ts
│   └── proxy.ts
├── .gitignore
├── README.md
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── prisma.config.ts
├── tsconfig.json
└── vercel.json
```
