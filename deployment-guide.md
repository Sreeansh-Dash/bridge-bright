# 🚀 BrightBridge Deployment Guide

This guide will help you deploy BrightBridge with full Google ADK integration.

## 📋 Prerequisites

### 1. Google Cloud Setup
- Google Cloud Project with ADK enabled
- Service Account with appropriate permissions
- API credentials (service account JSON or API key)

### 2. System Requirements
- Node.js 18+
- Python 3.8+
- Git

## 🛠️ Local Development Setup

### Step 1: Environment Setup
```bash
# Clone and install dependencies
npm install

# Set up Python environment
cd brightbridgeDir
python setup_environment.py
cd ..

# Copy environment file
cp .env.example .env
```

### Step 2: Configure Environment Variables
Edit `.env` file:
```env
# Google Cloud Configuration
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_PROJECT_ID=your_project_id_here
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json

# Server Configuration
NODE_ENV=development
PORT=3001

# Frontend Configuration
VITE_API_URL=http://localhost:3001
```

### Step 3: Run Development Server
```bash
# Start both frontend and backend
npm run dev

# Or run separately:
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend  
npm run client
```

## 🌐 Production Deployment

### Option 1: Railway (Recommended)

1. **Connect Repository**
   - Connect your GitHub repository to Railway
   - Railway will auto-detect the Node.js app

2. **Set Environment Variables**
   ```env
   NODE_ENV=production
   PORT=3001
   GOOGLE_API_KEY=your_api_key
   GOOGLE_PROJECT_ID=your_project_id
   VITE_API_URL=https://your-app.railway.app
   ```

3. **Deploy**
   - Railway will automatically build and deploy
   - Your app will be available at `https://your-app.railway.app`

### Option 2: Render

1. **Create Web Service**
   - Connect your GitHub repository
   - Set build command: `npm install && npm run build`
   - Set start command: `npm run server`

2. **Environment Variables**
   - Add all required environment variables in Render dashboard
   - Set `NODE_ENV=production`

### Option 3: Heroku

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set GOOGLE_API_KEY=your_api_key
   heroku config:set GOOGLE_PROJECT_ID=your_project_id
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 4: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine

   # Install Python
   RUN apk add --no-cache python3 py3-pip

   WORKDIR /app

   # Copy package files
   COPY package*.json ./
   RUN npm ci --only=production

   # Copy Python requirements
   COPY brightbridgeDir/requirements.txt ./brightbridgeDir/
   RUN pip3 install -r brightbridgeDir/requirements.txt

   # Copy application code
   COPY . .

   # Build frontend
   RUN npm run build

   EXPOSE 3001

   CMD ["npm", "run", "server"]
   ```

2. **Build and Deploy**
   ```bash
   docker build -t brightbridge .
   docker run -p 3001:3001 --env-file .env brightbridge
   ```

## 🔧 Configuration Details

### Google Cloud Service Account Setup

1. **Create Service Account**
   - Go to Google Cloud Console
   - Navigate to IAM & Admin > Service Accounts
   - Create new service account

2. **Assign Permissions**
   - AI Platform Admin
   - Vertex AI User
   - Any other required ADK permissions

3. **Download Key**
   - Create and download JSON key file
   - Set `GOOGLE_APPLICATION_CREDENTIALS` to file path

### Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_API_KEY` | Google Cloud API key | Yes* |
| `GOOGLE_PROJECT_ID` | Google Cloud project ID | Yes |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account JSON | Yes* |
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | No (default: 3001) |
| `VITE_API_URL` | Frontend API URL | Yes |

*Either `GOOGLE_API_KEY` or `GOOGLE_APPLICATION_CREDENTIALS` is required

## 🧪 Testing the Deployment

### Health Check
```bash
curl https://your-domain.com/health
```

### API Test
```bash
curl -X POST https://your-domain.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "userName": "Test"}'
```

### Python Bridge Test
```bash
cd brightbridgeDir
python setup_environment.py
```

## 🚨 Troubleshooting

### Common Issues

1. **Python Import Errors**
   - Ensure all requirements are installed: `pip install -r brightbridgeDir/requirements.txt`
   - Check Python path configuration

2. **Google Cloud Authentication**
   - Verify credentials are correctly set
   - Check service account permissions
   - Ensure ADK is enabled for your project

3. **Port Issues**
   - Make sure PORT environment variable is set correctly
   - Check for port conflicts

4. **Build Failures**
   - Ensure Node.js version is 18+
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Logs and Debugging

- Check server logs for Python bridge errors
- Monitor Google Cloud logs for ADK issues
- Use health check endpoint to verify service status

## 📊 Monitoring

### Health Monitoring
- Use `/health` endpoint for uptime monitoring
- Monitor response times and error rates
- Set up alerts for service failures

### Performance Optimization
- Enable gzip compression
- Use CDN for static assets
- Monitor Python process performance
- Implement caching where appropriate

## 🔒 Security Considerations

- Never commit API keys or credentials to version control
- Use environment variables for all sensitive data
- Implement rate limiting (already included)
- Enable CORS only for trusted domains
- Regular security updates for dependencies

---

**Need Help?** Check the troubleshooting section or create an issue in the repository.