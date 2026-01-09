<div align="center">
  <br />
    <a href="https://studywell-fury.vercel.app" target="_blank">
      <img src="https://img.icons8.com/fluency/96/student-center.png" alt="StudyWell Logo" width="100"/>
    </a>
  <br />

  <h1>StudyWell</h1>

  <h3><strong>The Ultimate Aesthetic Study Ecosystem</strong></h3>

  <p>
    A gamified, intelligent productivity suite designed to turn academic chaos into structured success.
  </p>

  <p align="center">
    <a href="https://studywell-fury.vercel.app"><strong>View Live Demo »</strong></a>
    <br />
    <br />
    <a href="https://github.com/SilentFURY-x/StudyWell/issues">Report Bug</a>
    ·
    <a href="https://github.com/SilentFURY-x/StudyWell/pulls">Request Feature</a>
  </p>
</div>

<div align="center">

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

</div>

<br />

## ⚡ Overview

**StudyWell** isn't just a to-do list; it's a **smart assistant** for your academic life. Built to solve the problem of disorganized study schedules, it combines powerful planning tools with modern gamification to keep users addicted to productivity.

Featuring a **drag-and-drop timeline**, **real-time focus timer**, and a **competitive leaderboard**, StudyWell wraps complex functionality in a beautiful, glassmorphic UI that feels right at home on any modern device.

---

## 📸 Screenshots

| **The Command Center** | **Smart Timeline** |
|:---:|:---:|
| <img src="docs/dashboard-light.png" alt="Dashboard" width="400"/> | <img src="docs/timeline-dark.png" alt="Timeline" width="400"/> |
| *Intuitive Dashboard with integrated Focus Timer* | *Drag & Drop scheduling with Real-time "Soul Sucker" Line* |

| **Gamified Leaderboard** | **Deep Analytics** |
|:---:|:---:|
| <img src="docs/leaderboard.png" alt="Leaderboard" width="400"/> | <img src="docs/analytics.png" alt="Analytics" width="400"/> |
| *Compete with friends for XP and glory* | *Visualize your weekly focus habits* |


---

## 🌟 Key Features

### 🧠 **Smart Productivity**
- **Drag & Drop Timeline:** Effortlessly plan your day by dragging subjects into hourly slots.
- **Smart Notifications:** The app knows your schedule. If it's 6 PM and you planned Physics, it will ping you to start focusing.
- **Integrated Focus Timer:** A seamless timer widget that adapts to your current subject's color theme.

### 🎮 **Gamification Engine**
- **XP System:** Earn Experience Points (XP) for every minute you focus.
- **Leaderboards:** Real-time ranking system to compete against yourself and others.
- **Streak Protection:** Daily login tracking with "Streak Celebration" animations to build habits.

### 🎨 **Premium UI/UX**
- **Glassmorphism:** Modern, frosted-glass aesthetics using `backdrop-filter`.
- **Dark Mode:** Fully responsive dark theme that automatically syncs with system preferences.
- **Liquid Animations:** Powered by **Framer Motion** for butter-smooth page transitions and layout shifts.
- **Pill Scrollbars:** Custom-styled scrollbars for a native app feel.

---

## 🛠️ Tech Stack

This project was built using the modern **T3-style** stack for maximum performance and scalability.

<div align="center">

| **Frontend** | **Backend & Services** | **Tools & UI** |
|:---:|:---:|:---:|
| ![React](https://img.shields.io/badge/React_18-20232a?style=for-the-badge&logo=react&logoColor=61DAFB) | ![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white) | ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) | ![Firestore](https://img.shields.io/badge/Cloud_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black) | ![Framer](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white) |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) | ![Auth](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black) | ![Shadcn](https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white) |

</div>

---

## 📂 Project Structure

A quick look at the top-level files and directories you'll see in this project.

```text
StudyWell/
├── src/
│   ├── components/      # Reusable UI components (Buttons, Cards, Dialogs)
│   ├── features/        # Feature-based modules (Dashboard, Timeline, Analytics)
│   ├── hooks/           # Custom React hooks (useAuth, useTimer, useTimeline)
│   ├── lib/             # Utilities and Firebase configuration
│   ├── store/           # Global State Management (Zustand stores)
│   ├── App.tsx          # Main application entry point
│   └── main.tsx         # DOM rendering
├── public/              # Static assets and icons
├── .env                 # Environment variables (Firebase keys)
└── tailwind.config.js   # Style configurations
```

## 🚀 Getting Started

Follow these steps to run StudyWell locally on your machine.

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/SilentFURY-x/StudyWell.git](https://github.com/SilentFURY-x/StudyWell.git)
   cd StudyWell
   ```
2. **Install dependencies**
   ```bash
   git clone [https://github.com/SilentFURY-x/StudyWell.git](https://github.com/SilentFURY-x/StudyWell.git)
   cd StudyWell
   ```
3. **Configure Environment Variables Create a .env file in the root directory and add your Firebase config:**
   ```bash
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. **Run the development server**
   ```bash
   npm run dev
   ```

   ---

## 🗺️ Roadmap & Future Features

* [x] Core: Auth, Subjects, Timeline

* [x] Engine: Focus Timer, Smart Notifications

* [x] Gamification: XP, Leaderboards, Streaks

* [ ] Phase 2: Study Groups & Multiplayer Pomodoro

* [ ] Phase 3: AI-generated Study Plans

---

## 👨‍💻 Author
<div align="center">

**Arjun Tyagi**

[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SilentFURY-x)
[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/arjun-tyagi-84b1b5328/)

</div>

---

<p align="center">
  <i>Built with ❤️ and a lot of caffeine..</i>
</p>
   