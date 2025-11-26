import React, { useState } from 'react';
import { Product, UserType } from '../types';
import { 
  ShoppingCart, Star, Zap, Search, Loader2, X, Sparkles, Filter,
  ClipboardList, CheckSquare, FileText, Download, Briefcase, Plus, CheckCircle, XCircle
} from 'lucide-react';
import AiShoppingAssistant from './AiShoppingAssistant';
import { GoogleGenAI } from "@google/genai";

interface StorefrontProps {
  products: Product[];
  userType: UserType;
  addToCart: (product: Product, quantity?: number) => void;
}

// --- B2B Specific Components ---

const B2BPortal: React.FC<{ products: Product[], addToCart: (p: Product, q: number) => void }> = ({ products, addToCart }) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'approvals' | 'pricelist'>('quick');
  const [quickSku, setQuickSku] = useState('');
  const [quickQty, setQuickQty] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  // Mock Pending Orders
  const [pendingOrders, setPendingOrders] = useState([
    { id: 'PO-9921', requester: 'John Smith', items: 12, total: 2450.00, date: 'Oct 26, 2023' },
    { id: 'PO-9924', requester: 'Sarah Lee', items: 45, total: 8900.00, date: 'Oct 25, 2023' },
  ]);

  const handleQuickAdd = () => {
    const product = products.find(p => p.sku.toLowerCase() === quickSku.toLowerCase() || p.sku.toLowerCase().includes(quickSku.toLowerCase()));
    
    if (product) {
      addToCart(product, quickQty);
      setOrderSuccess(`Successfully added ${quickQty} units of ${product.name} to cart.`);
      setQuickSku('');
      setQuickQty(1);
      setTimeout(() => setOrderSuccess(null), 3000);
    } else {
      setOrderSuccess('Error: SKU not found. Please check and try again.');
    }
  };

  const handleApprove = (id: string) => {
    setPendingOrders(prev => prev.filter(o => o.id !== id));
    // In real app, api call here
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden animate-fade-in">
      <div className="bg-brand-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Briefcase size={20} className="text-brand-300" />
          <h2 className="font-bold text-lg">Enterprise Portal</h2>
        </div>
        <div className="flex bg-brand-800 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('quick')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'quick' ? 'bg-white text-brand-900 shadow-sm' : 'text-brand-200 hover:bg-brand-700'}`}
          >
            <ClipboardList size={14} /> Quick Order
          </button>
          <button 
             onClick={() => setActiveTab('approvals')}
             className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'approvals' ? 'bg-white text-brand-900 shadow-sm' : 'text-brand-200 hover:bg-brand-700'}`}
          >
            <CheckSquare size={14} /> Approvals
            {pendingOrders.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{pendingOrders.length}</span>}
          </button>
          <button 
             onClick={() => setActiveTab('pricelist')}
             className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'pricelist' ? 'bg-white text-brand-900 shadow-sm' : 'text-brand-200 hover:bg-brand-700'}`}
          >
            <FileText size={14} /> Price Lists
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'quick' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800">Quick Order by SKU</h3>
            <p className="text-sm text-slate-500">Enter product SKUs to quickly add items to your procurement cart.</p>
            
            <div className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SKU or Product Name</label>
                <input 
                  type="text" 
                  value={quickSku}
                  onChange={(e) => setQuickSku(e.target.value)}
                  placeholder="e.g. TECH-001"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div className="w-full md:w-32">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  value={quickQty}
                  onChange={(e) => setQuickQty(parseInt(e.target.value) || 1)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <button 
                onClick={handleQuickAdd}
                className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add to Order
              </button>
            </div>
            
            {orderSuccess && (
              <div className={`text-sm p-3 rounded-md flex items-center gap-2 ${orderSuccess.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                 {orderSuccess.includes('Error') ? <XCircle size={16}/> : <CheckCircle size={16}/>}
                 {orderSuccess}
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-slate-100">
               <p className="text-xs text-slate-400 font-medium">RECENTLY ORDERED</p>
               <div className="flex flex-wrap gap-2 mt-2">
                  {products.slice(0, 4).map(p => (
                    <button key={p.id} onClick={() => { setQuickSku(p.sku); }} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded border border-slate-200 transition-colors">
                      {p.sku}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div>
            <h3 className="font-bold text-slate-800 mb-4">Pending Purchase Approvals</h3>
            {pendingOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <CheckCircle size={32} className="mx-auto mb-2 text-green-400" />
                <p>All caught up! No pending orders.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">PO Number</th>
                      <th className="px-4 py-3">Requester</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingOrders.map(po => (
                      <tr key={po.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-brand-600">{po.id}</td>
                        <td className="px-4 py-3">{po.requester}</td>
                        <td className="px-4 py-3 text-slate-500">{po.date}</td>
                        <td className="px-4 py-3 font-bold">${po.total.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button onClick={() => handleApprove(po.id)} className="text-green-600 hover:text-green-800 hover:bg-green-50 px-2 py-1 rounded transition-colors text-xs font-bold">
                            Approve
                          </button>
                          <button onClick={() => handleApprove(po.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors text-xs font-bold">
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pricelist' && (
          <div>
            <h3 className="font-bold text-slate-800 mb-4">Negotiated Price Lists</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 text-red-600 p-2 rounded">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 group-hover:text-brand-600">Q4 2023 Global Hardware.pdf</h4>
                    <p className="text-xs text-slate-500">Updated: Oct 15, 2023 • 2.4 MB</p>
                  </div>
                </div>
                <Download size={18} className="text-slate-400 group-hover:text-brand-600" />
              </div>

              <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 group-hover:text-brand-600">2024 Software Licenses.csv</h4>
                    <p className="text-xs text-slate-500">Updated: Oct 20, 2023 • 156 KB</p>
                  </div>
                </div>
                <Download size={18} className="text-slate-400 group-hover:text-brand-600" />
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg flex items-start gap-3">
               <div className="text-blue-600 mt-0.5"><Zap size={18} /></div>
               <div>
                 <h4 className="text-sm font-bold text-blue-800">Tier 1 Partner Status</h4>
                 <p className="text-xs text-blue-600 mt-1">Your organization currently enjoys Tier 1 pricing (15-30% off retail) on all hardware categories. Next review: Jan 2024.</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Storefront: React.FC<StorefrontProps> = ({ products, userType, addToCart }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[] | null>(null);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    setIsAiSearching(true);
    setActiveCategory('All'); // Reset category filter on new search

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Prepare a lightweight context for the AI to process
      const productContext = products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        price: p.price
      }));

      const prompt = `
        You are an intelligent search engine for an e-commerce store.
        
        Product Catalog:
        ${JSON.stringify(productContext)}

        User Search Query: "${searchQuery}"

        Task: Return a JSON array of strings containing the 'id' of products that match the user's intent.
        - Semantic understanding: "something to sit on" should match chairs.
        - "cheap" should match lower priced items.
        - "gamer" should match keyboards/screens.
        
        Output Format: ONLY a raw JSON array of strings. Example: ["1", "4"]
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text || "[]";
      const matchedIds = JSON.parse(text);
      setSearchResults(Array.isArray(matchedIds) ? matchedIds : []);

    } catch (error) {
      console.error("AI Search Error:", error);
      // Fallback to basic text search if AI fails
      const lowerQ = searchQuery.toLowerCase();
      const fallbackResults = products
        .filter(p => 
          p.name.toLowerCase().includes(lowerQ) || 
          p.description.toLowerCase().includes(lowerQ) ||
          p.category.toLowerCase().includes(lowerQ)
        )
        .map(p => p.id);
      setSearchResults(fallbackResults);
    } finally {
      setIsAiSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setActiveCategory('All');
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = searchResults === null || searchResults.includes(p.id);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* B2B Dashboard / Portal */}
      {userType === UserType.B2B && (
        <B2BPortal products={products} addToCart={addToCart} />
      )}

      {/* Hero Section (Only show for B2C or if user wants visually rich exp, simplified for B2B) */}
      {userType !== UserType.B2B && (
        <div className="relative bg-brand-900 rounded-2xl overflow-hidden shadow-2xl h-80 md:h-96">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
          <img 
            src="https://picsum.photos/id/6/1200/600" 
            alt="Commerce Hero" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16 text-white max-w-2xl">
            <span className="bg-brand-500 text-xs font-bold px-2 py-1 rounded w-fit mb-4 uppercase tracking-wider">
              New Collection
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Equip Your Life.
            </h1>
            <p className="text-gray-200 text-lg mb-8">
              Discover premium tech and ergonomic essentials for your home office.
            </p>
            <button className="bg-white text-brand-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition w-fit">
              Browse Catalog
            </button>
          </div>
        </div>
      )}

      {/* AI Search Bar */}
      <div className={`relative z-30 mx-4 md:mx-auto max-w-3xl ${userType === UserType.B2B ? '' : '-mt-10'}`}>
        <div className="bg-white p-2 rounded-xl shadow-xl border border-slate-200 flex items-center gap-2 ring-1 ring-black/5">
          <div className="pl-3 text-slate-400">
            {isAiSearching ? (
              <Sparkles className="animate-pulse text-brand-500" size={20} />
            ) : (
              <Search size={20} />
            )}
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
            placeholder={userType === UserType.B2B ? "Search catalog by specification, SKU, or category..." : "Ask AI: 'Setup for a developer' or 'Office chairs under $200'"} 
            className="flex-1 border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 text-base py-3 bg-transparent"
            disabled={isAiSearching}
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
          <button 
            onClick={handleAiSearch}
            disabled={isAiSearching || !searchQuery.trim()}
            className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-lg font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            {isAiSearching ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <span>Search</span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Stats Bar */}
      {(searchResults !== null || activeCategory !== 'All') && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm animate-fade-in-down">
          <div className="flex items-center gap-2 text-sm text-slate-600">
             <Filter size={16} className="text-brand-500" />
             <span>
               Showing <strong>{filteredProducts.length}</strong> results
               {searchResults !== null && <span> matching <strong>"{searchQuery}"</strong></span>}
               {activeCategory !== 'All' && <span> in <strong>{activeCategory}</strong></span>}
             </span>
          </div>
          <button 
            onClick={clearSearch}
            className="text-sm text-red-500 hover:text-red-700 font-medium hover:underline flex items-center gap-1"
          >
            <X size={14} /> Reset Filters
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar pt-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat 
                ? 'bg-brand-900 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {isAiSearching ? (
        // Skeleton Loader
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-96">
              <div className="h-48 bg-slate-200"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-8 bg-slate-200 rounded w-1/3 mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-500 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <div className="bg-white p-4 rounded-full shadow-sm inline-block mb-4">
                 <Search size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">No products found</h3>
              <p className="text-sm">Try adjusting your search or category filter.</p>
              {(searchResults !== null || activeCategory !== 'All') && (
                 <button onClick={clearSearch} className="mt-6 px-4 py-2 bg-white border border-slate-300 shadow-sm rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition">
                   Clear all filters
                 </button>
              )}
            </div>
          ) : (
            filteredProducts.map(product => {
              const displayedPrice = userType === UserType.B2B ? product.b2bPrice : product.price;
              const savings = product.price - product.b2bPrice;
              
              return (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-brand-200 transition-all duration-300 group flex flex-col">
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {product.isNew && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm">
                        NEW
                      </div>
                    )}
                    {userType === UserType.B2B && (
                      <div className="absolute top-3 right-3 bg-brand-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center shadow-sm">
                        <Zap size={12} className="mr-1" /> B2B
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-xs font-bold text-brand-600 mb-1 uppercase tracking-wide flex justify-between">
                       <span>{product.category}</span>
                       <span className="text-slate-400">SKU: {product.sku}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg mb-2 leading-tight group-hover:text-brand-700 transition-colors">{product.name}</h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
                    
                    <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-50">
                      <div>
                        <div className="text-2xl font-bold text-slate-900">
                          ${displayedPrice.toFixed(2)}
                        </div>
                        {userType === UserType.B2B && (
                          <div className="text-xs text-green-600 font-medium mt-0.5">
                            Save ${savings.toFixed(2)} per unit
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-slate-900 text-white p-2.5 rounded-lg hover:bg-brand-600 active:scale-95 transition-all flex items-center justify-center shadow-sm"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
      
      {/* AI Assistant */}
      <AiShoppingAssistant products={products} />
    </div>
  );
};

export default Storefront;