import { Product, Order, AnalyticsData, CMSDraft } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'TECH-001',
    name: 'Enterprise Server Blade',
    description: 'High-performance computing node for scalable data centers.',
    category: 'Hardware',
    price: 1299.00,
    b2bPrice: 899.00,
    stock: 45,
    image: 'https://picsum.photos/id/0/400/400',
    isNew: true
  },
  {
    id: '2',
    sku: 'ACC-042',
    name: 'Ergonomic Mesh Chair',
    description: 'Designed for 24/7 comfort with lumbar support.',
    category: 'Office',
    price: 349.00,
    b2bPrice: 199.00,
    stock: 120,
    image: 'https://picsum.photos/id/1/400/400'
  },
  {
    id: '3',
    sku: 'NET-101',
    name: 'Gigabit Switch 24-Port',
    description: 'Managed switch with VLAN support and QoS.',
    category: 'Networking',
    price: 250.00,
    b2bPrice: 165.00,
    stock: 8,
    image: 'https://picsum.photos/id/2/400/400'
  },
  {
    id: '4',
    sku: 'PER-555',
    name: 'Wireless Mechanical Keyboard',
    description: 'Tactile switches with multi-device bluetooth.',
    category: 'Peripherals',
    price: 120.00,
    b2bPrice: 85.00,
    stock: 200,
    image: 'https://picsum.photos/id/3/400/400'
  },
  {
    id: '5',
    sku: 'MON-4K',
    name: '32" 4K HDR Monitor',
    description: 'Professional color accuracy for designers.',
    category: 'Hardware',
    price: 699.00,
    b2bPrice: 550.00,
    stock: 15,
    image: 'https://picsum.photos/id/4/400/400'
  },
  {
    id: '6',
    sku: 'SOFT-CRM',
    name: 'Nexus CRM License (Yearly)',
    description: 'Cloud-based customer relationship management.',
    category: 'Software',
    price: 500.00,
    b2bPrice: 350.00,
    stock: 9999,
    image: 'https://picsum.photos/id/5/400/400'
  }
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-7721', customerName: 'Acme Corp', total: 4500.00, status: 'Processing', date: '2023-10-25', type: 'B2B' },
  { id: 'ORD-7722', customerName: 'Jane Doe', total: 120.00, status: 'Shipped', date: '2023-10-24', type: 'B2C' },
  { id: 'ORD-7723', customerName: 'Globex Inc', total: 12500.00, status: 'Delivered', date: '2023-10-23', type: 'B2B' },
  { id: 'ORD-7724', customerName: 'John Smith', total: 349.00, status: 'Return Requested', date: '2023-10-22', type: 'B2C' },
];

export const ANALYTICS_DATA: AnalyticsData[] = [
  { name: 'Jan', b2cSales: 4000, b2bSales: 2400 },
  { name: 'Feb', b2cSales: 3000, b2bSales: 1398 },
  { name: 'Mar', b2cSales: 2000, b2bSales: 9800 },
  { name: 'Apr', b2cSales: 2780, b2bSales: 3908 },
  { name: 'May', b2cSales: 1890, b2bSales: 4800 },
  { name: 'Jun', b2cSales: 2390, b2bSales: 3800 },
  { name: 'Jul', b2cSales: 3490, b2bSales: 4300 },
];

export const CMS_DRAFTS: CMSDraft[] = [
  { id: 'CMS-001', page: 'Home / Hero Banner', author: 'Marketing Team', status: 'Staged', lastModified: '10 mins ago' },
  { id: 'CMS-002', page: 'Policy / Returns', author: 'Legal Dept', status: 'Draft', lastModified: '2 hours ago' },
  { id: 'CMS-003', page: 'Product / Holiday Promo', author: 'Sales Manager', status: 'Live', lastModified: '1 day ago' },
];