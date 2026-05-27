// src/services/analyticsService.ts

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  console.log(`[Analytics] Event: ${eventName}`, properties);
  // This is a placeholder for actual analytics integration (e.g., Google Analytics, Mixpanel)
  // Example:
  // if (window.gtag) {
  //   window.gtag('event', eventName, properties);
  // }
};
