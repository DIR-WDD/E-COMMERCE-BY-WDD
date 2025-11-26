import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { Order, AnalyticsData, CMSDraft } from '../types';
import { 
  Package, Users, DollarSign, TrendingUp, AlertCircle, FileText, CheckCircle, RotateCcw, ArrowRight 
} from 'lucide-react';
import { AiInsightsWidget, AiDescriptionGenerator } from './AiAdminWidgets';

interface AdminDashboardProps {
  orders: Order[];
  analytics: AnalyticsData[];
  cmsDrafts: CMSDraft[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, analytics, cmsDrafts }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Admin Control Center</h1>
        <div className="text-sm text-slate-500">Last updated: Just now</div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">$45,231.89</h3>
            </div>
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <DollarSign size={20} />
            </div>
          </div>
          <span className="text-xs text-green-600 font-medium mt-2 block flex items-center">
            <TrendingUp size={12} className="mr-1"/> +12.5% vs last month
          </span>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">B2B Orders</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">1,240</h3>
            </div>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <span className="text-xs text-slate-500 font-medium mt-2 block">
            45 pending approval
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Processing</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">56</h3>
            </div>
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Package size={20} />
            </div>
          </div>
          <span className="text-xs text-slate-500 font-medium mt-2 block">
            Avg fulfillment: 1.2 days
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">RMA Requests</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">12</h3>
            </div>
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <AlertCircle size={20} />
            </div>
          </div>
          <span className="text-xs text-red-500 font-medium mt-2 block">
            Requires attention
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Analytics Chart & AI Insights */}
        <div className="lg:col-span-2 space-y-8">
          {/* Analytics Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Revenue Performance (B2B vs B2C)</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="b2cSales" name="B2C Sales" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="b2bSales" name="B2B Sales" fill="#0c4a6e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights Widget (New) */}
          <AiInsightsWidget analytics={analytics} />
        </div>

        {/* Right Column: CMS Staging & AI Description Gen */}
        <div className="space-y-8">
          {/* CMS Staging */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">Content Staging</h2>
              <button className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full font-medium">View All</button>
            </div>
            
            <div className="flex-1 space-y-4">
              {cmsDrafts.map((draft) => (
                <div key={draft.id} className="border border-slate-100 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-slate-400" />
                      <span className="font-medium text-slate-700 text-sm">{draft.page}</span>
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      draft.status === 'Live' ? 'bg-green-100 text-green-700' :
                      draft.status === 'Staged' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {draft.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex justify-between items-center mt-2">
                    <span>By {draft.author} • {draft.lastModified}</span>
                  </div>
                  {draft.status === 'Staged' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                      <button className="flex-1 flex items-center justify-center gap-1 text-xs bg-brand-600 text-white py-1.5 rounded hover:bg-brand-700">
                        <CheckCircle size={12} /> Merge
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1 text-xs bg-white border border-slate-200 text-slate-600 py-1.5 rounded hover:bg-slate-50">
                        <RotateCcw size={12} /> Rollback
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* AI Content Generator (New) */}
          <AiDescriptionGenerator />
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Recent Transactions</h2>
          <button className="text-sm text-brand-600 font-medium flex items-center hover:underline">
            View All Orders <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-brand-600">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{order.customerName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      order.type === 'B2B' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {order.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-800">
                    ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;