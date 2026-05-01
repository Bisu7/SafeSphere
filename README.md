# SafeSphere

SafeSphere is an advanced, AI-driven security platform designed to protect users from modern web threats such as phishing, malicious URLs, and suspicious content. By combining a real-time browser extension with a powerful security dashboard, SafeSphere provides a multi-layered defense against cyber threats using Google's Gemini AI for deep content analysis.

## Core Features

- **Multi-Modal Scanning**: Support for analyzing text, URLs, and images to detect threats across different media.
- **AI-Powered Analysis**: Utilizes Google's Gemini 2.0 Flash model for deep content analysis and AI Vision to inspect images for phishing attempts.
- **Real-time Link Scanning**: Automatically intercepts and scans links as you browse.
- **Security Dashboard**: A comprehensive React-based dashboard with real-time analytics, threat trends, and scan history.
- **Heuristic Form Protection**: Detects suspicious input fields in web forms (e.g., password requests on unsecured domains).

## Technology Stack

### Backend
- **FastAPI**: Core security API built with high-performance asynchronous Python.
- **PostgreSQL**: Relational database for persistent storage of security events and analytics.
- **SQLAlchemy**: ORM for database modeling and efficient querying.
- **Google Gemini 2.0 Flash**: Advanced LLM for sophisticated threat detection and vision analysis.
- **BeautifulSoup4 & Requests**: Used for scraping and analyzing webpage content in real-time.

### Frontend
- **React 19**: Modern UI development with the latest React features.
- **Vite 8**: Optimized development and build pipeline.
- **Tailwind CSS 4**: Next-generation utility-first styling for a premium aesthetic.
- **Recharts**: Dynamic data visualization for the security dashboard.
- **Lucide React**: Vector icons for a clean user interface.

### Browser Extension
- **Chrome Manifest V3**: Secure, performant, and privacy-focused extension architecture.
- **Background Service Workers**: Continuous monitoring of web traffic without impacting browser performance.

### Infrastructure
- **Docker & Docker Compose**: Containerization for seamless local development and deployment.
- **AWS (ECR, RDS, ECS)**: Scalable cloud infrastructure for production hosting.
- **Nginx**: Production-grade web server serving the frontend application.
- **GitHub Actions**: Automated CI/CD pipeline for building and pushing images.

## Project Structure

```text
SafeSphere/
├── .github/workflows/      # Automated deployment pipelines (CI/CD)
├── backend/                # FastAPI Security API
│   ├── app/
│   │   ├── models/         # Database schemas (User, Scan, Activity)
│   │   ├── routes/         # API endpoints (Scan, Dashboard, Auth)
│   │   ├── services/       # AI Engines (LLM, Rule Engine, Aggregator)
│   │   └── main.py         # Application entry point
│   ├── Dockerfile          # Backend containerization
│   └── requirements.txt    # Python dependencies
├── frontend/               # React Security Dashboard
│   ├── src/
│   │   ├── components/     # Reusable UI elements
│   │   ├── pages/          # Dashboard, History, and Settings views
│   │   └── App.jsx         # Main application logic
│   ├── Dockerfile          # Frontend containerization
│   └── nginx.conf          # Production web server config
├── extension/              # Chrome Browser Protection
│   ├── background.js       # Global traffic monitoring logic
│   ├── popup.html/js       # Quick-scan interface
│   └── content.js          # In-page threat detection
└── deployment_guide.md     # Step-by-step AWS deployment instructions
```

## Main Components

### 1. AI Security Engine
The heart of SafeSphere resides in the `backend/app/services`. It uses a tiered approach:
- **Rule Engine**: Fast, pattern-based detection for known malicious signatures.
- **LLM Engine**: Deep analysis using Gemini 2.0 Flash to understand context and intent.
- **Vision Engine**: Analyzes screenshots of websites to detect visual deception (e.g., fake login pages).
- **Aggregator**: Combines results from all engines to produce a final Risk Score and Verdict.

### 2. Scanning Pipeline
- **URL Scanning**: Fetches the target webpage, extracts text/meta-data, and runs it through the AI engine.
- **Image Scanning**: Processes uploaded images or screenshots through Gemini's vision capabilities.
- **Form Protection**: Monitors web forms for sensitive fields (SSN, Passwords) and alerts users if the domain is untrusted.

### 3. Security Dashboard
Built with React and Tailwind CSS, the dashboard offers:
- **Real-time Stats**: Live view of scans performed and threats blocked.
- **Threat Analytics**: Visualized trends showing the types of attacks being targeted.
- **Scan History**: Detailed drill-down into every scanned item with AI-generated highlights.

## Installation and Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- A Google Gemini API Key

### Backend Setup
1. **Clone and Enter**:
   ```bash
   cd SafeSphere/backend
   ```
2. **Environment Configuration**:
   Create a `.env` file:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/safesphere
   GEMINI_API_KEY=your_key_here
   ```
3. **Install and Run**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. **Enter Directory**:
   ```bash
   cd SafeSphere/frontend
   ```
2. **Install and Run**:
   ```bash
   npm install
   npm run dev
   ```

### Extension Setup
1. Open **Chrome** and navigate to `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `SafeSphere/extension` folder.

## Running with Docker

To run the database and backend services together:

1. **Start Services**:
   ```bash
   cd backend
   docker-compose up --build
   ```
2. The database will be initialized, and the API will be available at `http://localhost:8000`.

## Deployment (AWS)

SafeSphere is designed to run on AWS Free Tier:
- **Backend**: Containerized and deployed to **ECS** (Elastic Container Service) on **EC2 (t2.micro)**.
- **Frontend**: Served via **Nginx** and deployed as a container on ECS.
- **Database**: Managed **Amazon RDS** (PostgreSQL).
- **CI/CD**: Every push to `main` triggers a GitHub Action to rebuild and push images to **Amazon ECR**.


## CI/CD Pipeline

The project includes a robust GitHub Actions workflow that automates the following:
1. **Linting**: Ensures code quality across the codebase.
2. **Docker Build**: Builds production-ready images for both backend and frontend.
3. **AWS Push**: Pushes the latest images to Amazon ECR.
4. **Service Update**: Triggers an AWS ECS deployment to refresh the running services with the latest changes.

## License

This project is licensed under the MIT License.

---

SafeSphere - Making the web a safer place, one scan at a time.
