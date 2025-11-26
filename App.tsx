import React, { useState } from 'react';
import { UserType, ViewState, Product, CartItem } from './types';
import { MOCK_PRODUCTS, MOCK_ORDERS, ANALYTICS_DATA, CMS_DRAFTS } from './constants';
import Storefront from './components/Storefront';
import AdminDashboard from './components/AdminDashboard';
import { 
  ShoppingBag, 
  LayoutDashboard, 
  Store, 
  UserCircle, 
  LogOut, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const App: React.FC = () => {
  const [userType, setUserType] = useState<UserType>(UserType.B2C);
  const [viewState, setViewState] = useState<ViewState>(ViewState.STOREFRONT);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    // Simulate toast
    // In a real app, use a toast library. For now, we'll skip the alert for smoother B2B flows
    // or log it.
    console.log(`Added ${quantity} x ${product.name} to cart`);
  };

  const cartTotal = cart.reduce((acc, item) => {
    const price = userType === UserType.B2B ? item.b2bPrice : item.price;
    return acc + (price * item.quantity);
  }, 0);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Logo & Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => setViewState(ViewState.STOREFRONT)}>
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  N
                </div>
                <span className="font-bold text-xl text-slate-800 tracking-tight">Nexus</span>
              </div>
              
              {/* Desktop Nav Links */}
              <div className="hidden md:ml-8 md:flex md:space-x-8">
                <button 
                  onClick={() => setViewState(ViewState.STOREFRONT)}
                  className={`${viewState === ViewState.STOREFRONT ? 'border-brand-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors`}
                >
                  <Store size={16} className="mr-2" /> Storefront
                </button>
                <button 
                  onClick={() => setViewState(ViewState.ADMIN)}
                  className={`${viewState === ViewState.ADMIN ? 'border-brand-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors`}
                >
                  <LayoutDashboard size={16} className="mr-2" /> Admin
                </button>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-4">
              
              {/* Persona Switcher (Demo Feature) */}
              <div className="relative group">
                <button className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors">
                  <UserCircle size={16} />
                  <span>{userType === UserType.B2B ? 'B2B Purchaser' : 'B2C Customer'}</span>
                  <ChevronDown size={14} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 hidden group-hover:block animate-fade-in-down">
                  <button 
                    onClick={() => setUserType(UserType.B2C)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Switch to B2C
                  </button>
                  <button 
                    onClick={() => setUserType(UserType.B2B)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Switch to B2B
                  </button>
                </div>
              </div>

              {/* Cart */}
              {viewState === ViewState.STOREFRONT && (
                <div className="relative cursor-pointer group">
                  <div className="p-2 text-slate-600 group-hover:text-brand-600 transition-colors">
                    <ShoppingBag size={24} />
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-600 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  {/* Cart Dropdown Preview */}
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 hidden group-hover:block p-4 z-50">
                     <h4 className="font-bold text-slate-800 mb-2 border-b pb-2">Shopping Cart</h4>
                     {cart.length === 0 ? (
                       <p className="text-sm text-slate-500 py-4 text-center">Your cart is empty.</p>
                     ) : (
                       <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                         {cart.map((item, idx) => (
                           <div key={`${item.id}-${idx}`} className="flex justify-between items-center text-sm">
                              <span className="truncate flex-1 pr-2">{item.name}</span>
                              <span className="text-slate-500">x{item.quantity}</span>
                           </div>
                         ))}
                         <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                           <span>Total:</span>
                           <span>${cartTotal.toFixed(2)}</span>
                         </div>
                         <button className="w-full bg-brand-600 text-white text-sm py-2 rounded mt-2 hover:bg-brand-700">Checkout</button>
                       </div>
                     )}
                  </div>
                </div>
              )}

              <button className="text-slate-400 hover:text-slate-600">
                <LogOut size={20} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
               <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-500 hover:text-slate-700 p-2"
              >
                 {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
               </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button 
                onClick={() => { setViewState(ViewState.STOREFRONT); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50"
              >
                Storefront
              </button>
              <button 
                onClick={() => { setViewState(ViewState.ADMIN); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50"
              >
                Admin Dashboard
              </button>
              <div className="border-t border-slate-200 my-2 pt-2">
                 <p className="px-3 text-xs text-slate-400 uppercase font-bold mb-2">View As</p>
                 <button onClick={() => setUserType(UserType.B2C)} className={`block w-full text-left px-3 py-2 text-sm ${userType === UserType.B2C ? 'font-bold text-brand-600' : 'text-slate-600'}`}>
                    B2C Customer
                 </button>
                 <button onClick={() => setUserType(UserType.B2B)} className={`block w-full text-left px-3 py-2 text-sm ${userType === UserType.B2B ? 'font-bold text-brand-600' : 'text-slate-600'}`}>
                    B2B Purchaser
                 </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewState === ViewState.STOREFRONT ? (
          <Storefront 
            products={MOCK_PRODUCTS} 
            userType={userType} 
            addToCart={addToCart} 
          />
        ) : (
          <AdminDashboard 
            orders={MOCK_ORDERS} 
            analytics={ANALYTICS_DATA} 
            cmsDrafts={CMS_DRAFTS}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; 2023 Nexus Commerce Platform. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-800 cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-800 cursor-pointer">Status</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;