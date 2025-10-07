# Construction Bid Intelligence Platform - Frontend

Modern React TypeScript frontend for AI-powered construction bid analysis dashboard.

## 🚀 Features

- **Authentication** - Secure JWT-based login system
- **Dashboard** - Statistics cards and reports table with search
- **Upload Interface** - Drag & drop PDF document upload
- **Report Detail View** - Comprehensive 4-section analysis:
  - Executive Summary
  - Cost Analysis with charts
  - Risk Assessment with categories
  - Recommendations and action items
- **Comparison Tool** - Side-by-side comparison of multiple reports
- **Responsive Design** - Works on desktop, tablet, and mobile

## 📋 Requirements

- Node.js 18+
- npm or yarn

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Create .env.local file from template
cp .env.example .env.local
# Edit .env.local with your configuration
```

## 🏃 Running the Development Server

```bash
# Start dev server with hot reload
npm run dev
```

Application will be available at: http://localhost:5173

## ⚙️ Configuration

The application uses environment variables for configuration. Copy `.env.example` to `.env.local` and adjust values:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# Environment
VITE_ENVIRONMENT=development
```

**Important:** All environment variables must be prefixed with `VITE_` to be exposed to the client.

See `.env.example` for all available options.

## 🏗️ Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

## 📚 Pages & Routes

- `/login` - Authentication page
- `/` - Dashboard (protected)
- `/upload` - Document upload (protected)
- `/report/:id` - Detailed report view (protected)
- `/compare?ids=1,2,3` - Compare reports (protected)

## 🔐 Demo Credentials

- **Email:** demo@ntsprint.com
- **Password:** demo123
- **User:** John Doe

## 🎨 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **TailwindCSS** - Utility-first CSS

## 📊 Sample Data

3 pre-analyzed Minnesota construction projects:
1. **Minneapolis Regional Medical Center** - Medium-High Risk, $2.5M-$3.2M
2. **Interstate 35 North Expansion** - Low-Medium Risk, $1.6M-$1.9M
3. **Rochester STEM Academy Campus** - High Risk, $2.8M-$3.5M

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.tsx           # Authentication page
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── Upload.tsx          # File upload
│   │   ├── ReportDetail.tsx    # Full report view
│   │   └── Comparison.tsx      # Side-by-side comparison
│   ├── App.tsx                 # Main app with routing
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🔧 Configuration

### Backend API URL

The frontend is configured to proxy API requests to `http://localhost:8000` in development mode (see `vite.config.ts`).

For production, update the API base URL in `vite.config.ts` or use environment variables.

### Environment Variables

Create a `.env.local` file for local overrides:

```env
VITE_API_URL=http://localhost:8000
```

## 🎯 Key Features Demo

### Dashboard
- Real-time statistics
- Search and filter reports
- Multi-select for comparison
- Color-coded risk levels

### Report Detail
- **Executive Summary** - Project overview, requirements, dates
- **Cost Analysis** - Budget breakdown, guarantees, payment terms, AI pricing strategy
- **Risk Assessment** - 5 risk categories, red flags, mitigation actions
- **Recommendations** - Strategic advice and priority actions

### Comparison
- Side-by-side table layout
- Automatic best/worst highlighting
- AI recommendation banner
- Summary statistics

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

## 📝 License

MIT

## 👤 Author

Reynier Bauta Camejo - SDE II

## 🔗 Related

- Backend Repository: [construction-bid-intelligence-backend](https://github.com/reybcdev/construction-bid-intelligence-backend)
