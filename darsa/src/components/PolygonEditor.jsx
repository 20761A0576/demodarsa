import React, { useState, useEffect } from 'react';
import ImageList from './ImageList';
import Canvas from './Canvas';
import ToggleSwitch from './ToggleSwitch';
import './PolygonEditor.css';
import logo from '../assets/darsa.png';

const dummyImages = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    url: `https://picsum.photos/id/${i + 10}/400/300`,
}));

const PolygonEditor = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isRemoveMode, setIsRemoveMode] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [selectedImage, setSelectedImage] = useState(dummyImages[0].url);
    const [windowStart, setWindowStart] = useState(0);

    useEffect(() => {
        const centerIdx = windowStart + 1; // since VISIBLE_COUNT is 3
        if (dummyImages[centerIdx]) {
            setSelectedImage(dummyImages[centerIdx].url);
        }
    }, [windowStart]);

    return (
        <div className="polygon-editor">
            <header className="editor-header">
                <img src={logo} alt="logo" className="logo" />
            </header>
            <main className="editor-main">
                <div className="left-panel">
                    <ImageList
                        images={dummyImages}
                        selectedImage={selectedImage}
                        onSelectImage={setSelectedImage}
                        windowStart={windowStart}
                        setWindowStart={setWindowStart}
                    />
                    <div className="toggles">
                        <ToggleSwitch
                            label="Edit Mode"
                            isChecked={isEditMode}
                            onChange={() => setIsEditMode(!isEditMode)}
                        />
                        <ToggleSwitch
                            label="Remove Mode"
                            isChecked={isRemoveMode}
                            onChange={() => setIsRemoveMode(!isRemoveMode)}
                        />
                        <ToggleSwitch
                            label="Add Mode"
                            isChecked={isAddMode}
                            onChange={() => setIsAddMode(!isAddMode)}
                        />
                    </div>
                </div>
                <div className="right-panel">
                    <Canvas
                        selectedImage={selectedImage}
                        isEditMode={isEditMode}
                        isRemoveMode={isRemoveMode}
                        isAddMode={isAddMode}
                    />
                </div>
            </main>
        </div>
    );
};

export default PolygonEditor; 