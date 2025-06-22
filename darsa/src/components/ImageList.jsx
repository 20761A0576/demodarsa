import React, { useEffect } from 'react';
import './ImageList.css';

const VISIBLE_COUNT = 3;

const ImageList = ({ images, onSelectImage, selectedImage, windowStart, setWindowStart }) => {
    const selectedIndex = images.findIndex(img => img.url === selectedImage);
    const total = images.length;

    useEffect(() => {
        // Center the selected image in the window if possible
        let newStart = selectedIndex - Math.floor(VISIBLE_COUNT / 2);
        if (newStart < 0) newStart = total + newStart; // wrap around left
        if (newStart > total - VISIBLE_COUNT) newStart = newStart % total; // wrap around right
        if (windowStart !== newStart) setWindowStart(newStart);
        // eslint-disable-next-line
    }, [selectedIndex, total]);

    const handlePrev = () => {
        setWindowStart(w => (w - 1 + total) % total);
    };
    const handleNext = () => {
        setWindowStart(w => (w + 1) % total);
    };

    // Get visible images in a circular way
    const visibleImages = [];
    for (let i = 0; i < VISIBLE_COUNT; i++) {
        visibleImages.push(images[(windowStart + i) % total]);
    }

    return (
        <div className="carousel-container">
            <button className="image-arrow" onClick={handlePrev}>&lt;</button>
            <div className="carousel-images">
                {visibleImages.map((img, idx) => {
                    const isCenter = idx === 1; // center image in visibleImages
                    return (
                        <img
                            key={img.id}
                            src={img.url}
                            alt="thumbnail"
                            className={`carousel-thumbnail${isCenter ? ' center' : ''}${selectedImage === img.url ? ' selected' : ''}`}
                            onClick={() => {
                                if (!isCenter) {
                                    // Move window so this image is centered
                                    setWindowStart((windowStart + idx - 1 + total) % total);
                                }
                            }}
                        />
                    );
                })}
            </div>
            <button className="image-arrow" onClick={handleNext}>&gt;</button>
            <div className="carousel-dots">
                {images.map((img, idx) => (
                    <span key={img.id} className={`dot${idx === selectedIndex ? ' active' : ''}`}></span>
                ))}
            </div>
        </div>
    );
};

export default ImageList; 