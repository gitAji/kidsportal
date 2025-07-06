import Link from "next/link";

const Breadcrumb = ({ crumbs }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex space-x-2 text-gray-500">
        {crumbs.map((crumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">/</span> // Separator between crumbs
            )}
            {index === crumbs.length - 1 ? (
              <span className="text-black font-bold">{crumb.label}</span> // Current page, no link
            ) : (
              <Link
                href={crumb.href}
                className="text-blue-600 hover:text-blue-800"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
