import React, { useState, useRef, useEffect } from 'react';
import './Canvas.css';

const Canvas = ({ selectedImage, isRemoveMode, isEditMode, isAddMode }) => {
    const [points, setPoints] = useState([]);
    const svgRef = useRef(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [draggedPointIndex, setDraggedPointIndex] = useState(null);

    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight, width, height } = e.target;
        const aspectRatio = naturalWidth / naturalHeight;
        const newWidth = width;
        const newHeight = newWidth / aspectRatio;
        
        if(newHeight > height) {
            setImageDimensions({ width: height * aspectRatio, height: height });
        } else {
            setImageDimensions({ width: newWidth, height: newHeight });
        }
    };

    const getRelativeCoords = (event) => {
        const svg = svgRef.current;
        if (!svg) return { x: 0, y: 0 };
        const rect = svg.getBoundingClientRect();
        const scaleX = imageDimensions.width / rect.width;
        const scaleY = imageDimensions.height / rect.height;
        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY,
        };
    };

    const handleCanvasClick = (event) => {
        if (!isAddMode) return;
        const { x, y } = getRelativeCoords(event);
        setPoints([...points, { x, y }]);
    };

    const handlePointClick = (index, event) => {
        event.stopPropagation();
        if (isRemoveMode) {
            setPoints(points.filter((_, i) => i !== index));
        }
    };

    const handlePointMouseDown = (index, event) => {
        if (!isEditMode) return;
        event.stopPropagation();
        setDraggedPointIndex(index);
    };

    const handleMouseMove = (event) => {
        if (draggedPointIndex === null) return;
        const { x, y } = getRelativeCoords(event);
        setPoints(points => points.map((pt, i) => i === draggedPointIndex ? { x, y } : pt));
    };

    const handleMouseUp = () => {
        if (draggedPointIndex !== null) {
            setDraggedPointIndex(null);
        }
    };

    useEffect(() => {
        setPoints([]);
    }, [selectedImage]);

    useEffect(() => {
        if (draggedPointIndex !== null) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [draggedPointIndex]);

    return (
        <div className="canvas-container">
            <img 
                src={selectedImage} 
                alt="main" 
                className="main-image" 
                onLoad={handleImageLoad}
            />
            <svg
                ref={svgRef}
                className="overlay-svg"
                onClick={handleCanvasClick}
                style={{ width: imageDimensions.width, height: imageDimensions.height }}
            >
                {points.length > 1 && (
                    <polygon
                        points={points.map(p => `${p.x},${p.y}`).join(' ')}
                        className="polygon"
                    />
                )}
                {points.map((point, index) => (
                    <circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="5"
                        className="polygon-point"
                        onClick={(e) => handlePointClick(index, e)}
                        onMouseDown={(e) => handlePointMouseDown(index, e)}
                        style={{ cursor: isEditMode ? 'move' : 'pointer' }}
                    />
                ))}
            </svg>
        </div>
    );
};

export default Canvas; 