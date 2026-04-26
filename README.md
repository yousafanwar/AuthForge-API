# AuthForge API

A **production-ready authentication API** built with NestJS, Prisma, and PostgreSQL featuring JWT based auth with refresh token rotation and Role Based Access Control (RBAC).

> Built as a reusable auth foundation that can be dropped into any backend project.

---

## Features

- **JWT Authentication** — Secure access tokens with short expiry
- **Refresh Token Rotation** — Rotating refresh tokens for persistent, secure sessions
- **Role-Based Access Control (RBAC)** — Guard routes by user role (admin, user, etc.)
- **Token Blacklisting** — Invalidate tokens on logout
- **Prisma ORM** — Type-safe database access with PostgreSQL
- **NestJS Architecture** — Modules, guards, decorators, and interceptors done right

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (jsonwebtoken)

---

### Endpoints

| Method | Route | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login & receive tokens | No |
| POST | `/auth/refresh` | Rotate refresh token | No |
| POST | `/auth/logout` | Invalidate refresh token | Yes |
| GET | `/users/me` | Get current user profile | Yes (any role) |
| GET | `/admin/users` | List all users | Yes (admin only) |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yousafanwar/AuthForge-API.git
cd AuthForge-API

# Install dependencies
npm install

# Set up environment variables

# Run Prisma migrations
npx prisma migrate dev

# Start in development mode
npm run start:dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/authforge"
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```
---

## Project Structure

```
AuthForge-API/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── auth/               # Login, register, token logic
│   ├── users/              # User module & RBAC guards
│   ├── common/             # Decorators, guards, interceptors
│   └── main.ts             # App entry point
├── test/                   # E2E test suites
└── .prettierrc             # Code formatting config
```

---

## RBAC Example

```typescript
// Protect a route to admin role only
@Get('users')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
findAll() {
  return this.usersService.findAll();
}
```

---

## Contact

Built by **Yousaf Anwar Ali** — Backend-focused Full Stack Developer

- GitHub: https://github.com/yousafanwar
- LinkedIn: https://www.linkedin.com/in/yousaf-anwar-ali-341195301
- Email: yousafanwar7777@gmail.com
