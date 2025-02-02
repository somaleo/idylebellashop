import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Package, CheckSquare } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/customers', icon: Users, label: 'Customers' },
    { to: '/products', icon: Package, label: 'Products' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-6">
      <div className="text-xl font-bold mb-10 pl-2 flex items-center gap-2 whitespace-nowrap">
        <Package className="text-blue-500 shrink-0" size={24} />
        <span>Idyle Bella Shop</span>
      </div>
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-3 p-3 rounded-xl ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              } transition-all duration-200`}
            >
              <Icon size={20} />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;