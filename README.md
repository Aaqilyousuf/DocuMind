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

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **Git**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd DocuMind
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd docuMind_server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section)

# Run the server
python app/main.py
```

### 3. Frontend Setup

```bash
# Navigate to client directory (in new terminal)
cd docuMind_client

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

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
├── docuMind_client/          # React Frontend
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

### Common Issues

1. **Import Errors**
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

Enable debug mode by setting environment variables:
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