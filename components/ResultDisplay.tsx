import React from 'react';
import type { PlantData } from '../types';

interface ResultDisplayProps {
  data: PlantData;
}

const getScoreClass = (score: number) => {
    if (score > 80) return 'score-high';
    if (score > 60) return 'score-medium';
    return 'score-low';
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ data }) => {
  const { identification, alternativeMatches, detailedAnalysis } = data;
  const { botanicalClassification, ayurvedicProfile, doshaEffects, traditionalUses } = detailedAnalysis;

  return (
    <div className="results-container" style={{ display: 'block' }}>
      <div className="result-header">
        <h2 className="result-title">🎯 Identification Complete</h2>
      </div>

      <div className="results-grid">
        <div className="primary-result">
          <div className="plant-name">{identification.plantName}</div>
          <div className="scientific-name">{identification.scientificName} • {identification.alternativeNames.join(' • ')}</div>
          <div className="confidence-badge">
            ✅ {identification.confidence.toFixed(1)}% Confidence
          </div>
          <p className="plant-description">
            {identification.description}
          </p>
          <div className="properties-grid">
            {identification.ayurvedicProperties.map(prop => (
                <div key={prop} className="property-tag">{prop}</div>
            ))}
          </div>
        </div>

        <div className="alternatives-panel">
          <h3 className="alternatives-title">Alternative Matches</h3>
          <div>
            {alternativeMatches.map(match => (
                <div key={match.name} className="alternative-item">
                    <span className="alternative-name">{match.name}</span>
                    <span className={`confidence-score ${getScoreClass(match.confidence)}`}>
                        {match.confidence.toFixed(1)}%
                    </span>
                </div>
            ))}
          </div>
        </div>
      </div>

      <div className="details-panel">
        <h3 className="details-title">📋 Comprehensive Analysis</h3>
        <div className="details-grid">
          <div className="detail-group">
            <h4>Botanical Classification</h4>
            <div className="detail-item"><span>Family:</span><span>{botanicalClassification.family}</span></div>
            <div className="detail-item"><span>Genus:</span><span>{botanicalClassification.genus}</span></div>
            <div className="detail-item"><span>Parts Used:</span><span>{botanicalClassification.partsUsed}</span></div>
            <div className="detail-item"><span>Habitat:</span><span>{botanicalClassification.habitat}</span></div>
          </div>

          <div className="detail-group">
            <h4>Ayurvedic Properties</h4>
            <div className="detail-item"><span>Rasa:</span><span>{ayurvedicProfile.rasa}</span></div>
            <div className="detail-item"><span>Virya:</span><span>{ayurvedicProfile.virya}</span></div>
            <div className="detail-item"><span>Vipaka:</span><span>{ayurvedicProfile.vipaka}</span></div>
            <div className="detail-item"><span>Prabhava:</span><span>{ayurvedicProfile.prabhava}</span></div>
          </div>

          <div className="detail-group">
            <h4>Dosha Effects</h4>
            <div className="detail-item"><span>Vata:</span><span>{doshaEffects.vata}</span></div>
            <div className="detail-item"><span>Pitta:</span><span>{doshaEffects.pitta}</span></div>
            <div className="detail-item"><span>Kapha:</span><span>{doshaEffects.kapha}</span></div>
          </div>

          <div className="detail-group">
            <h4>Traditional Uses</h4>
            <div className="detail-item"><span>Primary:</span><span>{traditionalUses.primary}</span></div>
            <div className="detail-item"><span>Secondary:</span><span>{traditionalUses.secondary}</span></div>
            <div className="detail-item"><span>Dosage:</span><span>{traditionalUses.dosage}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
