Day 20: Universal Extractor (AI-Powered OCR)
45 Days Coding Challenge
📖 Introduction
Today marks Day 20 of my 45 Days Coding Challenge.

While brainstorming ideas for today's build, I found myself reflecting on our previous projects. We had successfully implemented an AI Summarizer in an earlier challenge, but it lacked a bridge to the physical world. I realized that while extracting text is useful, understanding it is powerful.

So, I thought: Why not integrate these two concepts? The result is Universal Extractor—a premium, modern web application that bridges the gap between static documents and actionable intelligence. It combines client-side OCR (Optical Character Recognition) with the reasoning capabilities of NVIDIA's Llama 3 AI, wrapped in a high-performance, animated interface.

🚀 Live Demo
Experience the app live: https://day20-ocr-a-isummarizer.vercel.app/

✨ Key Features
📄 Universal OCR Engine: Instantly extracts text from Images (JPG/PNG) and PDF documents entirely within the browser.

🤖 AI-Powered Summarization: Integrated NVIDIA Llama 3.1 (via NVIDIA NIM API) to generate concise, bullet-point summaries of extracted text.

🌍 Multi-Language Support: Capable of recognizing and extracting text in English, Hindi, Spanish, and French.

⚡ Client-Side Processing: Uses Tesseract.js and PDF.js for secure, fast, and private data handling without server uploads.

🎨 Cyberpunk UI/UX: Features a "Heavy Modern" design with Glassmorphism, neon glows, and smooth Framer Motion animations.

🛠 Utility Tools: One-click Copy to Clipboard and Download as .txt functionality.

🛠️ Tech Stack
Frontend Framework: React + Vite (for lightning-fast performance).

OCR Engine: Tesseract.js (Image recognition) & PDF.js (PDF parsing).

Artificial Intelligence: NVIDIA NIM API (Llama 3.1 8B Instruct Model).

Animations: Framer Motion (Complex staggered animations & state transitions).

Styling: Pure CSS3 (Custom Variables, Glassmorphism, Keyframe Animations).

Icons: Lucide React.

Notifications: React Hot Toast.

⚙️ Installation & Setup
Follow these steps to run the project locally on your machine.

1. Clone the Repository
Bash

git clone https://github.com/YOUR_USERNAME/universal-extractor.git
cd universal-extractor
2. Install Dependencies
Bash

npm install
3. Configure Environment Variables
Create a .env file in the root directory to store your NVIDIA API Key securely.

Code snippet

VITE_NVIDIA_API_KEY=your_nvidia_api_key_here
(Note: You can get a free API key from build.nvidia.com)

4. Run the Development Server
Bash

npm run dev
Open http://localhost:5173 in your browser to view the app.

📂 Project Structure
Bash

├── src/
│   ├── utils/
│   │   └── extractor.js    # Logic for OCR and NVIDIA AI API calls
│   ├── App.jsx             # Main UI Component with Animations
│   ├── App.css             # Global Styles & Glassmorphism effects
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── .env                    # API Keys (Not pushed to GitHub)
├── vercel.json             # Serverless function config for Proxy (CORS fix)
└── vite.config.js          # Vite configuration with Proxy setup
🔧 Deployment (Vercel)
This project is optimized for deployment on Vercel.

Push your code to GitHub.

Import the project in Vercel.

Important: Add your Environment Variable (VITE_NVIDIA_API_KEY) in the Vercel Project Settings.

The vercel.json file included in this repo handles the API Proxying to avoid CORS issues with NVIDIA's API.

k this repository and submit pull requests. Any improvements to the UI or additional language support are welcome!

Built with ❤️ by [Your Name] for Day 20 of the 45 Days Coding Challenge.
