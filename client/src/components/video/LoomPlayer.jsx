import React, { useState, useEffect } from 'react';
import { PlayCircle, Loader2 } from 'lucide-react';

/**
 * Loom Video Player Component
 * 
 * Embeds Loom videos with loading states and error handling
 * Supports both Loom URLs and video IDs
 */
const LoomPlayer = ({ videoId, videoUrl, title, className = '', autoplay = false }) => {
    const [embedUrl, setEmbedUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Extract video ID from URL or use provided ID
        let id = videoId;
        
        if (videoUrl && !id) {
            // Extract from Loom URL
            const match = videoUrl.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
            id = match ? match[1] : videoUrl;
        }

        if (!id) {
            setError('No video ID provided');
            setIsLoading(false);
            return;
        }

        // Generate embed URL
        const embed = `https://www.loom.com/embed/${id}${autoplay ? '?autoplay=true' : ''}`;
        setEmbedUrl(embed);
    }, [videoId, videoUrl, autoplay]);

    if (error) {
        return (
            <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
                <p className="text-red-600">Error loading video: {error}</p>
            </div>
        );
    }

    return (
        <div className={`relative w-full ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                    <Loader2 className="w-8 h-8 animate-spin text-sofluent-pink" />
                </div>
            )}
            
            {embedUrl && (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
                    <iframe
                        src={embedUrl}
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => setIsLoading(false)}
                        title={title || 'Loom Video'}
                    />
                </div>
            )}
        </div>
    );
};

export default LoomPlayer;
