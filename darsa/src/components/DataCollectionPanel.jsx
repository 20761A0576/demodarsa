import React from 'react';
import ToggleSwitch from './ToggleSwitch';
import './DataCollectionPanel.css';

const DataCollectionPanel = ({
    editROI,
    setEditROI,
    confidence,
    setConfidence,
    detectFrames,
    setDetectFrames,
    intervalFrames,
    setIntervalFrames,
    motionDetection,
    setMotionDetection,
    minMotionArea,
    setMinMotionArea,
    isEditMode,
    setIsEditMode,
    isRemoveMode,
    setIsRemoveMode,
    isAddMode,
    setIsAddMode
}) => {
    return (
        <div className="data-collection-panel">
            <h3 className="panel-title">Data Collection</h3>
            
            <div className="control-group">
                <div className="control-item">
                    <label className="control-label">Edit ROI</label>
                    <ToggleSwitch
                        isChecked={!editROI}
                        onChange={() => {
                            setEditROI(!editROI);
                            if(!editROI){
                                setIsEditMode(false);
                            }else{
                                setIsEditMode(true);
                            }
                            setIsRemoveMode(false);
                            setIsAddMode(false);
                        }

                        }
                    />
                </div>
            </div>

            <div className="control-group">
                <div className="control-item">
                    <label className="control-label">Confidence</label>
                    <div className="slider-container">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={confidence}
                            onChange={(e) => setConfidence(parseInt(e.target.value))}
                            className="confidence-slider"
                        />
                        <div className="slider-value">{confidence}%</div>
                    </div>
                </div>
            </div>

            <div className="control-group">
                <div className="control-item">
                    <label className="control-label">Detect Frames</label>
                    <div className="number-input-container">
                        <input
                            type="number"
                            value={detectFrames}
                            onChange={(e) => setDetectFrames(parseInt(e.target.value) || 0)}
                            className="number-input"
                        />
                        <span className="input-suffix">F</span>
                    </div>
                </div>
            </div>

            <div className="control-group">
                <div className="control-item">
                    <label className="control-label">Interval Frames</label>
                    <div className="number-input-container">
                        <input
                            type="number"
                            value={intervalFrames}
                            onChange={(e) => setIntervalFrames(parseInt(e.target.value) || 0)}
                            className="number-input"
                        />
                        <span className="input-suffix">F</span>
                    </div>
                </div>
            </div>

            <div className="control-group">
                <div className="control-item">
                    <label className="control-label">Motion Detection</label>
                    <ToggleSwitch
                        isChecked={motionDetection}
                        onChange={() => setMotionDetection(!motionDetection)}
                    />
                </div>
            </div>

            <div className="control-group">
                <div className="control-item">
                    <label className="control-label">Min Motion Area</label>
                    <div className="number-input-container">
                        <input
                            type="number"
                            value={minMotionArea}
                            onChange={(e) => setMinMotionArea(parseInt(e.target.value) || 0)}
                            className="number-input"
                        />
                        <span className="input-suffix">F</span>
                    </div>
                </div>
            </div>

            <div className="control-group">
                <div className="control-item">
                    <label className="control-label">Polygon Tools</label>
                    <div className="polygon-tools">
                        <button
                            className={`tool-btn ${isAddMode ? 'active' : ''}`}
                            onClick={() => {
                                setIsAddMode(!isAddMode);
                                if (!isAddMode) {
                                    setIsEditMode(false);
                                    setIsRemoveMode(false);
                                }
                            }}
                            title="Add new polygon zones or add points to existing zones"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Add
                        </button>
                        <button
                            className={`tool-btn ${isRemoveMode ? 'active' : ''}`}
                            onClick={() => {
                                setIsRemoveMode(!isRemoveMode);
                                if (!isRemoveMode) {
                                    setIsAddMode(false);
                                    setIsEditMode(false);
                                }
                            }}
                            title="Remove polygons or points"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3,6 5,6 21,6"/>
                                <path d="m19,6v14a2,2 0,0 1,-2,2H7a2,2 0,0 1,-2,-2V6m3,0V4a2,2 0,0 1,2,-2h4a2,2 0,0 1,2,2v2"/>
                                <line x1="10" y1="11" x2="10" y2="17"/>
                                <line x1="14" y1="11" x2="14" y2="17"/>
                            </svg>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataCollectionPanel;
