import React, { useState, useEffect } from 'react';
import Canvas from './Canvas';
import ToggleSwitch from './ToggleSwitch';
import Sidebar from './Sidebar';
import TopNavBar from './TopNavBar';
import DataCollectionPanel from './DataCollectionPanel';
import './PolygonEditor.css';

// Industrial warehouse image for the camera feed
const cameraImage = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

const PolygonEditor = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isRemoveMode, setIsRemoveMode] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Data collection settings
    const [editROI, setEditROI] = useState(true);
    const [confidence, setConfidence] = useState(75);
    const [detectFrames, setDetectFrames] = useState(30);
    const [intervalFrames, setIntervalFrames] = useState(5);
    const [motionDetection, setMotionDetection] = useState(true);
    const [minMotionArea, setMinMotionArea] = useState(100);

    return (
        <div className="polygon-editor">
            <TopNavBar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
            <div className="main-layout">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    mobileOpen={mobileMenuOpen}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                    onMobileClose={() => setMobileMenuOpen(false)}
                />
                <div className={`content-area ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                    <div className="page-header">
                        {/* <div className="breadcrumb">
                            <span>Home</span> &gt; <span>Camera</span> &gt; <span>Dashboard</span> &gt; <span className="current">Camera Zone Edit</span>
                        </div> */}
                        <h1>Camera Zone Edit</h1>
                    </div>

                    <div className="main-content">
                        <div className="left-content-panel">
                            <DataCollectionPanel
                                editROI={editROI}
                                setEditROI={setEditROI}
                                confidence={confidence}
                                setConfidence={setConfidence}
                                detectFrames={detectFrames}
                                setDetectFrames={setDetectFrames}
                                intervalFrames={intervalFrames}
                                setIntervalFrames={setIntervalFrames}
                                motionDetection={motionDetection}
                                setMotionDetection={setMotionDetection}
                                minMotionArea={minMotionArea}
                                setMinMotionArea={setMinMotionArea}
                                isEditMode={isEditMode}
                                setIsEditMode={setIsEditMode}
                                isRemoveMode={isRemoveMode}
                                setIsRemoveMode={setIsRemoveMode}
                                isAddMode={isAddMode}
                                setIsAddMode={setIsAddMode}
                            />
                        </div>
                        <div className="right-content-panel">
                            <Canvas
                                selectedImage={cameraImage}
                                isEditMode={isEditMode}
                                isRemoveMode={isRemoveMode}
                                isAddMode={isAddMode}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolygonEditor; 