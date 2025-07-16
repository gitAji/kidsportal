'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Breadcrumb = () => {
  const pathname = usePathname();
  let breadcrumbItems = [];

  // Always start with Home
  breadcrumbItems.push({ name: 'Home', href: '/' });

  const pathSegments = pathname.split('/').filter((segment) => segment);

  // Custom logic for child-dashboard path
  if (pathname.startsWith('/child-dashboard')) {
    breadcrumbItems.push({ name: 'Parent Dashboard', href: '/dashboard' });
    breadcrumbItems.push({ name: 'Child Dashboard', href: '/child-dashboard' });
  } else {
    // Existing logic for other paths
    pathSegments.forEach((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
      let name = decodeURIComponent(segment);

      // Custom naming for specific segments
      if (name.startsWith('grade')) {
        name = name.replace('grade', 'Grade ');
      } else if (name.startsWith('level')) {
        name = name.replace('level', 'Level ');
      } else {
        // Capitalize first letter for other segments
        name = name.charAt(0).toUpperCase() + name.slice(1);
      }

      breadcrumbItems.push({ name: name, href: href });
    });
  }

  return (
    <nav aria-label="breadcrumb" className="mb-4 p-4 bg-[var(--background-alt)] rounded-lg shadow-md">
      <ol className="list-none p-0 inline-flex text-[var(--foreground)]">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          return (
            <li key={item.href} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              {isLast ? (
                <span className="text-[var(--heading-color)] font-semibold">{item.name}</span>
              ) : (
                <Link href={item.href} className="text-[var(--foreground)] hover:text-[var(--primary-blue)] transition-colors duration-200">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;