// ===================================================================
// 🚧 Coming Soon Context - App-Level Modal Provider
// ===================================================================
// Location: src/context/ComingSoonContext.js
// Usage: const { showComingSoon } = useComingSoon();
//        showComingSoon('receipts');  // That's it!
// ===================================================================

import { createContext, useContext, useState, useCallback } from 'react';
import ComingSoonModal, { COMING_SOON_FEATURES } from '../components/common/ComingSoonModal';

const ComingSoonContext = createContext(null);

export function ComingSoonProvider({ children }) {
  const [feature, setFeature] = useState(null);

  const showComingSoon = useCallback((featureKey) => {
    const config = COMING_SOON_FEATURES[featureKey];
    if (config) setFeature(config);
  }, []);

  const close = useCallback(() => setFeature(null), []);

  return (
    <ComingSoonContext.Provider value={{ showComingSoon }}>
      {children}
      <ComingSoonModal isOpen={!!feature} onClose={close} feature={feature} />
    </ComingSoonContext.Provider>
  );
}

export function useComingSoon() {
  return useContext(ComingSoonContext);
}