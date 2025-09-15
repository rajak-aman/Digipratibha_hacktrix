import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0112] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-4 gap-8">
        <div>
          <div className="text-xl font-extrabold">
            <span>Digi</span>
            <span className="text-fuchsia-400">Pratibha</span>
          </div>
          <p className="text-white/70 mt-2">
            Build and share a beautiful portfolio in minutes.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-2">Product</div>
          <ul className="space-y-1 text-white/80">
            <li>
              <Link to="/builder" className="hover:text-white">
                Builder
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-white">
                Profile
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Resources</div>
          <ul className="space-y-1 text-white/80">
            <li>
              <a href="#features" className="hover:text-white">
                Features
              </a>
            </li>
            <li>
              <a href="#how" className="hover:text-white">
                How it works
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Get started</div>
          <Link
            to="/builder"
            className="inline-flex h-10 items-center justify-center rounded-md bg-fuchsia-500 px-4 text-white hover:bg-fuchsia-400"
          >
            Start Building
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-white/60 text-sm">
        © {new Date().getFullYear()} DigiPratibha. All rights reserved.
      </div>
    </footer>
  );
}
