import React, { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <Disclosure as="nav" className="bg-blue-600 shadow-md">
      {({ open }) => (
        <>
          <div className="container mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                {/* Logo */}
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-white font-bold text-xl">
                    <span className="flex items-center">
                      <ShoppingCartIcon className="h-6 w-6 mr-2" />
                      PriceTracker
                    </span>
                  </Link>
                </div>
                
                {/* Desktop Navigation */}
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="text-white hover:text-blue-100 px-3 py-2 text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    to="/trending"
                    className="text-white hover:text-blue-100 px-3 py-2 text-sm font-medium"
                  >
                    Trending Deals
                  </Link>
                  <Link
                    to="/categories"
                    className="text-white hover:text-blue-100 px-3 py-2 text-sm font-medium"
                  >
                    Categories
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="text-white hover:text-blue-100 px-3 py-2 text-sm font-medium"
                  >
                    How It Works
                  </Link>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
                <form onSubmit={handleSearch} className="max-w-lg w-full">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="absolute inset-y-0 right-0 px-3 flex items-center bg-blue-700 rounded-r-md text-white hover:bg-blue-800"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
              
              {/* User Menu */}
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {isAuthenticated ? (
                  <Menu as="div" className="ml-3 relative">
                    <div>
                      <Menu.Button className="bg-blue-700 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <span className="sr-only">Open user menu</span>
                        <UserIcon className="h-8 w-8 rounded-full p-1 text-white" />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard"
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block px-4 py-2 text-sm text-gray-700`}
                            >
                              Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block px-4 py-2 text-sm text-gray-700`}
                            >
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="flex space-x-4">
                    <Link
                      to="/login"
                      className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Disclosure.Button
                as={Link}
                to="/"
                className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                Home
              </Disclosure.Button>
              <Disclosure.Button
                as={Link}
                to="/trending"
                className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                Trending Deals
              </Disclosure.Button>
              <Disclosure.Button
                as={Link}
                to="/categories"
                className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                Categories
              </Disclosure.Button>
              <Disclosure.Button
                as={Link}
                to="/how-it-works"
                className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                How It Works
              </Disclosure.Button>
            </div>
            
            {/* Mobile user menu */}
            <div className="pt-4 pb-3 border-t border-blue-700">
              {isAuthenticated ? (
                <div>
                  <div className="px-2 space-y-1">
                    <Disclosure.Button
                      as={Link}
                      to="/dashboard"
                      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                    >
                      Dashboard
                    </Disclosure.Button>
                    <Disclosure.Button
                      as={Link}
                      to="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                    >
                      Profile
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                    >
                      Sign out
                    </Disclosure.Button>
                  </div>
                </div>
              ) : (
                <div className="px-2 space-y-1">
                  <Disclosure.Button
                    as={Link}
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                  >
                    Log in
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={Link}
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                  >
                    Sign up
                  </Disclosure.Button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar; 