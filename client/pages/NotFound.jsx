import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#0a0112]">
      <div className="text-center text-white">
        <h1 className="text-5xl font-extrabold mb-2">404</h1>
        <p className="text-white/70 mb-6">Page not found</p>
        <a
          href="/"
          className="px-4 py-2 rounded-md bg-fuchsia-500 hover:bg-fuchsia-400"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
