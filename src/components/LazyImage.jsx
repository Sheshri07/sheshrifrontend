import React, { useState, useEffect, useRef } from 'react';

/**
 * A reusable component for lazy loading images.
 * Uses IntersectionObserver for modern browsers and loading="lazy" as a fallback.
 */
const LazyImage = ({
    src,
    alt,
    className = "",
    placeholderSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E",
    effect = "fade-in",
    threshold = 0.1,
    rootMargin = "200px",
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        // If IntersectionObserver is not supported, load immediately
        if (!window.IntersectionObserver) {
            setIsInView(true);
            return;
        }

        const callback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(callback, {
            threshold,
            rootMargin
        });

        const currentRef = imgRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold, rootMargin]);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    return (
        <div
            ref={imgRef}
            className={`relative overflow-hidden ${className}`}
            {...props}
        >
            {/* Placeholder image or background */}
            {!isLoaded && (
                <div
                    className="absolute inset-0 bg-gray-100 animate-pulse transition-opacity duration-300"
                    style={{ opacity: isLoaded ? 0 : 1 }}
                />
            )}

            {/* The actual image */}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={handleLoad}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                />
            )}
        </div>
    );
};

export default LazyImage;
