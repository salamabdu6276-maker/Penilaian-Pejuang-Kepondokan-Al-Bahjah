export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(20);
        break;
      case 'heavy':
        navigator.vibrate(40);
        break;
      case 'success':
        navigator.vibrate([15, 40, 20]);
        break;
      case 'error':
        navigator.vibrate([20, 20, 20, 20, 40]);
        break;
    }
  } catch (error) {
    // Ignore errors for devices that don't support it or if blocked by policy
  }
};
