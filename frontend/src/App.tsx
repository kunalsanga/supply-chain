import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  Upload, 
  RefreshCw,
  Activity,
  DollarSign,
  MapPin,
  Brain,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { clsx } from 'clsx';
import './App.css';

// Chart components
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

interface InventoryEvent {
  id: number;
  date: string;
  storeId: string;
  productId: string;
  productName: string;
  category: string;
  supplier: string;
  quantity: number;
  status: string;
  location: string;
  timestamp: string;
  inventoryLevel: number;
  unitsSold: number;
  unitsOrdered: number;
  demandForecast: number;
  price: number;
  discount: number;
  weatherCondition: string;
  holidayOrPromotion: string;
  competitorPricing: number;
  seasonality: string;
}

interface PredictionData {
  productId: string;
  productName: string;
  storeId: string;
  category: string;
  currentInventory: number;
  stockStatus: string;
  expectedDemandIncrease: boolean;
  demandForecast: number;
  recommendation: string;
}

interface DashboardStats {
  totalProducts: number;
  totalStores: number;
  averageInventoryLevel: number;
  lowStockItems: number;
  overstockedItems: number;
  totalValue: number;
  revenueForecast: number;
  aiInsights: number;
}

function App() {
  const [inventoryEvents, setInventoryEvents] = useState<InventoryEvent[]>([]);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalStores: 0,
    averageInventoryLevel: 0,
    lowStockItems: 0,
    overstockedItems: 0,
    totalValue: 0,
    revenueForecast: 0,
    aiInsights: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [kaggleStatus, setKaggleStatus] = useState<string | null>(null);
  const [downloadingKaggle, setDownloadingKaggle] = useState(false);
  const [loadingKaggle, setLoadingKaggle] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [realTimeMode, setRealTimeMode] = useState(false);
  const [dataVersion, setDataVersion] = useState(0); // Track data updates
  const [chartData, setChartData] = useState<any[]>([]);
  const [inventoryTrendData, setInventoryTrendData] = useState<any[]>([]);

  const fetchInventoryEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8081/api/inventory/events', {
        timeout: 30000, // 30 second timeout
      });
      
      // Limit the data to prevent browser hanging
      const limitedData = response.data.slice(0, 500); // Only process first 500 items
      setInventoryEvents(limitedData);
      calculateStats(limitedData, predictions.length);
      updateChartData(limitedData); // Update chart data
      toast.success('Data refreshed successfully!');
    } catch (err) {
      setError('Failed to fetch inventory events. Make sure the backend is running on port 8081.');
      toast.error('Failed to fetch data');
      console.error('Error fetching inventory events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPredictions = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/predict-inventory-status', {
        timeout: 60000, // 60 second timeout for AI predictions
      });
      
      // Limit the data to prevent browser hanging
      const limitedData = response.data.slice(0, 100); // Only process first 100 items
      setPredictions(limitedData);
      
      // Update stats with new prediction count
      calculateStats(inventoryEvents, limitedData.length);
      toast.success('AI predictions updated!');
    } catch (err) {
      console.error('Error fetching predictions:', err);
      // Don't show error toast, just log the error
      // AI predictions might fail but inventory data should still work
      setPredictions([]); // Clear predictions
      calculateStats(inventoryEvents, 0); // Update stats with 0 predictions
    }
  }, []);

  const calculateStats = useCallback((data: InventoryEvent[], predictionCount: number = 0) => {
    if (data.length === 0) {
      setStats({
        totalProducts: 0,
        totalStores: 0,
        averageInventoryLevel: 0,
        lowStockItems: 0,
        overstockedItems: 0,
        totalValue: 0,
        revenueForecast: 0,
        aiInsights: predictionCount
      });
      return;
    }

    const uniqueProducts = new Set(data.map(item => item.productId)).size;
    const uniqueStores = new Set(data.map(item => item.storeId)).size;
    const avgInventory = data.reduce((sum, item) => sum + (item.inventoryLevel || 0), 0) / data.length;
    const lowStock = data.filter(item => (item.inventoryLevel || 0) < 10).length;
    const overstocked = data.filter(item => (item.inventoryLevel || 0) > 100).length;
    const totalValue = data.reduce((sum, item) => sum + ((item.inventoryLevel || 0) * (item.price || 0)), 0);
    const revenueForecast = data.reduce((sum, item) => sum + ((item.demandForecast || 0) * (item.price || 0)), 0);

    setStats({
      totalProducts: uniqueProducts,
      totalStores: uniqueStores,
      averageInventoryLevel: Math.round(avgInventory),
      lowStockItems: lowStock,
      overstockedItems: overstocked,
      totalValue: Math.round(totalValue),
      revenueForecast: Math.round(revenueForecast),
      aiInsights: predictionCount
    });
  }, []);

  const updateChartData = useCallback((data: InventoryEvent[]) => {
    // Update category distribution chart
    const categoryData = data.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const newChartData = Object.entries(categoryData).map(([category, count]) => ({
      category,
      count
    }));
    setChartData(newChartData);

    // Update inventory trend chart
    const newInventoryTrendData = data
      .slice(-10)
      .map((item, index) => ({
        name: `Item ${index + 1}`,
        inventory: item.inventoryLevel || 0,
        demand: item.demandForecast || 0
      }));
    setInventoryTrendData(newInventoryTrendData);
  }, []);

  const refreshAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch fresh inventory data
      const inventoryResponse = await axios.get('http://localhost:8081/api/inventory/events', {
        timeout: 30000,
      });
      const limitedInventoryData = inventoryResponse.data.slice(0, 500);
      setInventoryEvents(limitedInventoryData);

      // Try to fetch fresh predictions (but don't fail if it doesn't work)
      let limitedPredictionsData = [];
      try {
        const predictionsResponse = await axios.get('http://localhost:8081/api/predict-inventory-status', {
          timeout: 60000, // Longer timeout for AI predictions
        });
        limitedPredictionsData = predictionsResponse.data.slice(0, 100);
        setPredictions(limitedPredictionsData);
      } catch (predictionErr) {
        console.error('AI predictions failed, but continuing with inventory data:', predictionErr);
        setPredictions([]); // Clear predictions
      }

      // Update stats and charts with fresh data
      calculateStats(limitedInventoryData, limitedPredictionsData.length);
      updateChartData(limitedInventoryData);

      toast.success('Data refreshed successfully!');
    } catch (err) {
      console.error('Error refreshing data:', err);
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, [calculateStats, updateChartData]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadStatus('Uploading...');
    try {
      const response = await axios.post('http://localhost:8081/api/inventory/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus('✅ ' + response.data);
      toast.success('File uploaded successfully!');
      setTimeout(() => {
        setDataVersion(prev => prev + 1); // Force refresh
        refreshAllData(); // Comprehensive refresh
        setUploadStatus(null);
      }, 2000);
    } catch (err) {
      setUploadStatus('❌ Upload failed. Please check the file format.');
      toast.error('Upload failed');
      console.error('Upload error:', err);
    }
  };

  const downloadKaggleDataset = async () => {
    setDownloadingKaggle(true);
    setKaggleStatus('Downloading Kaggle dataset... This may take a few minutes.');
    
    try {
      const response = await axios.post('http://localhost:8081/api/inventory/download-kaggle');
      if (response.data.success) {
        setKaggleStatus('✅ Kaggle dataset downloaded successfully!');
        toast.success('Kaggle dataset downloaded!');
        setTimeout(() => {
          setDataVersion(prev => prev + 1); // Force refresh
          refreshAllData(); // Comprehensive refresh
          setKaggleStatus(null);
        }, 3000);
      } else {
        setKaggleStatus('❌ Failed to download Kaggle dataset: ' + response.data.error);
        toast.error('Failed to download dataset');
      }
    } catch (err) {
      setKaggleStatus('❌ Error downloading Kaggle dataset. Make sure Python and kagglehub are installed.');
      toast.error('Download failed');
      console.error('Kaggle download error:', err);
    } finally {
      setDownloadingKaggle(false);
    }
  };

  const loadKaggleData = async () => {
    setLoadingKaggle(true);
    setKaggleStatus('Loading Kaggle data into database...');
    
    try {
      const response = await axios.post('http://localhost:8081/api/inventory/load-kaggle-data');
      if (response.data.success) {
        setKaggleStatus('✅ Kaggle data loaded into database successfully!');
        toast.success('Data loaded successfully!');
        setTimeout(() => {
          setDataVersion(prev => prev + 1); // Force refresh
          refreshAllData(); // Comprehensive refresh
          setKaggleStatus(null);
        }, 2000);
      } else {
        setKaggleStatus('❌ Failed to load Kaggle data: ' + response.data.error);
        toast.error('Failed to load data');
      }
    } catch (err) {
      setKaggleStatus('❌ Error loading Kaggle data. Please try again.');
      toast.error('Load failed');
      console.error('Kaggle load error:', err);
    } finally {
      setLoadingKaggle(false);
    }
  };

  useEffect(() => {
    fetchInventoryEvents();
    fetchPredictions();
  }, [fetchInventoryEvents, fetchPredictions, dataVersion]);

  // Chart data is updated directly in fetchInventoryEvents

  // Real-time updates
  useEffect(() => {
    if (realTimeMode) {
      const interval = setInterval(() => {
        fetchInventoryEvents();
        fetchPredictions();
      }, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [realTimeMode, fetchInventoryEvents, fetchPredictions]);

  // Chart data is now managed by state and updated when data changes

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-blue-500"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-2">
          {trend > 0 ? (
            <ArrowUpRight className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {Math.abs(trend)}%
          </span>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">SupplyChain AI</h1>
              </div>
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Real-time Analytics</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setRealTimeMode(!realTimeMode)}
                className={clsx(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors",
                  realTimeMode 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                <Activity className="w-4 h-4" />
                <span>{realTimeMode ? 'Live' : 'Offline'}</span>
              </button>
              
              <button
                onClick={refreshAllData}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <RefreshCw className={clsx("w-4 h-4", loading && "animate-spin")} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
        </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'predictions', label: 'AI Predictions', icon: Brain },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'upload', label: 'Data Import', icon: Upload }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading && (
                <div className="col-span-4 flex items-center justify-center py-4">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                  <span className="text-blue-600 font-medium">Updating data...</span>
                </div>
              )}
              <StatCard
                title="Total Products"
                value={stats.totalProducts}
                icon={Package}
                trend={12}
                color="blue"
              />
              <StatCard
                title="Total Stores"
                value={stats.totalStores}
                icon={MapPin}
                trend={8}
                color="green"
              />
              <StatCard
                title="Low Stock Items"
                value={stats.lowStockItems}
                icon={AlertTriangle}
                trend={-5}
                color="red"
              />
              <StatCard
                title="Total Value"
                value={`$${stats.totalValue.toLocaleString()}`}
                icon={DollarSign}
                trend={15}
                color="purple"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Distribution */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Category Distribution</h3>
                  {loading && <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />}
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Inventory vs Demand Trend */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Inventory vs Demand Trend</h3>
                  {loading && <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />}
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={inventoryTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="inventory" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="demand" stroke="#82ca9d" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="w-6 h-6" />
                <h3 className="text-xl font-semibold">AI-Powered Insights</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-90">Revenue Forecast</p>
                  <p className="text-2xl font-bold">${stats.revenueForecast.toLocaleString()}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-90">AI Insights Generated</p>
                  <p className="text-2xl font-bold">{stats.aiInsights}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-90">Average Inventory</p>
                  <p className="text-2xl font-bold">{stats.averageInventoryLevel}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'inventory' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Inventory Management</h2>
                <div className="flex space-x-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Export Data
                  </button>
                </div>
              </div>

              {loading && (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                  <p className="text-gray-600 mt-2">Loading inventory data...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inventoryEvents.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                            <p>No inventory data available</p>
                            <p className="text-sm">Upload a CSV file or download Kaggle dataset to see data</p>
                          </td>
                        </tr>
                      ) : (
                        inventoryEvents.slice(0, 20).map((event) => (
                          <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{event.productName}</div>
                                <div className="text-sm text-gray-500">ID: {event.productId}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.storeId}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {event.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${Math.min((event.inventoryLevel || 0) / 100 * 100, 100)}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-900">{event.inventoryLevel || 0}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={clsx(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                (event.inventoryLevel || 0) < 10 
                                  ? "bg-red-100 text-red-800"
                                  : (event.inventoryLevel || 0) > 100
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              )}>
                                {(event.inventoryLevel || 0) < 10 ? 'Low Stock' : 
                                 (event.inventoryLevel || 0) > 100 ? 'Overstocked' : 'Normal'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${((event.inventoryLevel || 0) * (event.price || 0)).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'predictions' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">AI Predictions & Recommendations</h2>
                <button
                  onClick={fetchPredictions}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Brain className="w-4 h-4 inline mr-2" />
                  Refresh Predictions
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {predictions.length > 0 ? (
                  predictions.map((prediction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 truncate">{prediction.productName}</h3>
                        <span className={clsx(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          prediction.stockStatus === 'UNDERSTOCKED' ? "bg-red-100 text-red-800" :
                          prediction.stockStatus === 'OVERSTOCKED' ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        )}>
                          {prediction.stockStatus}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Current Inventory:</span>
                          <span className="font-medium">{prediction.currentInventory}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Demand Forecast:</span>
                          <span className="font-medium">{prediction.demandForecast}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Store:</span>
                          <span className="font-medium">{prediction.storeId}</span>
                        </div>
                        
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800 font-medium">AI Recommendation:</p>
                          <p className="text-sm text-blue-700 mt-1">{prediction.recommendation}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No AI Predictions Available</h3>
                    <p className="text-gray-600 mb-4">Upload inventory data to generate AI predictions and recommendations.</p>
                    <button
                      onClick={fetchPredictions}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <Brain className="w-4 h-4 inline mr-2" />
                      Generate Predictions
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Advanced Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analytics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={inventoryTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="inventory" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Revenue</p>
                    <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Revenue Forecast</p>
                    <p className="text-2xl font-bold">${stats.revenueForecast.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">AI Insights</p>
                    <p className="text-2xl font-bold">{stats.aiInsights}</p>
                  </div>
                  <Brain className="w-8 h-8 opacity-80" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'upload' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
        {/* Kaggle Dataset Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Kaggle Dataset Integration</h2>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <button 
              onClick={downloadKaggleDataset}
              disabled={downloadingKaggle}
                  className={clsx(
                    "flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors",
                downloadingKaggle 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-green-600 hover:bg-green-700 text-white"
                  )}
            >
                  <Download className="w-4 h-4" />
                  <span>{downloadingKaggle ? 'Downloading...' : 'Download Kaggle Dataset'}</span>
            </button>
            <button 
              onClick={loadKaggleData}
              disabled={loadingKaggle}
                  className={clsx(
                    "flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors",
                loadingKaggle 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
            >
                  <Upload className="w-4 h-4" />
                  <span>{loadingKaggle ? 'Loading...' : 'Load Kaggle Data'}</span>
            </button>
            <div className="text-sm text-gray-600">
              Downloads real retail inventory data from Kaggle
            </div>
          </div>
          {kaggleStatus && (
                <div className={clsx(
                  "p-3 rounded-lg",
              kaggleStatus.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                )}>
              {kaggleStatus}
            </div>
          )}
        </div>

        {/* File Upload Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upload Inventory Data</h2>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="text-sm text-gray-600">
              Upload a CSV file with inventory data
            </div>
          </div>
          {uploadStatus && (
                <div className={clsx(
                  "mt-4 p-3 rounded-lg",
              uploadStatus.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                )}>
              {uploadStatus}
            </div>
          )}
        </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800">Frontend</h3>
              <p className="text-green-600">Running on http://localhost:3000</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800">Backend API</h3>
                              <p className="text-blue-600">Running on http://localhost:8081</p>
            </div>
          </div>
        </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App; 