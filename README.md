# Revora 🔍

> A collaborative code review platform — submit code, get feedback from reviewers, and track review decisions.

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.x-brightgreen)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![Java](https://img.shields.io/badge/Java-21-orange)](https://openjdk.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8-blue)](https://www.mysql.com/)

Revora is a lightweight code review platform that lets developers submit code snippets
or files for peer review. Reviewers can approve, reject, or request changes, and
comments allow discussion around each submission. Built with a Spring Boot backend
and a Next.js frontend, with JWT-based authentication and role-based access control.

---

## ✨ Features

### Authentication & Users
- **Email + password sign-up** with validation
- **JWT-based authentication** (stateless, 24-hour expiry)
- **Role-based access control** — `ADMIN`, `REVIEWER`, `USER`
- **Profile management** — update name, change password, view public profile
- **Public user profiles** — see any user's submissions and reviews

### Code Submissions
- **Submit code snippets** with title, description, and language tag
- **Status tracking** — `PENDING`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`
- **Ownership rules** — users can edit/delete their own submissions
- **Browse submissions** — public listing with filters
- **View single submission** — full details + all comments + reviews

### Reviews
- **Submit a review** — approve, reject, or request changes
- **One review per reviewer per submission**
- **Edit or withdraw** a review
- **Review status** determines submission status

### Comments
- **Comment on any submission** — threaded discussion
- **Edit / delete** your own comments
- **No reviews required** — any authenticated user can comment

### Dashboard
- **Personal dashboard** — see your submissions, pending reviews, stats
- **Quick actions** — jump into new submission, pending reviews, etc.

---

## 🏗️ Tech Stack

### Backend

| Tech | Purpose |
|---|---|
| **Java 21** | Language |
| **Spring Boot 4.x** | Application framework |
| **Spring Security** | Auth + JWT filter chain |
| **Spring Data JPA** | ORM / repositories |
| **Hibernate** | JPA implementation |
| **MySQL 8** | Database |
| **JJWT** | JWT generation & validation |
| **Lombok** | Boilerplate reduction |
| **Maven** | Build tool |

### Frontend

| Tech | Purpose |
|---|---|
| **Next.js 14+** | React framework (App Router) |
| **React 18** | UI library |
| **CSS / Tailwind** | Styling |
| **Axios** | HTTP client |

---

## 📁 Project Structure

Revora/
├── .github/ GitHub automation hooks
│
├── backend/ Spring Boot REST API
│ ├── pom.xml
│ ├── mvnw / mvnw.cmd Maven wrapper
│ ├── .env.example.md Secrets template
│ └── src/main/
│ ├── java/com/Revora/
│ │ ├── RevoraApplication.java Entry point
│ │ ├── config/ Security + role seeder
│ │ ├── controller/ REST endpoints
│ │ ├── service/ Business logic
│ │ ├── repository/ Spring Data JPA
│ │ ├── model/ JPA entities
│ │ ├── dto/ Request/Response DTOs
│ │ ├── security/ JWT filter + util
│ │ └── exception/ Custom exceptions + handler
│ └── resources/
│ ├── application.properties No secrets (committed)
│ └── application-local.properties Secrets (gitignored)
│
└── frontend/ Next.js app (App Router)
├── package.json
├── next.config.mjs
├── .env.example
└── src/
├── app/ Pages (App Router)
│ ├── page.js Landing
│ ├── login/ signup/ Auth pages
│ ├── dashboard/ Personal dashboard
│ ├── profile/ Profile edit
│ ├── submissions/ Browse + create + detail
│ └── users/ User list + public profiles
├── components/ Navbar, Footer, Select
└── lib/ api.js, avatar.js