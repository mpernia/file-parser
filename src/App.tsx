import React, { useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { DocumentPreview } from './components/DocumentPreview';
import { Search } from 'lucide-react';
import { analyzeDocument } from './services/api';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setAnalysisResults(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    
    try {
      const results = await analyzeDocument(selectedFile);
      setAnalysisResults(results);
      toast.success('Análisis completado');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al analizar el documento');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Analizador de Documentos
          </h1>
          <p className="mt-2 text-gray-600">
            Sube un documento para analizar su contenido
          </p>
        </div>

        <FileUploader onFileSelect={handleFileSelect} />

        {selectedFile && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Documento: {selectedFile.name}
              </h2>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md
                  ${isAnalyzing
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'}
                  text-white transition-colors
                `}
              >
                <Search className="w-4 h-4" />
                <span>
                  {isAnalyzing ? 'Analizando...' : 'Analizar'}
                </span>
              </button>
            </div>

            <DocumentPreview
              file={selectedFile}
              analysisResults={analysisResults}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;