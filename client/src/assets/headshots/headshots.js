/**
 * So Fluent Headshots Mapping
 * 
 * Source: https://drive.google.com/drive/folders/1al6GyDwIFla5fnQ7z5BcNIcX-tPu8DV7
 * 
 * After downloading headshots from Google Drive, import them here:
 * 
 * Example:
 * import headshot1 from './IMG_0005.jpg';
 * import headshot2 from './IMG_0011.jpg';
 * 
 * Then add to the headshots array below.
 */

// Placeholder - Replace with actual imports after downloading
const headshots = [
  // Add headshot imports here after downloading from Google Drive
  // Example: headshot1, headshot2, headshot3, etc.
];

// Export headshots array for use in components
export const availableHeadshots = headshots;

// Helper function to get a random headshot
export const getRandomHeadshot = () => {
  if (headshots.length === 0) {
    // Fallback to placeholder if no headshots available
    return '/placeholder-headshot.png';
  }
  return headshots[Math.floor(Math.random() * headshots.length)];
};

// Helper function to get headshot by index
export const getHeadshotByIndex = (index) => {
  if (headshots.length === 0 || index >= headshots.length) {
    return '/placeholder-headshot.png';
  }
  return headshots[index];
};
