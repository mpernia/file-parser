import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface AnalysisError {
  type: 'spelling' | 'grammar';
  word?: string;
  text?: string;
  description: string;
  suggestions: string[];
}

interface AnalysisResult {
  text: string;
  errors: AnalysisError[];
}

interface DocumentPreviewProps {
  file: File | null;
  analysisResults: AnalysisResult[] | null;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ file, analysisResults }) => {
  if (!file) return null;

  const renderPreview = () => {
    if (file.type === 'application/pdf') {
      return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <div style={{ height: '750px' }}>
            <Viewer fileUrl={URL.createObjectURL(file)} />
          </div>
        </Worker>
      );
    }

    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-600">Vista previa no disponible para este tipo de archivo.</p>
        <p className="text-sm text-gray-500 mt-2">Nombre: {file.name}</p>
      </div>
    );
  };

  const renderError = (error: AnalysisError) => {
    const errorText = error.word || error.text;
    const errorClass = error.type === 'spelling' ? 'border-yellow-400 bg-yellow-50' : 'border-red-400 bg-red-50';

    return (
      <div className={`p-3 border-l-4 ${errorClass} rounded`}>
        <p className="text-gray-700">
          <span className="font-medium">Texto:</span> {errorText}
        </p>
        <p className="text-gray-600 text-sm mt-1">
          <span className="font-medium">Tipo:</span> {error.description}
        </p>
        {error.suggestions.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-600">Sugerencias:</p>
            <ul className="list-disc list-inside text-sm text-green-600 mt-1">
              {error.suggestions.map((suggestion, idx) => (
                <li key={idx}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderPreview()}
      {analysisResults && analysisResults.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Resultados del análisis</h3>
          <div className="space-y-4">
            {analysisResults.map((result, index) => (
              <div key={index} className="space-y-3">
                <p className="text-gray-700 font-medium">Oración analizada:</p>
                <p className="text-gray-600 italic mb-2">{result.text}</p>
                <div className="space-y-2">
                  {result.errors.map((error, errorIndex) => (
                    <div key={errorIndex}>{renderError(error)}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};