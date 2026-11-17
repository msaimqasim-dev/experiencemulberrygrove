import { useEffect, useState } from 'react';
import policyDocument from '../../public/privacy-policy/index.html?raw';

// Serve the same document when a host routes directory URLs through the SPA.
export function PrivacyPolicyPage() {
  const [policy] = useState(() => new DOMParser().parseFromString(policyDocument, 'text/html'));

  useEffect(() => {
    const previousTitle = document.title;
    document.title = policy.title;
    return () => { document.title = previousTitle; };
  }, [policy]);

  return (
    <>
      <style>{policy.querySelector('style')?.textContent}</style>
      <div dangerouslySetInnerHTML={{ __html: policy.body.innerHTML }} />
    </>
  );
}