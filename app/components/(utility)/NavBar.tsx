import Link from "next/link";
import { routes } from "@/util/constants";
const Navbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900 text-white shadow-lg border-t border-gray-800">
      <div className="flex justify-evenly items-center py-2">
        {Object.entries(routes).map(([key, route]) => {

          if (!route.path.includes("/protected")) return null;

          return (
            <Link
            key={key}
            href={route.path}
            className="flex flex-col items-center justify-center text-sm hover:text-red-500"
          >
            <span className="block text-lg font-bold">{route.label}</span>
          </Link>
          
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
