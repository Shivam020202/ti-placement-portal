const cacheKeyFor = (email = "unknown") => `avatar-cache:${email}`;

const stringToColor = (str = "") => {
  const colors = [
    "#F87171",
    "#F59E0B",
    "#34D399",
    "#60A5FA",
    "#A78BFA",
    "#F472B6",
    "#22D3EE",
    "#FB923C",
  ];
  const code = str
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[code % colors.length];
};

export const generatePlaceholderAvatar = (name = "User") => {
  const trimmed = name.trim() || "User";
  const initials = trimmed
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const bg = stringToColor(trimmed);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">
      <rect width="100%" height="100%" fill="${bg}" />
      <text x="50%" y="55%" font-size="42" font-family="Inter, Arial" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const getCachedAvatar = (email) => {
  try {
    return localStorage.getItem(cacheKeyFor(email));
  } catch {
    return null;
  }
};

export const cacheAvatar = (email, dataUrl) => {
  try {
    if (dataUrl) {
      localStorage.setItem(cacheKeyFor(email), dataUrl);
    }
  } catch {
    // Ignore storage quota errors
  }
};

export const fetchAndCacheAvatar = async (email, photoURL) => {
  if (!photoURL) return null;
  try {
    const response = await fetch(photoURL, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`Avatar fetch failed: ${response.status}`);
    }
    const blob = await response.blob();
    const dataUrl = await blobToDataUrl(blob);
    cacheAvatar(email, dataUrl);
    return dataUrl;
  } catch {
    return null;
  }
};

export const resolveAvatar = async (email, photoURL, name) => {
  const cached = getCachedAvatar(email);
  if (cached) return cached;

  const downloaded = await fetchAndCacheAvatar(email, photoURL);
  if (downloaded) return downloaded;

  const placeholder = generatePlaceholderAvatar(name);
  cacheAvatar(email, placeholder);
  return placeholder;
};

export const resolveAvatarSync = (email, name, fallbackUrl) => {
  const cached = getCachedAvatar(email);
  if (cached) return cached;
  if (fallbackUrl && fallbackUrl.startsWith("data:")) return fallbackUrl;
  if (fallbackUrl) return fallbackUrl;
  const placeholder = generatePlaceholderAvatar(name);
  cacheAvatar(email, placeholder);
  return placeholder;
};
