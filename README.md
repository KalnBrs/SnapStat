# 🏈 SnapStat

[![Made with React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://reactjs.org/)
[![Backend-Express](https://img.shields.io/badge/Backend-Express.js-green?logo=express)](https://expressjs.com/)
[![Database-PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)](https://www.postgresql.org/)
[![Cache-Redis](https://img.shields.io/badge/Cache-Redis-red?logo=redis)](https://redis.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Built with Node.js](https://img.shields.io/badge/Node.js-Enabled-success?logo=node.js)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)](https://github.com/KalnBrs/SnapStat)

---

**SnapStat** is a comprehensive real-time football statistics tracking platform designed for coaches, broadcasters, and sports analysts. Track every play, visualize game momentum, and manage complete team rosters — all without spreadsheets or paper stat sheets.

---

## 🚀 Overview

SnapStat delivers a professional-grade stats tracking experience through an intuitive web interface. Originally created to support high school media teams, it has evolved into a full-featured platform with:

- **Real-time play tracking** with visual field positioning
- **Comprehensive stat calculation** using intelligent rule-based logic
- **Live game momentum visualization** and analytics
- **Multi-user team management** with JWT authentication
- **Instant stat updates** via Redis caching
- **RESTful API** for extensibility

Built with **React 19**, **Redux Toolkit**, **Express.js**, and **PostgreSQL**, SnapStat combines modern frontend UX with robust backend architecture designed for reliability and scale.

---

## ⚙️ Tech Stack

| Layer                    | Technologies                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend**             | [![React](https://img.shields.io/badge/-React_19-61DAFB?logo=react&logoColor=white)](https://reactjs.org/) [![TailwindCSS](https://img.shields.io/badge/-TailwindCSS_4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![Redux_Toolkit](https://img.shields.io/badge/-Redux_Toolkit-764ABC?logo=redux&logoColor=white)](https://redux.js.org/) [![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/) |
| **Backend**              | [![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/) [![Express.js](https://img.shields.io/badge/-Express.js_5-000000?logo=express&logoColor=white)](https://expressjs.com/) [![JWT](https://img.shields.io/badge/-JWT-000000?logo=json-web-tokens&logoColor=white)](https://jwt.io/)                                                                                                                            |
| **Database & Caching**   | [![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![Redis](https://img.shields.io/badge/-Redis-DC382D?logo=redis&logoColor=white)](https://redis.io/)                                                                                                                                                                                                                                       |
| **Additional Libraries** | [![Recharts](https://img.shields.io/badge/-Recharts-22C1C3?logo=chart-dot-js&logoColor=white)](https://recharts.org/) [![Framer_Motion](https://img.shields.io/badge/-Framer_Motion-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/) [![React_Router](https://img.shields.io/badge/-React_Router-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)                                                                                |
| **Deployment**           | [![Vercel](https://img.shields.io/badge/-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)                                                                                                                                                                                                                                                                                                                                                                |

---

## 🧩 Database Schema

The application uses a **PostgreSQL** relational database with the following core tables:

- **`users`** – User accounts with authentication (UUID-based, bcrypt hashed passwords)
- **`teams`** – Team information including name, abbreviation, color scheme, and logo
- **`players`** – Player rosters with position, number, height, weight, and year
- **`games`** – Game state including score, timeouts, possession, down/distance, and ball position
- **`drives`** – Offensive drive tracking with start/end yards and results
- **`plays`** – Individual play records with down, distance, yards gained, play type, and result
- **`player_stats`** – Comprehensive player statistics (40+ stat categories)
- **`gameplayers`** – Many-to-many relationship linking players to specific games
- **`teamusers`** – Many-to-many relationship for team ownership and permissions

### Stat Categories Tracked

The system automatically calculates and tracks:

- **Passing**: Attempts, completions, yards, TDs, interceptions, sacks
- **Rushing**: Carries, yards, TDs
- **Receiving**: Receptions, targets, yards, TDs
- **Defense**: Tackles, sacks, interceptions, defensive TDs, fumble recoveries
- **Special Teams**: Punts, returns, field goals, extra points, blocks
- **Advanced**: Onside kicks, kickoff yards, return touchdowns, and more

---

## 🏗️ Key Features

### 🎮 Live Game Tracker

- **Interactive field visualization** – Drag-and-drop player positioning on a visual football field
- **Real-time scoreboard** – Live score updates, timeouts, possession indicator
- **Play-by-play recording** – Log every play with detailed metadata (down, distance, yard line)
- **Drive management** – Automatic drive creation and tracking
- **Multiple play types** – Pass, rush, kick, punt, field goal, defense, sack, and penalty support

### 📊 Advanced Statistics Dashboard

- **Player stat tables** – Sortable, filterable stats for all players in a game
- **Team comparisons** – Side-by-side team performance metrics
- **Momentum charts** – Visualize scoring momentum throughout the game using Recharts
- **Quick view dashboard** – At-a-glance game summary with key stats
- **Play summaries** – Searchable play-by-play feed with recent plays
- **Announcer notes** – AI-ready stat insights for broadcasters

### 👥 Team & Player Management

- **Team creation** – Add teams with custom colors, logos, and abbreviations
- **Roster management** – Upload rosters via CSV or add players individually
- **Player profiles** – Track position, number, year, height, and weight
- **Multi-team support** – Manage multiple teams from one account
- **Team editing** – Update team information and rosters anytime

### 🎯 Game Management

- **Game creation modal** – Quick setup with team selection and date/time
- **Game selection interface** – View all games with visual team notches
- **State persistence** – Resume games with all context preserved
- **Historical data** – Access complete game history and stats

### 🔐 User Authentication

- **JWT-based auth** – Secure token authentication with HTTP-only cookies
- **Role-based access** – Support for viewer, statkeeper, broadcaster, and admin roles
- **Auto-refresh tokens** – Seamless session management
- **Protected routes** – Frontend route protection with React Router

## 🔧 Technical Highlights

### Backend Architecture

- **Intelligent stat calculation engine** (`statRules.js`) – Automatically applies stat updates based on play type and result
- **Redis caching layer** – Reduces database load for frequently accessed data
- **RESTful API design** – Clean separation of concerns with organized route handlers
- **Multer file uploads** – CSV roster import functionality
- **Cookie-based authentication** – Secure JWT storage with bcrypt password hashing
- **CORS configuration** – Supports cross-origin requests for Vercel deployment

### Frontend Architecture

- **Redux Toolkit state management** – Centralized state for game, roster, teams, and user data
- **React Router v7** – Client-side routing with protected routes
- **Component modularity** – Reusable components with clear separation
- **Drag-and-drop interfaces** – Using react-draggable and react-dnd for player positioning
- **Real-time updates** – Polling-based live stat updates (4-second intervals)
- **Responsive design** – TailwindCSS 4 utility-first styling

### Data Flow

1. User records play via interactive field interface
2. Play data sent to Express API endpoint
3. `statRules.js` processes play and calculates affected stats
4. PostgreSQL database updated via prepared statements
5. Redis cache invalidated for affected entities
6. Frontend polls for updates and refreshes UI
7. Recharts visualizations re-render with new data

---

## 🧠 Future Improvements & Roadmap

> "Turning a stat tracker into a strategy platform."

### Planned Features (v2.0)

- **WebSocket integration** – Replace polling with real-time push updates
- **Enhanced multi-user collaboration** – Live concurrent stat tracking with conflict resolution
- **Customizable player profiles** – Stats history, photos, biographies
- **Advanced analytics dashboard** – Deeper insights with trend analysis and projections
- **Export functionality** – PDF stat sheets, CSV exports, and shareable reports
- **Mobile app** – Native iOS/Android apps for on-field stat tracking
- **Video integration** – Link plays to video timestamps for film review

### AI-Powered Features (v3.0 Vision)

- **Predictive analytics** – Next play prediction based on down/distance/field position
- **Win probability calculator** – Real-time game win percentage estimation
- **Optimal play suggestions** – AI recommendations for coaches
- **Automated announcer notes** – Natural language game summaries
- **Pattern recognition** – Identify team tendencies and player strengths

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **Redis** (v6 or higher)
- **npm** or **yarn**

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/KalnBrs/football-stat-tracker.git
cd football-stat-tracker
```

#### 2. Set up the database

Create a PostgreSQL database and run the schema:

```bash
psql -U your_username -d your_database -f Backend/src/Models/scripts.sql
```

#### 3. Configure environment variables

Create a `.env` file in the `Backend` directory:

```env
# Database Configuration
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=your_database_name

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Server Configuration
PORT=3000
```

#### 4. Install dependencies

```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

#### 5. Start the application

```bash
# Terminal 1: Start backend (from Backend directory)
npm run dev

# Terminal 2: Start frontend (from Frontend directory)
npm run dev
```

The backend will run on `http://localhost:3000` and the frontend on `http://localhost:5173` (default Vite port).

### 📋 First-Time Setup

1. Navigate to `/login` and create an account
2. Go to `/teams` to create your first team
3. Add players via CSV upload or manual entry
4. Navigate to `/tracker` to create a new game
5. Start tracking plays in real-time!

---

## 🎥 Demo & Screenshots

### Live Demo

Watch a full 3-minute walkthrough on [YouTube](https://youtu.be/GK9XLpeInAY)

### Screenshots

The application features:

- **Interactive field tracker** with drag-and-drop player positioning
- **Real-time scoreboard** with possession and timeout indicators
- **Comprehensive stats dashboard** with sortable player tables
- **Momentum visualization** using Recharts line graphs
- **Game selection interface** with team branding
- **Team management** with roster editing and CSV uploads

---

## 📁 Project Structure

```
Football Stat/
├── Backend/
│   ├── src/
│   │   ├── app.js                    # Express app configuration
│   │   ├── server.js                 # Server entry point
│   │   ├── queries.js                # Database query templates
│   │   ├── statRules.js              # Stat calculation logic
│   │   ├── Config/
│   │   │   ├── db.js                 # PostgreSQL connection
│   │   │   └── redisClient.js        # Redis connection
│   │   ├── Controllers/              # Route handlers
│   │   ├── Models/
│   │   │   └── scripts.sql           # Database schema
│   │   └── Routes/                   # API route definitions
│   ├── package.json
│   └── requests/                     # REST client test files
├── Frontend/
│   ├── src/
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # React entry point
│   │   ├── Components/               # Reusable UI components
│   │   ├── Features/                 # Redux slices
│   │   ├── pages/                    # Route pages
│   │   ├── Scripts/                  # API utility functions
│   │   └── Store/
│   │       └── store.js              # Redux store configuration
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js (implicit via @tailwindcss/vite)
└── README.md
```

---

## 🛠️ API Endpoints

### Authentication

- `POST /api/auth/register` – Create new user account
- `POST /api/auth/login` – Login and receive JWT token
- `POST /api/auth/refresh` – Refresh access token
- `POST /api/auth/logout` – Invalidate session

### Teams

- `GET /api/teams` – Get all teams for authenticated user
- `POST /api/teams` – Create new team
- `GET /api/teams/:id` – Get team details
- `PUT /api/teams/:id` – Update team information
- `DELETE /api/teams/:id` – Delete team

### Players

- `GET /api/players/:teamId` – Get roster for team
- `POST /api/players` – Add new player
- `POST /api/players/upload` – Bulk upload via CSV
- `PUT /api/players/:id` – Update player details
- `DELETE /api/players/:id` – Remove player

### Games

- `GET /api/games` – Get all games
- `POST /api/games` – Create new game
- `GET /api/games/:id` – Get game state and metadata
- `PUT /api/games/:id` – Update game state
- `DELETE /api/games/:id` – Delete game

### Stats

- `GET /api/stats/player/:playerId/:gameId` – Get player stats for game
- `GET /api/stats/team/:teamId/:gameId` – Get team aggregate stats
- `POST /api/stats/play` – Record new play and update stats
- `GET /api/stats/plays/:gameId` – Get all plays for game

---

## 🧑‍💻 Creator

**Developed by [Kaelan Brose](https://github.com/KalnBrs)**

Built for the Congressional App Challenge 2024, inspired by the need for accessible and professional-level stat tracking tools for high school sports.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve SnapStat:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Built with ❤️ for high school football programs
- Inspired by the need for better stat tracking tools for student broadcasters
- Special thanks to the open-source community for the amazing libraries used in this project

---

<div align="center">

**[⬆ Back to Top](#-snapstat)**

Made with ⚡ by [Kaelan Brose](https://github.com/KalnBrs) | [Watch Demo](https://youtu.be/GK9XLpeInAY) | [Report Bug](https://github.com/KalnBrs/football-stat-tracker/issues)

</div>
