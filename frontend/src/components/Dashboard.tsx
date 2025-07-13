import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InventoryTable from './InventoryTable';
import PredictionModal from './PredictionModal';
import SearchBar from './SearchBar';

interface InventoryItem {
  id: string;
  date: string;
  storeId: string;
  productId: string;
  category: string;
  region: string;
  inventoryLevel: number;
  unitsSold: number;
  unitsOrdered: number;
  demandForecast: number;
  price: number;
  discount: number;
  weatherCondition: string;
  holidayPromotion: string;
  competitorPricing: number;
  seasonality: string;
}

interface PredictionResult {
  productId: string;
  region: string;
  trending: boolean;
  demandIncrease: number;
  stockStatus: string;
}

const Dashboard: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [kaggleLoading, setKaggleLoading] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm, filterRegion, filterCategory]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/inventory/events');
      setInventory(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch inventory data. Please check if the backend is running.');
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadKaggleData = async () => {
    try {
      setKaggleLoading(true);
      const response = await axios.post('http://localhost:8080/api/inventory/download-kaggle');
      if (response.data.success) {
        setError(null);
        // Refresh inventory after successful download
        await fetchInventory();
      } else {
        setError('Failed to download Kaggle dataset: ' + response.data.error);
      }
    } catch (err) {
      setError('Failed to download Kaggle dataset. Please try again.');
      console.error('Error downloading Kaggle data:', err);
    } finally {
      setKaggleLoading(false);
    }
  };

  const loadKaggleData = async () => {
    try {
      setKaggleLoading(true);
      const response = await axios.post('http://localhost:8080/api/inventory/load-kaggle-data');
      if (response.data.success) {
        setError(null);
        // Refresh inventory after successful load
        await fetchInventory();
      } else {
        setError('Failed to load Kaggle data: ' + response.data.error);
      }
    } catch (err) {
      setError('Failed to load Kaggle data. Please try again.');
      console.error('Error loading Kaggle data:', err);
    } finally {
      setKaggleLoading(false);
    }
  };

  const filterInventory = () => {
    let filtered = inventory;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.storeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRegion) {
      filtered = filtered.filter(item => item.region === filterRegion);
    }

    if (filterCategory) {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    setFilteredInventory(filtered);
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredInventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredInventory.map(item => item.id));
    }
  };

  const runForecast = async () => {
    if (selectedItems.length === 0) {
      setError('Please select at least one item for prediction.');
      return;
    }

    try {
      setPredictionLoading(true);
      const selectedInventory = inventory.filter(item => selectedItems.includes(item.id));
      
      const response = await axios.post('http://localhost:8080/api/ml/predict', {
        inventory: selectedInventory
      });
      
      setPredictions(response.data);
      setShowPredictionModal(true);
      setError(null);
    } catch (err) {
      setError('Failed to run prediction. Please try again.');
      console.error('Error running prediction:', err);
    } finally {
      setPredictionLoading(false);
    }
  };

  const getUniqueRegions = () => {
    return [...new Set(inventory.map(item => item.region))];
  };

  const getUniqueCategories = () => {
    return [...new Set(inventory.map(item => item.category))];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Supply Chain Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time inventory and supply chain management
          </p>
        </div>

        {/* Kaggle Dataset Integration */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Kaggle Dataset Integration</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={downloadKaggleData}
              disabled={kaggleLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {kaggleLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Downloading...
                </span>
              ) : (
                'Download Kaggle Dataset'
              )}
            </button>
            <button
              onClick={loadKaggleData}
              disabled={kaggleLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {kaggleLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </span>
              ) : (
                'Load Kaggle Data'
              )}
            </button>
            <span className="text-sm text-blue-700">
              Downloads real retail inventory data from Kaggle
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterRegion={filterRegion}
          setFilterRegion={setFilterRegion}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          regions={getUniqueRegions()}
          categories={getUniqueCategories()}
        />

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <button
            onClick={runForecast}
            disabled={selectedItems.length === 0 || predictionLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {predictionLoading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Running Forecast...
              </span>
            ) : (
              `Run Forecast (${selectedItems.length} selected)`
            )}
          </button>
          
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            {selectedItems.length === filteredInventory.length ? 'Deselect All' : 'Select All'}
          </button>
          
          <span className="text-sm text-gray-600">
            {selectedItems.length} of {filteredInventory.length} items selected
          </span>
        </div>

        {/* Inventory Table */}
        <InventoryTable
          inventory={filteredInventory}
          selectedItems={selectedItems}
          onItemSelect={handleItemSelect}
        />

        {/* Prediction Modal */}
        {showPredictionModal && (
          <PredictionModal
            predictions={predictions}
            onClose={() => setShowPredictionModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard; 