/**
 * Loom Video Integration
 * 
 * Handles embedding and tracking Loom videos
 * Loom provides embed codes and API access
 */

class LoomService {
    constructor() {
        this.apiKey = process.env.LOOM_API_KEY || null;
        this.baseUrl = 'https://api.loom.com/v1';
    }

    /**
     * Extract Loom video ID from URL
     * Supports formats:
     * - https://www.loom.com/share/{id}
     * - https://loom.com/share/{id}
     * - {id}
     */
    extractVideoId(url) {
        if (!url) return null;
        
        // If it's already just an ID
        if (!url.includes('loom.com')) {
            return url;
        }

        // Extract from URL
        const match = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
        return match ? match[1] : null;
    }

    /**
     * Generate Loom embed URL
     */
    getEmbedUrl(videoId) {
        const id = this.extractVideoId(videoId);
        if (!id) return null;
        
        return `https://www.loom.com/embed/${id}`;
    }

    /**
     * Generate Loom iframe embed code
     */
    getEmbedCode(videoId, options = {}) {
        const embedUrl = this.getEmbedUrl(videoId);
        if (!embedUrl) return null;

        const {
            width = '100%',
            height = '600px',
            frameborder = '0',
            allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
            allowfullscreen = true
        } = options;

        return {
            url: embedUrl,
            iframe: `<iframe width="${width}" height="${height}" src="${embedUrl}" frameborder="${frameborder}" allow="${allow}" allowfullscreen></iframe>`
        };
    }

    /**
     * Get video metadata via Loom API (if API key available)
     */
    async getVideoMetadata(videoId) {
        if (!this.apiKey) {
            return { success: false, error: 'Loom API key not configured' };
        }

        try {
            const id = this.extractVideoId(videoId);
            const response = await fetch(`${this.baseUrl}/videos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Loom API error: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                success: true,
                video: {
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    duration: data.duration,
                    thumbnail: data.thumbnailUrl,
                    embedUrl: this.getEmbedUrl(id),
                    createdAt: data.createdAt
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Validate Loom video URL
     */
    isValidLoomUrl(url) {
        if (!url) return false;
        return /loom\.com\/share\/[a-zA-Z0-9]+/.test(url) || /^[a-zA-Z0-9]+$/.test(url);
    }
}

export default new LoomService();
