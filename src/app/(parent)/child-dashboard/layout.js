"use client";
import { useEffect } from 'react';

export default function ChildDashboardLayout({ children }) {
  useEffect(() => {
    try {
      const childUser = JSON.parse(sessionStorage.getItem('childUser'));
      if (childUser) {
        document.body.classList.remove('child-theme-boy', 'child-theme-girl', 'child-theme-neutral');
        if (childUser.gender === 'boy') {
          document.body.classList.add('child-theme-boy');
        } else if (childUser.gender === 'girl') {
          document.body.classList.add('child-theme-girl');
        } else {
          document.body.classList.add('child-theme-neutral');
        }
      }
    } catch (error) {
      console.error("Could not parse childUser from session storage:", error);
    }

    return () => {
      document.body.classList.remove('child-theme-boy', 'child-theme-girl', 'child-theme-neutral');
    };
  }, []);

  return <>{children}</>;
}