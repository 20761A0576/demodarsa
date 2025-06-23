import React, { useState, useRef, useEffect } from 'react';
import './Canvas.css';

const Canvas = ({ selectedImage, isRemoveMode, isEditMode, isAddMode }) => {
    const [points, setPoints] = useState([]);
    const svgRef = useRef(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [draggedPointIndex, setDraggedPointIndex] = useState(null);
    const [isPolygonDragging, setIsPolygonDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);

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

    const handlePolygonMouseDown = (event) => {
        if (!isEditMode) return;
        event.stopPropagation();
        const { x, y } = getRelativeCoords(event);
        setIsPolygonDragging(true);
        setDragStart({ x, y, points: [...points] });
    };

    const handlePolygonMouseMove = (event) => {
        if (!isPolygonDragging || !dragStart) return;
        const { x, y } = getRelativeCoords(event);
        const dx = x - dragStart.x;
        const dy = y - dragStart.y;
        setPoints(dragStart.points.map(pt => ({ x: pt.x + dx, y: pt.y + dy })));
    };

    const handlePolygonMouseUp = () => {
        if (isPolygonDragging) {
            setIsPolygonDragging(false);
            setDragStart(null);
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
        if (isPolygonDragging) {
            window.addEventListener('mousemove', handlePolygonMouseMove);
            window.addEventListener('mouseup', handlePolygonMouseUp);
            return () => {
                window.removeEventListener('mousemove', handlePolygonMouseMove);
                window.removeEventListener('mouseup', handlePolygonMouseUp);
            };
        }
    }, [draggedPointIndex, isPolygonDragging]);

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
                className={`overlay-svg ${isAddMode ? 'add-mode' : ''}`}
                onClick={handleCanvasClick}
                style={{ width: imageDimensions.width, height: imageDimensions.height }}
            >
                {points.length > 1 && (
                    <>
                        <polygon
                            points={points.map(p => `${p.x},${p.y}`).join(' ')}
                            className="polygon"
                            onMouseDown={handlePolygonMouseDown}
                            style={{ cursor: isEditMode ? 'move' : 'default', stroke: '#00C853', fill: 'rgba(0,200,83,0.08)' }}
                        />
                        {points.map((point, index) => (
                            <rect
                                key={index}
                                x={point.x - 6}
                                y={point.y - 6}
                                width={12}
                                height={12}
                                className="polygon-handle"
                                onClick={(e) => handlePointClick(index, e)}
                                onMouseDown={(e) => handlePointMouseDown(index, e)}
                                style={{ cursor: isEditMode ? 'move' : 'pointer', fill: '#fff', stroke: '#00C853', strokeWidth: 2 }}
                            />
                        ))}
                        {(() => {
                            if (points.length < 2) return null;
                            let minY = Math.min(...points.map(p => p.y));
                            let topEdgeIdx = points.findIndex(p => p.y === minY);
                            let nextIdx = (topEdgeIdx + 1) % points.length;
                            let x1 = points[topEdgeIdx].x, y1 = points[topEdgeIdx].y;
                            let x2 = points[nextIdx].x, y2 = points[nextIdx].y;
                            let labelX = (x1 + x2) / 2;
                            let labelY = (y1 + y2) / 2 - 18;
                            return (
                                <g>
                                    <rect x={labelX - 60} y={labelY - 18} width={120} height={32} rx={6} fill="#00C853" />
                                    <text x={labelX} y={labelY} fill="#fff" fontSize="18" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">
                                        Collection Zone
                                    </text>
                                </g>
                            );
                        })()}
                    </>
                )}
            </svg>
        </div>
    );
};

export default Canvas; 