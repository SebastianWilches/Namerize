import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="md:sticky md:top-6 h-max">
      <nav className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200 p-2">
        <ul className="space-y-1">
          <li>
            <Link
              href="/brands"
              className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 ring-1 ring-transparent hover:ring-gray-200 transition"
            >
              <span className="h-2 w-2 rounded-full bg-indigo-500/70 group-hover:bg-indigo-600"></span>
              Marcas
            </Link>
          </li>
          <li>
            <Link
              href="/holders"
              className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 ring-1 ring-transparent hover:ring-gray-200 transition"
            >
              <span className="h-2 w-2 rounded-full bg-teal-500/70 group-hover:bg-teal-600"></span>
              Titulares
            </Link>
          </li>
          <li>
            <Link
              href="/statuses"
              className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 ring-1 ring-transparent hover:ring-gray-200 transition"
            >
              <span className="h-2 w-2 rounded-full bg-amber-500/70 group-hover:bg-amber-600"></span>
              Estados
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
