# AI Health Assistant - Frontend

A professional React.js frontend for the AI Health Assistant backend system with a modern green theme.

## Features

- 🔐 **User Authentication** - Secure login and registration
- 🩺 **Diabetes Assessment** - Comprehensive glucose risk evaluation
- ❤️ **Cardiac Assessment** - Advanced heart health analysis
- 📊 **Health Metrics** - Track health data over time
- 🧠 **Explainable AI** - Detailed risk explanations with priority system
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Professional Green Theme** - Clean, medical-focused design

## Technology Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API communication
- **CSS3** with custom green theme
- **Responsive Grid Layout**

## Setup Instructions

### Prerequisites
- Node.js 16+ installed
- Backend server running on `http://127.0.0.1:8000`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```
   Frontend will run on `http://localhost:3000`

3. **Start both frontend and backend together:**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/          # Reusable components
│   └── Header.tsx      # Navigation header
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Login.tsx       # Authentication
│   ├── Register.tsx    # User registration
│   ├── DiabetesAssessment.tsx  # Diabetes risk form
│   ├── CardiacAssessment.tsx   # Cardiac risk form
│   └── UserMetrics.tsx # Health data history
├── services/           # API services
│   └── api.ts         # Backend communication
├── App.tsx            # Main app component
├── App.css           # Global styles
└── index.tsx         # App entry point
```

## Key Features

### Authentication System
- JWT token-based authentication
- Secure login/logout functionality
- Protected routes for authenticated users

### Risk Assessments
- **Diabetes Assessment**: Comprehensive form with glucose levels, symptoms, medication, lifestyle factors
- **Cardiac Assessment**: Heart health evaluation with chest pain, blood pressure, lifestyle factors
- **Real-time Results**: Instant risk calculation with detailed explanations

### Explainable AI Interface
- **Priority Explanations**: Top 3-4 most important risk factors shown first
- **Show More Details**: Expandable section for additional explanations
- **Risk Score Visualization**: Color-coded risk levels (Low/Moderate/High/Critical)
- **Percentage Breakdown**: Visual representation of risk factor contributions

### Health Metrics Tracking
- Historical data viewing
- Filter by disease type (diabetes/cardiac)
- Detailed metric cards with timestamps
- Empty state handling

## Design System

### Color Palette
- **Primary Green**: `#2d5a27` - Headers, buttons, primary text
- **Light Green**: `#4a7c59` - Gradients, hover states
- **Very Light Green**: `#a8d5ba` - Borders, secondary elements
- **Pale Green**: `#e8f5e8` - Background, cards
- **White**: `#ffffff` - Card backgrounds

### Components
- **Cards**: Rounded corners, subtle shadows, green borders
- **Forms**: Clean inputs with green focus states
- **Buttons**: Gradient backgrounds with hover animations
- **Risk Scores**: Color-coded based on severity level

## API Integration

The frontend communicates with the FastAPI backend through:

- **Authentication**: `/login`, `/register`
- **Risk Assessment**: `/diabetes-risk`, `/cardiac-risk`
- **Recommendations**: `/diabetes-recommendations`, `/cardiac-recommendations`
- **User Metrics**: `/user-metrics`

## Responsive Design

- **Mobile-first approach**
- **Grid layouts** that adapt to screen size
- **Collapsible navigation** on mobile
- **Touch-friendly buttons** and forms

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run dev` - Start both frontend and backend

### Environment Configuration

The frontend is configured to proxy API requests to `http://localhost:8000` during development.

## Production Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Serve the build folder** using any static file server

3. **Update API base URL** in `src/services/api.ts` for production backend

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Maintain the green theme consistency
4. Test on multiple screen sizes
5. Ensure accessibility compliance