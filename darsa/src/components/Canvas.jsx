import React, { useState, useRef, useEffect } from 'react';
import './Canvas.css';

const Canvas = ({ selectedImage, isRemoveMode, isEditMode, isAddMode }) => {
    const [polygons, setPolygons] = useState([]);
    const [currentPolygon, setCurrentPolygon] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const svgRef = useRef(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [draggedPointIndex, setDraggedPointIndex] = useState(null);
    const [draggedPolygonIndex, setDraggedPolygonIndex] = useState(null);
    const [isPolygonDragging, setIsPolygonDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(null);
    const [hoveredPolygonIndex, setHoveredPolygonIndex] = useState(null);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

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

        if (isDrawing) {
            // Add point to current polygon
            const newPoint = { x, y };
            setCurrentPolygon(prev => [...prev, newPoint]);
        } else {
            // Start new polygon
            setIsDrawing(true);
            setCurrentPolygon([{ x, y }]);
        }
    };

    const handlePointClick = (polygonIndex, pointIndex, event) => {
        event.stopPropagation();

        if (isRemoveMode) {
            // Remove point from polygon
            setPolygons(prevPolygons => {
                const newPolygons = [...prevPolygons];
                newPolygons[polygonIndex] = newPolygons[polygonIndex].filter((_, i) => i !== pointIndex);

                // Remove polygon if it has less than 3 points
                if (newPolygons[polygonIndex].length < 3) {
                    return newPolygons.filter((_, i) => i !== polygonIndex);
                }

                return newPolygons;
            });
        }
    };

    const handleCurrentPointClick = (pointIndex, event) => {
        event.stopPropagation();

        if (isRemoveMode) {
            // Remove point from current polygon
            setCurrentPolygon(prev => prev.filter((_, i) => i !== pointIndex));
        }
    };

    const handlePointMouseDown = (polygonIndex, pointIndex, event) => {
        if (!isEditMode) return;
        event.stopPropagation();
        setDraggedPointIndex(pointIndex);
        setDraggedPolygonIndex(polygonIndex);
        setSelectedPolygonIndex(polygonIndex);
    };

    const handleCurrentPointMouseDown = (pointIndex, event) => {
        if (!isEditMode) return;
        event.stopPropagation();
        setDraggedPointIndex(pointIndex);
        setDraggedPolygonIndex(-1); // -1 indicates current polygon
    };

    const handleMouseMove = (event) => {
        if (draggedPointIndex === null) return;
        const { x, y } = getRelativeCoords(event);

        if (draggedPolygonIndex === -1) {
            // Update current polygon
            setCurrentPolygon(prev => prev.map((pt, i) =>
                i === draggedPointIndex ? { x, y } : pt
            ));
        } else {
            // Update completed polygon
            setPolygons(prev => prev.map((polygon, polygonIdx) =>
                polygonIdx === draggedPolygonIndex
                    ? polygon.map((pt, pointIdx) =>
                        pointIdx === draggedPointIndex ? { x, y } : pt
                    )
                    : polygon
            ));
        }
    };

    const handleMouseUp = () => {
        if (draggedPointIndex !== null) {
            setDraggedPointIndex(null);
            setDraggedPolygonIndex(null);
        }
    };

    const handlePolygonMouseDown = (polygonIndex, event) => {
        if (!isEditMode) return;
        event.stopPropagation();
        const { x, y } = getRelativeCoords(event);
        setIsPolygonDragging(true);
        setSelectedPolygonIndex(polygonIndex);
        setDragStart({
            x,
            y,
            polygon: [...polygons[polygonIndex]],
            polygonIndex
        });
    };

    const handlePolygonMouseMove = (event) => {
        if (!isPolygonDragging || !dragStart) return;
        const { x, y } = getRelativeCoords(event);
        const dx = x - dragStart.x;
        const dy = y - dragStart.y;

        setPolygons(prev => prev.map((polygon, idx) =>
            idx === dragStart.polygonIndex
                ? dragStart.polygon.map(pt => ({ x: pt.x + dx, y: pt.y + dy }))
                : polygon
        ));
    };

    const handlePolygonMouseUp = () => {
        if (isPolygonDragging) {
            setIsPolygonDragging(false);
            setDragStart(null);
        }
    };

    const handlePolygonClick = (polygonIndex, event) => {
        event.stopPropagation();

        if (isRemoveMode) {
            // Remove entire polygon
            setPolygons(prev => prev.filter((_, i) => i !== polygonIndex));
            setSelectedPolygonIndex(null);
        } else if (isAddMode && !isDrawing) {
            // Add point to existing polygon at click location
            const { x, y } = getRelativeCoords(event);
            const polygon = polygons[polygonIndex];

            // Find the best edge to insert the new point
            let bestEdgeIndex = 0;
            let minDistance = Infinity;

            for (let i = 0; i < polygon.length; i++) {
                const p1 = polygon[i];
                const p2 = polygon[(i + 1) % polygon.length];

                // Calculate distance from click point to edge
                const distance = distanceToLineSegment(x, y, p1.x, p1.y, p2.x, p2.y);

                if (distance < minDistance) {
                    minDistance = distance;
                    bestEdgeIndex = i + 1;
                }
            }

            // Insert new point after the best edge
            setPolygons(prev => prev.map((poly, idx) => {
                if (idx === polygonIndex) {
                    const newPolygon = [...poly];
                    newPolygon.splice(bestEdgeIndex, 0, { x, y });
                    return newPolygon;
                }
                return poly;
            }));

            setSelectedPolygonIndex(polygonIndex);
        }
    };

    // Helper function to calculate distance from point to line segment
    const distanceToLineSegment = (px, py, x1, y1, x2, y2) => {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        if (lenSq !== 0) {
            param = dot / lenSq;
        }

        let xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const completePolygon = () => {
        if (currentPolygon.length >= 3) {
            setPolygons(prev => [...prev, currentPolygon]);
            setCurrentPolygon([]);
            setIsDrawing(false);
        }
    };

    const cancelCurrentPolygon = () => {
        setCurrentPolygon([]);
        setIsDrawing(false);
    };

    useEffect(() => {
        // Reset polygons when image changes
        setPolygons([]);
        setCurrentPolygon([]);
        setIsDrawing(false);
        setSelectedPolygonIndex(null);
    }, [selectedImage]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter' && isDrawing && currentPolygon.length >= 3) {
                completePolygon();
            } else if (event.key === 'Escape' && isDrawing) {
                cancelCurrentPolygon();
            } else if (event.key === 'Delete' && selectedPolygonIndex !== null) {
                setPolygons(prev => prev.filter((_, i) => i !== selectedPolygonIndex));
                setSelectedPolygonIndex(null);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isDrawing, currentPolygon, selectedPolygonIndex]);

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

    const formatDateTime = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = dayNames[date.getDay()];

        return `${day}-${month}-${year} ${dayName} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className="camera-preview-container">
            <div className="camera-overlay-top">
                <div className="collection-zone-label">Collection Zone</div>
                <div className="timestamp">{formatDateTime(currentTime)}</div>
            </div>

            {/* Control Panel */}
            <div className="canvas-controls">
                <div className="mode-indicator">
                    {isAddMode && (
                        <span className="mode-badge add-mode">
                            ✏️ Add Mode {isDrawing && `(${currentPolygon.length} points)`}
                        </span>
                    )}
                    {isEditMode && (
                        <span className="mode-badge edit-mode">
                            ✋ Edit Mode
                        </span>
                    )}
                    {isRemoveMode && (
                        <span className="mode-badge remove-mode">
                            🗑️ Remove Mode
                        </span>
                    )}
                </div>

                {isDrawing && (
                    <div className="drawing-controls">
                        <button
                            className="control-btn complete-btn"
                            onClick={completePolygon}
                            disabled={currentPolygon.length < 3}
                        >
                            Complete Polygon (Enter)
                        </button>
                        <button
                            className="control-btn cancel-btn"
                            onClick={cancelCurrentPolygon}
                        >
                            Cancel (Esc)
                        </button>
                    </div>
                )}

                <div className="polygon-info">
                    <span>Polygons: {polygons.length}</span>
                    {selectedPolygonIndex !== null && (
                        <span>Selected: Zone {selectedPolygonIndex + 1}</span>
                    )}
                </div>
            </div>

            <div className="canvas-container">
                <img
                    src={selectedImage}
                    alt="Camera Feed"
                    className="main-image"
                    onLoad={handleImageLoad}
                />
                <svg
                    ref={svgRef}
                    className={`overlay-svg ${isAddMode ? 'add-mode' : ''}`}
                    onClick={handleCanvasClick}
                    style={{ width: imageDimensions.width, height: imageDimensions.height }}
                >
                    {/* Render completed polygons */}
                    {polygons.map((polygon, polygonIndex) => (
                        <g key={`polygon-${polygonIndex}`}>
                            <polygon
                                points={polygon.map(p => `${p.x},${p.y}`).join(' ')}
                                className={`polygon ${selectedPolygonIndex === polygonIndex ? 'selected' : ''}`}
                                onMouseDown={(e) => handlePolygonMouseDown(polygonIndex, e)}
                                onClick={(e) => handlePolygonClick(polygonIndex, e)}
                                onMouseEnter={() => setHoveredPolygonIndex(polygonIndex)}
                                onMouseLeave={() => setHoveredPolygonIndex(null)}
                                style={{
                                    cursor: isEditMode ? 'move' : (isRemoveMode || (isAddMode && !isDrawing)) ? 'pointer' : 'default',
                                    stroke: selectedPolygonIndex === polygonIndex ? 'var(--secondary-color)' : 'var(--primary-color)',
                                    fill: selectedPolygonIndex === polygonIndex ? 'rgba(248, 112, 96, 0.1)' : 'rgba(13, 44, 84, 0.1)',
                                    strokeWidth: selectedPolygonIndex === polygonIndex ? 3 : 2
                                }}
                            />
                            {/* Render polygon points */}
                            {polygon.map((point, pointIndex) => (
                                <circle
                                    key={`point-${polygonIndex}-${pointIndex}`}
                                    cx={point.x}
                                    cy={point.y}
                                    r="6"
                                    className="polygon-handle"
                                    onClick={(e) => handlePointClick(polygonIndex, pointIndex, e)}
                                    onMouseDown={(e) => handlePointMouseDown(polygonIndex, pointIndex, e)}
                                    style={{
                                        cursor: isEditMode ? 'move' : isRemoveMode ? 'pointer' : 'default',
                                        fill: '#fff',
                                        stroke: selectedPolygonIndex === polygonIndex ? 'var(--secondary-color)' : 'var(--primary-color)',
                                        strokeWidth: 2
                                    }}
                                />
                            ))}
                            {/* Polygon label */}
                            {polygon.length >= 3 && (
                                <text
                                    x={polygon.reduce((sum, p) => sum + p.x, 0) / polygon.length}
                                    y={polygon.reduce((sum, p) => sum + p.y, 0) / polygon.length}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="polygon-label"
                                    style={{
                                        fill: selectedPolygonIndex === polygonIndex ? '#f97316' : '#3b82f6',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        pointerEvents: 'none'
                                    }}
                                >
                                    Zone {polygonIndex + 1}
                                </text>
                            )}
                        </g>
                    ))}

                    {/* Render current polygon being drawn */}
                    {currentPolygon.length > 0 && (
                        <g>
                            {currentPolygon.length > 2 && (
                                <polygon
                                    points={currentPolygon.map(p => `${p.x},${p.y}`).join(' ')}
                                    className="current-polygon"
                                    style={{
                                        stroke: '#f97316',
                                        fill: 'rgba(249, 115, 22, 0.2)',
                                        strokeWidth: 2,
                                        strokeDasharray: '5,5'
                                    }}
                                />
                            )}
                            {currentPolygon.length > 1 && currentPolygon.length <= 2 && (
                                <polyline
                                    points={currentPolygon.map(p => `${p.x},${p.y}`).join(' ')}
                                    style={{
                                        stroke: '#f97316',
                                        strokeWidth: 2,
                                        fill: 'none',
                                        strokeDasharray: '5,5'
                                    }}
                                />
                            )}
                            {/* Render current polygon points */}
                            {currentPolygon.map((point, pointIndex) => (
                                <circle
                                    key={`current-point-${pointIndex}`}
                                    cx={point.x}
                                    cy={point.y}
                                    r="6"
                                    className="polygon-handle current"
                                    onClick={(e) => handleCurrentPointClick(pointIndex, e)}
                                    onMouseDown={(e) => handleCurrentPointMouseDown(pointIndex, e)}
                                    style={{
                                        cursor: isEditMode ? 'move' : isRemoveMode ? 'pointer' : 'default',
                                        fill: '#fff',
                                        stroke: 'var(--secondary-color)',
                                        strokeWidth: 2
                                    }}
                                />
                            ))}
                        </g>
                    )}
                </svg>
            </div>
        </div>
    );
};

export default Canvas; 