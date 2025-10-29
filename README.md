# 🏈 SnapStat

[![Made with React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://reactjs.org/)
[![Backend-Express](https://img.shields.io/badge/Backend-Express.js-green?logo=express)](https://expressjs.com/)
[![Database-PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)](https://www.postgresql.org/)
[![Cache-Redis](https://img.shields.io/badge/Cache-Redis-red?logo=redis)](https://redis.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Built with Node.js](https://img.shields.io/badge/Node.js-Enabled-success?logo=node.js)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)](https://github.com/KalnBrs/SnapStat)

---

**SnapStat** is a modern web application for tracking, managing, and comparing team and player-specific football stats — built for coaches, broadcasters, and sports analysts who want real-time, organized insights without relying on messy spreadsheets or paper stat sheets.

---

## 🚀 Overview

SnapStat provides an intuitive, data-driven dashboard for recording and viewing detailed game, team, and player statistics.  
What started as a simple way to track game stats for my high school’s media team has evolved into a full-stack platform capable of handling multi-game data, dynamic updates, and team-based management.

With **React**, **Node.js**, and **PostgreSQL** at its core, SnapStat bridges front-end usability with a powerful back-end architecture designed to scale for multi-user access and advanced stat analytics.

---

## ⚙️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | [![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white)](https://reactjs.org/) [![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![Redux](https://img.shields.io/badge/-Redux-764ABC?logo=redux&logoColor=white)](https://redux.js.org/) |
| **Backend** | [![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/) [![Express.js](https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/) |
| **Database & Caching** | [![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![Redis](https://img.shields.io/badge/-Redis-DC382D?logo=redis&logoColor=white)](https://redis.io/) |
| **Deployment (Planned)** | [![AWS](https://img.shields.io/badge/-AWS-FF9900?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/) |


---

## 🧩 Database Overview

The database is built on a **PostgreSQL** schema structured to manage all aspects of a football game:

- `users` – Stores user credentials and permissions  
- `teams` – Team details and ownership  
- `players` – Player rosters linked to teams  
- `games` – Game metadata and scheduling  
- `plays` – Individual plays recorded during games  
- `drives` – Offensive drives per game  
- `player_stats` – Aggregated player performance  
- `teamusers` – Many-to-many relationships between users and teams  
- `gameplayers` – Links players to specific games  

This structure enables seamless querying of stats for visualization, comparison, and live tracking.

---

## 🏗️ Features

- **Team Management:** Create, edit, and view football teams with player rosters.  
- **Game Control:** Create and manage games, log plays, and track drives.  
- **Stat Tracking:** Capture and analyze detailed player and team performance.  
- **Visualization:** Compare stats across games and teams in a clean, responsive UI.  
- **Persistent Storage:** All data is securely stored in PostgreSQL with caching from Redis.  

---

## 🧠 Future Improvements (v2.0 Vision)

> “Turning a stat tracker into a strategy platform.”

- Full **multi-user system** for sharing games, teams, and players  
- **Customizable profiles** for teams, players, and users  
- **Advanced analytics** with deeper data insights  
- **AI-powered predictions** for broadcasters and coaches:
  - Predict next plays  
  - Estimate win probabilities  
  - Suggest optimal decisions in real time  

---

## ⚡ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/KalnBrs/SnapStat.git
cd SnapStat
```

### 2. Install dependencies
Run in both /frontend and /backend directories:
```bash 
npm install
```

### 3. Set up the database
Create a PostgreSQL database and configure your .env files with:
```makefile 
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_DATABASE=
REDIS_URL=
```

### 4. Run the app
Start both servers separately (different ports):
```bash 
# backend
npm start

# frontend
npm run dev
```

---

## 🎥 Demo & Screenshots

A full walkthrough is available on [YouTube Demo (3 minutes)](https://youtu.be/GK9XLpeInAY).

---

## 🧑‍💻 Creator

**Developed by [Kaelan Brose](https://github.com/KalnBrs)**

Built for the Congressional App Challenge 2025, inspired by the need for accessible and professional-level stat tracking tools for high school sports.

--- 

## 📜 License

This project is open-source and available under the [MIT License](https://opensource.org/license/mit).