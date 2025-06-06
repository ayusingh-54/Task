# Sports Match Tracker

A comprehensive sports tracking application built with React (frontend) and Node.js/Express (backend) that provides real-time match data, standings, and statistics for Football, Basketball, and Cricket.

## 🏆 Features

- **Multi-Sport Support**: Football, Basketball, and Cricket
- **Live Match Data**: Real-time scores and match information
- **Today's Matches**: Quick access to current day's games
- **League Standings**: Competition tables and rankings
- **Match Details**: Comprehensive match information and head-to-head statistics
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Mock Data Support**: Fallback data for development and testing

## 🛠️ Tech Stack

### Frontend

- **React 18** with Vite
- **React Router DOM** for navigation
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Axios** for API calls
- **date-fns** for date formatting

### Backend

- **Node.js** with Express
- **Axios** for external API calls
- **CORS** enabled
- **Rate limiting** with express-rate-limit
- **Security** with Helmet

### APIs Used

- **Football Data API** (football-data.org)
- **API-Basketball** (api-sports.io)
- **Cricbuzz API** (RapidAPI)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Task
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### Configure Backend Environment Variables

Edit `server/.env`:

```properties
PORT=5000
SPORT_TYPE=football
FOOTBALL_API_KEY=your_football_api_key_here
FOOTBALL_COMPETITION=PL
BASKETBALL_APISPORTS_KEY=your_basketball_api_key_here
RAPIDAPI_KEY=your_rapidapi_key_here
USE_MOCK_DATA=true
NODE_ENV=production
```

**API Keys Required:**

- **Football API Key**: Get from [football-data.org](https://www.football-data.org/client/register)
- **Basketball API Key**: Get from [API-Sports](https://api-sports.io/)
- **Cricket API Key**: Get from [RapidAPI Cricbuzz](https://rapidapi.com/cricbuzz/api/cricbuzz-cricket/)

### 3. Frontend Setup

```bash
# Navigate to client directory (from project root)
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### Configure Frontend Environment Variables

Edit `client/.env`:

```properties
VITE_PORT=5174
VITE_API_BASE_URL=http://localhost:5000
VITE_USE_MOCK_DATA=true
VITE_USE_PROXY=false
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Start Backend Server

```bash
# From server directory
cd server
npm run dev

# Server will run on http://localhost:5000
```

#### Start Frontend Development Server

```bash
# From client directory (in a new terminal)
cd client
npm run dev

# Client will run on http://localhost:5174
```

### Production Mode

#### Build Frontend

```bash
cd client
npm run build
```

#### Start Production Server

```bash
cd server
npm start
```

## 📁 Project Structure

```
Task/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── common/     # Common components
│   │   │   ├── layout/     # Layout components
│   │   │   └── matches/    # Match-related components
│   │   ├── contexts/       # React contexts
│   │   ├── mocks/          # Mock data for development
│   │   ├── pages/          # Page components
│   │   │   ├── basketball/ # Basketball-specific pages
│   │   │   ├── cricket/    # Cricket-specific pages
│   │   │   └── football/   # Football-specific pages
│   │   ├── services/       # API service functions
│   │   ├── store/          # Zustand stores
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Express backend
│   ├── routes/             # API route handlers
│   ├── services/           # External API services
│   └── package.json
└── README.md
```

## 🎯 Usage Guide

### Navigation

1. **Home Page**: Overview with featured matches and quick navigation
2. **Today's Matches**: Current day's matches for selected sport
3. **Standings**: League tables and rankings
4. **Match Details**: Detailed information about specific matches

### Switching Sports

Use the sport selector in the navigation bar to switch between:

- ⚽ Football
- 🏀 Basketball
- 🏏 Cricket

### Key Features

#### Football

- Premier League, La Liga, Serie A, Bundesliga standings
- Live match data and scores
- Head-to-head statistics
- Competition codes: PL, PD, SA, BL1, FL1, CL

#### Basketball

- NBA standings by conference
- Live game data and scores
- League IDs: 12 (NBA), 13 (NCAA), 1 (EuroLeague)

#### Cricket

- Live match data
- Series information
- Match scorecards and commentary

## 🔧 Configuration

### Mock Data Mode

The application includes comprehensive mock data for development:

```javascript
// Enable mock data (in .env files)
USE_MOCK_DATA=true          # Backend
VITE_USE_MOCK_DATA=true    # Frontend
```

### API Rate Limiting

The backend includes rate limiting (500 requests per 15 minutes). Adjust in `server/index.js`:

```javascript
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // requests per windowMs
});
```

### CORS Configuration

CORS is enabled for all origins in development. For production, update `server/index.js`:

```javascript
app.use(
  cors({
    origin: ["http://localhost:5174", "your-production-domain.com"],
  })
);
```

## 🚨 Troubleshooting

### Common Issues

#### 1. API Key Errors

```
Error: Unauthorized access
```

**Solution**: Verify API keys in `server/.env` are correct and active.

#### 2. CORS Errors

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**: Ensure backend server is running on port 5000 and CORS is configured.

#### 3. Network Errors

```
Network Error / Failed to fetch
```

**Solution**: Check if backend server is running and `VITE_API_BASE_URL` is correct.

#### 4. Mock Data Not Loading

**Solution**: Verify `USE_MOCK_DATA=true` in environment files.

### Development Tips

1. **Use Mock Data**: Set `USE_MOCK_DATA=true` for consistent development experience
2. **Check Network Tab**: Monitor API calls in browser dev tools
3. **Backend Logs**: Check server console for detailed error messages
4. **Hot Reload**: Both frontend and backend support hot reloading

## 🌐 Deployment

### Backend Deployment (Vercel)

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy from server directory:

```bash
cd server
vercel
```

3. Set environment variables in Vercel dashboard

### Frontend Deployment (Vercel/Netlify)

1. Build the project:

```bash
cd client
npm run build
```

2. Deploy the `dist` folder to your hosting platform

3. Update `VITE_API_BASE_URL` to your deployed backend URL

## 📝 Environment Variables Reference

### Backend (`server/.env`)

| Variable                   | Description           | Example         |
| -------------------------- | --------------------- | --------------- |
| `PORT`                     | Server port           | `5000`          |
| `SPORT_TYPE`               | Default sport type    | `football`      |
| `FOOTBALL_API_KEY`         | Football Data API key | `your_key_here` |
| `BASKETBALL_APISPORTS_KEY` | Basketball API key    | `your_key_here` |
| `RAPIDAPI_KEY`             | Cricket API key       | `your_key_here` |
| `USE_MOCK_DATA`            | Enable mock data      | `true`          |
| `NODE_ENV`                 | Environment           | `development`   |

### Frontend (`client/.env`)

| Variable             | Description             | Example                 |
| -------------------- | ----------------------- | ----------------------- |
| `VITE_PORT`          | Development server port | `5174`                  |
| `VITE_API_BASE_URL`  | Backend API URL         | `http://localhost:5000` |
| `VITE_USE_MOCK_DATA` | Enable mock data        | `true`                  |
| `VITE_USE_PROXY`     | Use Vite proxy          | `false`                 |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Ayush Singh**

- Email: ayusingh693@gmail.com
- GitHub: [Your GitHub Profile]

## 🙏 Acknowledgments

- [Football Data API](https://www.football-data.org/) for football data
- [API-Sports](https://api-sports.io/) for basketball data
- [Cricbuzz API](https://rapidapi.com/cricbuzz/api/cricbuzz-cricket/) for cricket data
- [Tailwind CSS](https://tailwindcss.com/) for styling framework
- [React](https://reactjs.org/) for the frontend framework

---

⭐ Star this repo if you found it helpful!
