/**
 * Utility function to get the full URL for a company logo
 * @param {string|null} logoPath - The logo path from the database
 * @returns {string|null} - The full URL or null if no logo
 */
export const getLogoUrl = (logoPath) => {
  if (!logoPath) return null;

  const trimmedPath = logoPath.trim();
  if (!trimmedPath) return null;

  // If it's already a full URL (http:// or https://), return as-is
  if (trimmedPath.startsWith("http://") || trimmedPath.startsWith("https://")) {
    return trimmedPath;
  }

  const baseUrl = (import.meta.env.VITE_URI || "http://localhost:8000").replace(
    /\/$/,
    ""
  );

  // Normalize leading slashes
  const normalizedPath = trimmedPath.replace(/^\/+/, "");

  // If the path already points to uploads/, return it with the backend base
  if (normalizedPath.startsWith("uploads/")) {
    return `${baseUrl}/${normalizedPath}`;
  }

  // If the path starts with /uploads/ after normalization
  if (trimmedPath.startsWith("/uploads/")) {
    return `${baseUrl}${trimmedPath}`;
  }

  // Legacy paths that are just filenames (e.g., "google-logo.png")
  // These should be prefixed with /uploads/logo/
  return `${baseUrl}/uploads/logo/${normalizedPath}`;
};

/**
 * Get initials from a company name for placeholder
 * @param {string} name - Company name
 * @returns {string} - First two letters capitalized
 */
export const getCompanyInitials = (name) => {
  if (!name) return "??";
  return name.substring(0, 2).toUpperCase();
};
