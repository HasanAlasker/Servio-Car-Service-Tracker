
<p align="center">
  <img src="https://img.shields.io/badge/Servio-Smart%20Maintenance-007BFF?style=for-the-badge&logo=car&logoColor=white" alt="Servio" />
</p>

<h1 align="center">Servio — Car Maintenance Tracker.</h1>

<p align="center">
  Track your vehicle, never miss a service, and connect with trusted mechanics — all in one place.
</p>

<p align="center">
  <a href="https://servio-maintenance.netlify.app/">
    <img src="https://img.shields.io/badge/Website-007BFF?style=for-the-badge" />
  </a>
  <img src="https://img.shields.io/badge/Status-Production-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Platform-Android%20|%20IOS%20|%20Web-3DDC84?style=for-the-badge&logo=os&logoColor=white" />
  <img src="https://img.shields.io/badge/Built%20With-React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
</p>
<p align="center">
  <img src="./Client/Servio/assets/preview1.png" alt="Servio App Preview" width="800" />
</p>

---

## Overview

Servio is a mobile platform that puts car owners back in control of their vehicle maintenance. Instead of guessing when your car needs service or relying on memory, Servio automatically tracks, calculates, and reminds you — then lets you book a trusted nearby mechanic in seconds.

**The problem Servio solves:**

| Pain Point | Servio's Solution |
|---|---|
| Forgetting maintenance schedules | Smart algorithm tracks time + mileage automatically |
| No history of parts or services | Full per-vehicle maintenance history |
| Not knowing which mechanic to trust | Review-based service marketplace |

---

## Features

### 🚘 Multi-Vehicle Management
Add and manage multiple vehicles, each with its own complete service history — mileage, parts replaced, and upcoming maintenance.

### 🔧 Smart Maintenance Algorithm
Servio doesn't just remind you — it calculates. The algorithm combines **time elapsed** and **mileage driven** to determine the earliest due maintenance condition, runs nightly via cron job, and automatically recalculates everything after a service is logged with a single tap. No re-entry required.

### 🔔 Intelligent Reminders
- **Push notifications** via Firebase Cloud Messaging (FCM) for upcoming or overdue services
- **Mileage-based reminders** synced to your device's OS calendar
- Always stay ahead of your maintenance schedule

### 🏪 Service Marketplace
- Discover nearby service centers using device location
- Open turn-by-turn directions instantly in Google Maps
- Review-based trust system to evaluate mechanics before you book

> ⚠️ The marketplace is live and growing. No partner shops yet — users are encouraged to invite their trusted mechanic to join the platform.

### 📅 Booking System
Request appointments directly through the app. Shops can accept or decline, users can cancel while pending, and completed services can be reviewed — creating a transparent feedback loop.

### ⭐ Reviews & Reputation
Every completed service can be reviewed. Ratings are public and tied to the shop's profile, building trust across the platform over time.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Mobile Frontend** | React Native + Expo |
| **Backend** | Node.js + Express |
| **Database** | MongoDB |
| **Notifications** | Firebase Cloud Messaging (FCM) + OS Calendar |
| **Validation** | Joi (backend) · Formik + Yup (frontend) |
| **Design** | Figma |

---

## Security

Servio is built with a production-grade security mindset from day one:

- **JWT Authentication** — stateless, token-based auth
- **Password Hashing** — bcrypt with salt rounds
- **Environment Protection** — secrets managed via `.env`, never committed
- **Input Validation** — Joi on all API routes, Yup/Formik on all client forms
- **Rate Limiting** — protection against brute-force and abuse
- **Request Logging & Monitoring** — full request audit trail

---

## Project Scale

- **60+** REST API endpoints
- **27** application screens
- **3-tier** architecture (client → API → database)
- Frontend-focused performance optimization throughout

---

## How It Works

```
1. Add your vehicle
        ↓
2. Log parts & last service date
        ↓
3. Servio calculates next maintenance (time + mileage logic)
        ↓
4. Get notified before it's due
        ↓
5. Book a nearby mechanic
        ↓
6. Confirm service → Servio recalculates everything automatically
```

---

## Current Status

| Area | Status |
|---|---|
| Core maintenance system | ✅ Complete |
| Push notifications | ✅ Live |
| Smart algorithm | ✅ Live |
| Booking system | ✅ Complete |
| Review system | ✅ Complete |
| Google Play (closed testing) | ✅ Complete |
| Service marketplace — partner shops | 🚧 Awaiting onboarding |

---

## Vision

Servio is built to grow beyond a personal tracking app into:

- A **trusted maintenance platform** used by every car owner
- A **marketplace for service centers** to find and retain customers
- An **industry standard** for vehicle lifecycle management

---

## Download Now!

Want to try Servio?

👉 **[Google Play](https://play.google.com/store/apps/details?id=com.hasan_alasker.Servio)**
👉 **[IOS / Browser](https://servio.expo.app)**

You can also help the platform grow by inviting your mechanic or local service center to join. 🔧

---

## Author

**Hasan Alasker** — Full-Stack Mobile Developer & UI/UX Designer

[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=flat-square&logo=google&logoColor=white)](https://alasker.dev/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/hasan-alasker-58682335a/)
[![Email](https://img.shields.io/badge/Email-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:hasanalasker.contact@gmail.com)

---

## License

Private project. All rights reserved © Hasan Alasker.
