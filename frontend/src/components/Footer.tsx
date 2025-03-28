
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-gradient-primary flex items-center justify-center">
                <span className="font-bold text-white text-lg">R</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">ResumeAI</span>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Revolutionizing recruitment with AI-powered resume screening.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
