import React from 'react';

// Root wrapper - kept minimal; search is handled by swizzled SearchBar
export default function Root({children}: {children: React.ReactNode}): JSX.Element {
  return <>{children}</>;
}
