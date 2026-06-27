// Session timeout configuration (30 minutes in milliseconds)
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // Show warning 5 minutes before timeout

let timeoutId: ReturnType<typeof setTimeout> | null = null;
let warningTimeoutId: ReturnType<typeof setTimeout> | null = null;

export const startSessionTimeout = (onWarning: () => void, onTimeout: () => void) => {
  // Clear existing timeouts
  if (timeoutId) clearTimeout(timeoutId);
  if (warningTimeoutId) clearTimeout(warningTimeoutId);

  // Show warning 5 minutes before timeout
  warningTimeoutId = setTimeout(() => {
    onWarning();
  }, SESSION_TIMEOUT - WARNING_TIME);

  // Logout after 30 minutes
  timeoutId = setTimeout(() => {
    onTimeout();
  }, SESSION_TIMEOUT);
};

export const resetSessionTimeout = (onWarning: () => void, onTimeout: () => void) => {
  startSessionTimeout(onWarning, onTimeout);
};

export const clearSessionTimeout = () => {
  if (timeoutId) clearTimeout(timeoutId);
  if (warningTimeoutId) clearTimeout(warningTimeoutId);
};
