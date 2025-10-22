import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { identifyPlant } from './services/geminiService';
import type { PlantData } from './types';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [plantData, setPlantData] = useState<PlantData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (file: File) => {
    setImageFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
    setPlantData(null);
    setError(null);
  };

  const handleIdentifyClick = useCallback(async () => {
    if (!imageFile) {
      setError('Please select an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPlantData(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        if (base64String) {
          const result = await identifyPlant(base64String, imageFile.type);
          if (!result.isPlant) {
            throw new Error("The uploaded image does not appear to be a plant or could not be identified.");
          }
          setPlantData(result);
        } else {
          throw new Error('Failed to convert image to Base64.');
        }
        setIsLoading(false);
      };
      reader.onerror = () => {
        setIsLoading(false);
        throw new Error('Error reading the image file.');
      };
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="container">
      <Header />
      <main>
        <div className="main-grid">
          <div className="card">
            <h2 className="card-title">🌿 Upload Plant Image</h2>
            <ImageUploader onImageChange={handleImageChange} />
             <p style={{marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center'}}>
                Supports JPG, PNG, WEBP • Max 10MB • Best results with clear, well-lit images
            </p>
          </div>

          <div className="card">
            <h2 className="card-title">👁️ Preview & Analysis</h2>
            {previewUrl ? (
                <img src={previewUrl} alt="Plant preview" className="image-preview" />
            ) : (
                <div className="preview-placeholder">
                    <p>Your image will appear here</p>
                </div>
            )}
            
            {imageFile && (
                <div className="file-info">
                    <div className="file-detail">
                        <span>Filename:</span>
                        <span>{imageFile.name}</span>
                    </div>
                    <div className="file-detail">
                        <span>Size:</span>
                        <span>{(imageFile.size / 1024).toFixed(2)} KB</span>
                    </div>
                    <div className="file-detail">
                        <span>Type:</span>
                        <span>{imageFile.type}</span>
                    </div>
                </div>
            )}

            <button
              className="btn-primary"
              onClick={handleIdentifyClick}
              disabled={!imageFile || isLoading}
              style={{ width: '100%'}}
            >
              {isLoading ? 'Analyzing...' : '🔬 Analyze with AI'}
            </button>
          </div>
        </div>

        {(isLoading || error || plantData) && (
            <div className="card analysis-panel">
                {isLoading && <Loader />}
                {error && !isLoading && (
                    <div className="error-state">
                        <div className="error-title">Analysis Failed</div>
                        <div className="error-message">{error}</div>
                    </div>
                )}
                {plantData && !isLoading && !error && <ResultDisplay data={plantData} />}
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
