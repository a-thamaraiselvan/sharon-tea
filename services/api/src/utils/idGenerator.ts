let counter = 0;
let lastTimestampDate = '';

/**
 * Generate standard business ID in format: PREFIX + YYMMDD + 3-digit sequence
 * e.g., SH261014001, FR261014001, CT261014001
 */
export const generateBusinessId = (prefix: string = 'SH'): string => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const dateKey = `${yy}${mm}${dd}`;

  if (lastTimestampDate !== dateKey) {
    lastTimestampDate = dateKey;
    counter = 1;
  } else {
    counter += 1;
    if (counter > 999) {
      counter = 1;
    }
  }

  const randomSalt = Math.floor(Math.random() * 900 + 100);
  const seq = String(counter).padStart(3, '0');
  // Combine sequence with random salt if counter wraps or use sequence
  return `${prefix}${dateKey}${seq}`;
};

/**
 * Generate unique enquiry business ID
 */
export const generateEnquiryId = (type: 'FRANCHISE' | 'CONTACT'): string => {
  const prefix = type === 'FRANCHISE' ? 'FR' : 'CT';
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${yy}${mm}${dd}${randomSuffix}`;
};
