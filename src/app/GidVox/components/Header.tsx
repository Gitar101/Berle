import React, { useState } from 'react';
import { Menu, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const goToSettings = () => {
    router.push('/GidVox/settings');
  };

  return (
    <header className="flex items-center justify-between p-4 text-white">
      <button onClick={toggleSidebar} className="focus:outline-none">
        <Menu className={`h-6 w-6 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'rotate-90 text-purple-400' : 'text-white'}`} />
      </button>
      <h1 className="text-xl font-bold font-inter">GidVox</h1>
      <button onClick={goToSettings} className="focus:outline-none">
        <Settings className="h-6 w-6 text-white" />
      </button>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </header>
  );
};

export default Header;