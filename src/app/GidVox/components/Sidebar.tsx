import React from 'react';
import Link from 'next/link';
import { Home, GitPullRequest, Info, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-br from-gray-900 to-purple-900 text-purple-200 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50 shadow-lg shadow-purple-500/20`}
      >
        <div className="p-4 flex justify-end">
          <button onClick={onClose} className="text-purple-300 hover:text-purple-100 focus:outline-none">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-8">
          <Link href="/" className="flex items-center p-4 hover:bg-purple-700/40 hover:text-white rounded-r-full transition-colors duration-200">
            <Home className="h-5 w-5 mr-3" />
            Home
          </Link>
          <Link href="/ssh" className="flex items-center p-4 hover:bg-purple-700/40 hover:text-white rounded-r-full transition-colors duration-200">
            <GitPullRequest className="h-5 w-5 mr-3" />
            SSH
          </Link>
          <Link href="/about" className="flex items-center p-4 hover:bg-purple-700/40 hover:text-white rounded-r-full transition-colors duration-200">
            <Info className="h-5 w-5 mr-3" />
            About TGP
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;