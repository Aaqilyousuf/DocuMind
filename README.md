# DocuMind 🧠📄

> **Intelligent Document Interaction Platform**

DocuMind is a powerful AI-driven document management and interaction platform that allows users to upload, manage, and chat with their documents using advanced Retrieval Augmented Generation (RAG) technology. Built with React and Flask, it provides secure, user-isolated document processing with real-time AI-powered conversations.

## ✨ Features

### 🔐 **User-Isolated Document Management**
- Secure user authentication with cookie-based sessions
- Complete user isolation - users can only access their own documents
- Real-time document synchronization across components

### 📄 **Multi-Format Document Support**
- **PDF** - Extract text from PDF documents
- **DOCX** - Process Microsoft Word documents
- **TXT** - Handle plain text files
- **CSV** - Parse comma-separated values

### 🤖 **AI-Powered Chat Interface**
- Chat with your documents using natural language
- Context-aware responses based on document content
- Powered by Groq's fast inference engine
- Real-time conversation interface

### ⚡ **Advanced RAG Pipeline**
- **Document Processing**: Upload → Text Extraction → Chunking → Embeddings → Vector Storage
- **Smart Chunking**: Intelligent text segmentation for optimal retrieval
- **Vector Search**: Fast similarity search using Pinecone vector database
- **Embedding Models**: Support for multiple embedding providers

### 🎨 **Modern User Interface**
- Clean, responsive design with Tailwind CSS
- Real-time file upload with progress indicators
- Intuitive chat sidebar with document management
- Delete functionality with confirmation dialogs

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │   Flask Server  │    │  External APIs  │
│                 │    │                 │    │                 │
│ • Upload UI     │◄──►│ • File Routes   │◄──►│ • Pinecone DB   │
│ • Chat Interface│    │ • Query Routes  │    │ • Groq LLM      │
│ • Document List │    │ • RAG Pipeline  │    │ • Appwrite      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Docker** and **Docker Compose** (Recommended)
- **Node.js** (v16 or higher) - if running manually
- **Python** (v3.8 or higher) - if running manually
- **Git**

### 🐳 Docker Setup (Recommended)

The easiest way to get DocuMind running is with Docker:

```bash
# 1. Clone the repository
git clone <repository-url>
cd DocuMind

# 2. Setup environment variables
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section below)

# 3. Start everything with Docker
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

**That's it!** Your application will be running at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

```bash
# To stop services
docker-compose down

# To view logs
docker-compose logs -f

# To restart services
docker-compose restart
```

### 🔧 Manual Setup (Alternative)

If you prefer to run without Docker:

### 💻 Manual Setup (Alternative)

If you prefer to run without Docker:

#### Backend Setup

```bash
# Navigate to server directory
cd docuMind_server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your API keys

# Run the server
python app/main.py
```

#### Frontend Setup

```bash
# Navigate to client directory (in new terminal)
cd docuMind_client

# Install dependencies
npm install

# Start development server
npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173 (Vite dev server)
- Backend: http://localhost:5000

## 🔧 Environment Variables

Create a `.env` file in the `docuMind_server` directory with the following variables:

```env
# Pinecone Configuration (Required)
PINECONE_API_KEY=your_pinecone_api_key_here

# Groq Configuration (Required)
GROQ_API_KEY=your_groq_api_key_here

# Appwrite Configuration (Required)
APPWRITE_ENDPOINT=your_appwrite_endpoint_here
APPWRITE_PROJECT_ID=your_appwrite_project_id_here
APPWRITE_API_KEY=your_appwrite_api_key_here
APPWRITE_BUCKET_ID=your_appwrite_bucket_id_here
```

### API Keys Setup

1. **Pinecone** (Vector Database)
   - Sign up at [pinecone.io](https://pinecone.io)
   - Create a new project and get your API key
   - Create an index with 768 dimensions (cosine similarity)

2. **Groq** (LLM Inference)
   - Sign up at [groq.com](https://groq.com)
   - Get your API key from the dashboard

3. **Appwrite** (File Storage)
   - Sign up at [appwrite.io](https://appwrite.io)
   - Create a new project
   - Set up a storage bucket
   - Generate API keys

## 📂 Project Structure

```
DocuMind/
├── docker-compose.yml          # Docker configuration
├── .env.example               # Environment variables template
├── README.md                  # This file
├── docuMind_client/          # React Frontend
│   ├── Dockerfile            # Frontend container setup
│   ├── src/
│   │   ├── components/       # UI Components
│   │   │   ├── ui/          # Reusable UI components
│   │   │   ├── ChatSidebar.tsx
│   │   │   ├── FileList.tsx
│   │   │   └── FileUploadCard.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── ChatPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   └── UploadPage.tsx
│   │   └── hooks/           # Custom React hooks
│   ├── package.json
│   └── vite.config.ts
│
├── docuMind_server/          # Flask Backend
│   ├── Dockerfile            # Backend container setup
│   ├── app/
│   │   ├── routes/          # API Routes
│   │   │   ├── upload.py    # File upload endpoints
│   │   │   ├── query.py     # Chat query endpoints
│   │   │   └── files.py     # File management endpoints
│   │   ├── services/        # Business Logic
│   │   │   ├── file_processor.py  # Document processing
│   │   │   ├── file_parser.py     # Text extraction
│   │   │   ├── chunking.py        # Text chunking
│   │   │   ├── embeddings.py      # Vector embeddings
│   │   │   ├── vectorstore.py     # Pinecone operations
│   │   │   ├── llm.py            # Groq integration
│   │   │   └── storage.py        # Appwrite integration
│   │   └── main.py          # Flask application
│   ├── requirements.txt
│   └── .env.example
│
└── README.md                # This file
```

## 🐳 Docker Development

### Docker Setup Details

DocuMind uses Docker for easy development setup. The configuration includes:

- **Backend Container**: Python 3.11 with Flask development server
- **Frontend Container**: Node.js 18 with Vite development server  
- **Hot Reload**: Both containers support live code changes
- **Volume Mounts**: Source code is mounted for instant updates

### Docker Commands

```bash
# Start all services
docker-compose up

# Build and start (after code changes)
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh
```

### Docker Troubleshooting

```bash
# Rebuild containers from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up

# Clean up Docker resources
docker system prune -f

# Check container status
docker-compose ps
```

## 🔄 API Endpoints

### File Management
- `GET /api/v1/files` - List user's documents
- `POST /api/v1/upload` - Upload a new document
- `DELETE /api/v1/files/<file_id>` - Delete a document

### Chat Interface
- `POST /api/v1/query` - Send chat query to AI

### Health Check
- `GET /` - API health status

## 🛠️ Development

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Axios for HTTP requests
- React Router for navigation
- Shadcn/ui component library

**Backend:**
- Flask (Python web framework)
- Flask-CORS for cross-origin requests
- Sentence Transformers for embeddings
- PyPDF2 for PDF processing
- python-docx for Word documents

**External Services:**
- Pinecone (Vector Database)
- Groq (LLM Inference)
- Appwrite (File Storage)

### Key Features Implementation

1. **User Isolation**: All operations are filtered by `user_id` from cookies
2. **File Processing Pipeline**: Upload → Parse → Chunk → Embed → Store
3. **Real-time Updates**: Custom events for cross-component synchronization
4. **Error Handling**: Comprehensive error handling with user-friendly messages

### Adding New Document Types

1. Update `file_parser.py` with new extraction logic
2. Add MIME type support in `FileUploadCard.tsx`
3. Update file validation in both frontend and backend

## 🚨 Troubleshooting

### Docker Issues

1. **Port Conflicts**
   ```bash
   # If ports 3000 or 5000 are in use, edit docker-compose.yml:
   ports:
     - "3001:3000"  # Frontend
     - "5001:5000"  # Backend
   ```

2. **Container Build Failures**
   ```bash
   # Clean rebuild
   docker-compose down
   docker-compose build --no-cache
   docker-compose up
   ```

3. **Volume Mount Issues**
   ```bash
   # On Windows, ensure drive sharing is enabled in Docker Desktop
   # On Linux, check file permissions
   sudo chown -R $USER:$USER .
   ```

### Application Issues

1. **Import Errors (Manual Setup)**
   ```bash
   # Make sure you're in the virtual environment
   pip install -r requirements.txt
   ```

2. **CORS Issues**
   - Check that Flask-CORS is installed
   - Verify frontend is running on correct port

3. **File Upload Errors**
   - Check file type is supported
   - Verify file size limits
   - Check Appwrite bucket permissions

4. **Chat Not Working**
   - Verify Groq API key is valid
   - Check Pinecone connection
   - Ensure documents are properly indexed

### Debug Mode

**With Docker:**
```bash
# View detailed logs
docker-compose logs -f

# Access container for debugging
docker-compose exec backend bash
```

**Manual Setup:**
```bash
export FLASK_DEBUG=1
export FLASK_ENV=development
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💫 Acknowledgments

- Built with modern React and Flask best practices
- Powered by advanced AI and vector search technologies
- Designed for scalability and user privacy

---

**Happy document chatting! 🎉**

For support or questions, please open an issue in the repository.