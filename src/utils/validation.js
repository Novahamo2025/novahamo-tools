export function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone) {
  return /^\+?[\d\s()-]{7,20}$/.test(phone);
}

export function validateCoordinates(lat, lng) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  return !isNaN(latitude) && !isNaN(longitude) &&
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180;
}

export function validateUPI(upiId) {
  return /^[\w.-]+@[\w]+$/.test(upiId);
}

export function validateFileType(file, acceptedTypes) {
  if (!acceptedTypes || acceptedTypes.length === 0) return true;
  const fileType = file.type;
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  return acceptedTypes.some(t => t === fileType || t === ext);
}

export function validateFileSize(file, maxSizeMB = 100) {
  return file.size <= maxSizeMB * 1024 * 1024;
}

export function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase();
}
