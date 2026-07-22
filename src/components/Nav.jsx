"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/settings", label: "Settings" },
  { href: "/health", label: "Health Check" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 text-white px-4 sm:px-6 py-3 flex flex-wrap gap-4 sm:gap-6">
      <span className="font-bold text-lg">FlyRank Capstone</span>
      <div className="flex gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:text-blue-400 transition ${
              pathname === link.href
                ? "text-blue-400 font-semibold"
                : "text-gray-300"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
