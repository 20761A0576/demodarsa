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
                        isChecked={editROI}
                        onChange={() => setEditROI(!editROI)}
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
                            className={`tool-btn ${isEditMode ? 'active' : ''}`}
                            onClick={() => {
                                setIsEditMode(!isEditMode);
                                if (!isEditMode) {
                                    setIsAddMode(false);
                                    setIsRemoveMode(false);
                                }
                            }}
                            title="Edit existing polygons"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit
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

            <div className="control-group">
                <div className="control-item">
                    <label className="control-label">HandRail Zones</label>
                    <button className="add-zone-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Instructions */}
            <div className="instructions-panel">
                <h4 className="instructions-title">Instructions</h4>
                <div className="instructions-content">
                    {isAddMode && (
                        <ul className="instruction-list">
                            <li>Click on the image to add points for new polygon</li>
                            <li>Click on existing polygon edges to add points to them</li>
                            <li>Create at least 3 points to form a polygon</li>
                            <li>Press <kbd>Enter</kbd> to complete polygon</li>
                            <li>Press <kbd>Esc</kbd> to cancel current polygon</li>
                        </ul>
                    )}
                    {isEditMode && (
                        <ul className="instruction-list">
                            <li>Click and drag points to move them</li>
                            <li>Click and drag polygons to move entire zones</li>
                            <li>Press <kbd>Delete</kbd> to remove selected polygon</li>
                        </ul>
                    )}
                    {isRemoveMode && (
                        <ul className="instruction-list">
                            <li>Click on points to remove them</li>
                            <li>Click on polygons to delete entire zones</li>
                            <li>Polygons with less than 3 points are automatically removed</li>
                        </ul>
                    )}
                    {!isAddMode && !isEditMode && !isRemoveMode && (
                        <p className="instruction-text">
                            Select a tool above to start editing collection zones.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataCollectionPanel;
