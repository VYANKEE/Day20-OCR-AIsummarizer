import { useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, FileText, Sparkles, Copy, Download, 
  Loader2, CheckCircle2, Languages, Upload, Cpu, Zap // New Icons
} from 'lucide-react';
import './App.css';
import { extractTextFromImage, extractTextFromPDF, summarizeText } from './utils/extractor';

function App() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [progress, setProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [language, setLanguage] = useState('eng');

  const toolRef = useRef(null);

  const scrollToTool = () => toolRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setIsExtracting(true); // Start scanning animation
    setProgress(0);
    setText('');
    setSummary('');

    try {
      let resultText = '';
      if (file.type === 'application/pdf') {
        setProgress(60);
        resultText = await extractTextFromPDF(file);
      } else {
        resultText = await extractTextFromImage(file, language, setProgress);
      }
      setText(resultText);
      toast.success('Extraction Complete!');
    } catch (err) {
      console.error(err);
      toast.error('Extraction Failed. Try another file.');
    } finally {
      setIsExtracting(false); // Stop scanning animation
      setProgress(100);
    }
  };

  const handleSummarize = async () => {
    if (!text) return;
    setIsSummarizing(true); // Start pulsing animation
    try {
      const result = await summarizeText(text);
      setSummary(result);
      toast.success('Summary Generated via Llama 3!');
    } catch (error) {
      console.error(error);
      toast.error('AI Summary Failed. Check Console.');
    } finally {
      setIsSummarizing(false); // Stop pulsing animation
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to Clipboard!');
  };

  const downloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "extracted_data.txt";
    document.body.appendChild(element);
    element.click();
  };

  // --- Animation Variants for Staggered Steps ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
  };
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="app-container">
      <Toaster position="bottom-center" toastOptions={{
        style: { background: '#1e1e2e', color: '#fff', border: '1px solid #333' }
      }}/>
      
      <div className="bg-glow purple"></div>
      <div className="bg-glow blue"></div>

      {/* --- HERO SECTION --- */}
      <section className="section hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="badge">
            <Sparkles size={16} /> <span>Powered by NVIDIA Llama 3</span>
          </div>
          <h1 className="title">Universal <span className="gradient-text">Extractor.</span></h1>
          <p className="subtitle">
            Convert Images & PDFs into editable text instantly. <br/>
            Summarize automatically with next-gen AI.
          </p>
          <motion.button 
            className="cta-btn" 
            onClick={scrollToTool}
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0, 198, 255, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Start Extracting
          </motion.button>
        </motion.div>
      </section>

      {/* --- NEW: HOW IT WORKS SECTION --- */}
      <section className="section">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >How It Works</motion.h2>
        <motion.div 
          className="steps-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Step 1 */}
          <motion.div className="step-card" variants={itemVariants}>
            <span className="step-number">1</span>
            <Upload className="step-icon" />
            <h3>Upload File</h3>
            <p>Drag & drop any Image (JPG, PNG) or PDF document into the tool.</p>
          </motion.div>
          {/* Step 2 */}
          <motion.div className="step-card" variants={itemVariants}>
            <span className="step-number">2</span>
            <Cpu className="step-icon" style={{color: '#bd34fe'}}/>
            <h3>AI Extraction</h3>
            <p>Our local OCR engine instantly scans and converts pixels to editable text.</p>
          </motion.div>
          {/* Step 3 */}
          <motion.div className="step-card" variants={itemVariants}>
            <span className="step-number">3</span>
            <Zap className="step-icon" style={{color: '#00ff9d'}}/>
            <h3>Summarize & Use</h3>
            <p>Use Llama 3 AI to summarize long text, then copy or download the result.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* --- TOOL SECTION --- */}
      <section className="section tool-section" ref={toolRef}>
        <motion.div 
          className="glass-panel"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="panel-header">
            <h2><UploadCloud className="inline-icon" /> Upload File</h2>
            <div className="lang-select">
              <Languages size={18} style={{marginRight:'5px'}}/>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="eng">English</option>
                <option value="hin">Hindi</option>
                <option value="spa">Spanish</option>
                <option value="fra">French</option>
              </select>
            </div>
          </div>

          {/* HEAVY ANIMATION APPLIED HERE: 'scanning' class */}
          <label className={`upload-zone ${isExtracting ? 'scanning' : ''}`}>
            <input type="file" onChange={handleFileUpload} accept="image/*, .pdf" hidden disabled={isExtracting} />
            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="folder-icon">{isExtracting ? '📡' : '📂'}</div>
              <p className="upload-text">
                {isExtracting ? "Scanning Document..." : (fileName ? fileName : "Drag & Drop or Click to Browse")}
              </p>
            </motion.div>
          </label>

          <AnimatePresence>
            {isExtracting && (
              <motion.div 
                className="loader-wrapper"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="progress-track">
                  <motion.div 
                    className="progress-fill" 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <p style={{marginTop: '10px', fontSize: '0.9rem', color: 'var(--primary)'}}>Processing... {progress}%</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {text && !isExtracting && (
              <motion.div 
                className="results-area"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring" }}
              >
                <div className="toolbar" style={{marginTop: '2rem'}}>
                  <span className="char-count"><FileText size={14} inline/> {text.length} chars</span>
                  <div className="actions">
                    <motion.button onClick={copyToClipboard} whileHover={{scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)'}}><Copy size={18}/></motion.button>
                    <motion.button onClick={downloadText} whileHover={{scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)'}}><Download size={18}/></motion.button>
                  </div>
                </div>

                <div className="split-view">
                  <textarea className="text-editor" value={text} onChange={(e) => setText(e.target.value)} spellCheck="false"/>
                  
                  <div className="ai-sidebar">
                    {/* HEAVY ANIMATION APPLIED HERE: 'pulsing' class */}
                    <motion.button 
                      className={`ai-btn ${isSummarizing ? 'pulsing' : ''}`}
                      onClick={handleSummarize}
                      disabled={isSummarizing}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSummarizing ? <Loader2 className="spin" /> : <Sparkles />}
                      {isSummarizing ? 'AI Thinking...' : 'AI Summarize'}
                    </motion.button>

                    <AnimatePresence>
                      {summary && (
                        <motion.div 
                          className="summary-box"
                          initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, filter: 'blur(10px)' }}
                          transition={{ duration: 0.5 }}
                        >
                          <h4><CheckCircle2 size={16} color="#00ff9d"/> Llama 3 Summary</h4>
                          <div className="summary-content">{summary}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </section>
    </div>
  );
}

export default App;