import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface InventoryEvent {
  id: number;
  eventType: string;
  productName: string;
  quantity: number;
  timestamp: string;
  location: string;
}

function App() {
  const [inventoryEvents, setInventoryEvents] = useState<InventoryEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [kaggleStatus, setKaggleStatus] = useState<string | null>(null);
  const [downloadingKaggle, setDownloadingKaggle] = useState(false);

  const fetchInventoryEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/api/inventory/events');
      setInventoryEvents(response.data);
    } catch (err) {
      setError('Failed to fetch inventory events. Make sure the backend is running on port 8080.');
      console.error('Error fetching inventory events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadStatus('Uploading...');
    try {
      const response = await axios.post('http://localhost:8080/api/inventory/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus('✅ ' + response.data);
      // Refresh the data after successful upload
      setTimeout(() => {
        fetchInventoryEvents();
        setUploadStatus(null);
      }, 2000);
    } catch (err) {
      setUploadStatus('❌ Upload failed. Please check the file format.');
      console.error('Upload error:', err);
    }
  };

  const downloadKaggleDataset = async () => {
    setDownloadingKaggle(true);
    setKaggleStatus('Downloading Kaggle dataset... This may take a few minutes.');
    
    try {
      const response = await axios.post('http://localhost:8080/api/inventory/download-kaggle');
      if (response.data.success) {
        setKaggleStatus('✅ Kaggle dataset downloaded successfully!');
        // Refresh inventory events after download
        setTimeout(() => {
          fetchInventoryEvents();
          setKaggleStatus(null);
        }, 3000);
      } else {
        setKaggleStatus('❌ Failed to download Kaggle dataset: ' + response.data.error);
      }
    } catch (err) {
      setKaggleStatus('❌ Error downloading Kaggle dataset. Make sure Python and kagglehub are installed.');
      console.error('Kaggle download error:', err);
    } finally {
      setDownloadingKaggle(false);
    }
  };

  useEffect(() => {
    fetchInventoryEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Supply Chain Dashboard</h1>
          <p className="text-gray-600">Real-time inventory and supply chain management</p>
        </header>

        {/* Kaggle Dataset Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Kaggle Dataset Integration</h2>
          <div className="flex items-center space-x-4 mb-4">
            <button 
              onClick={downloadKaggleDataset}
              disabled={downloadingKaggle}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                downloadingKaggle 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {downloadingKaggle ? 'Downloading...' : 'Download Kaggle Dataset'}
            </button>
            <div className="text-sm text-gray-600">
              Downloads real retail inventory data from Kaggle
            </div>
          </div>
          {kaggleStatus && (
            <div className={`p-3 rounded-lg ${
              kaggleStatus.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {kaggleStatus}
            </div>
          )}
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload Inventory Data</h2>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="text-sm text-gray-600">
              Upload a CSV file with columns: eventType, productName, quantity, timestamp, location
            </div>
          </div>
          {uploadStatus && (
            <div className={`mt-4 p-3 rounded-lg ${
              uploadStatus.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {uploadStatus}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Inventory Events</h2>
            <button 
              onClick={fetchInventoryEvents}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>

          {loading && (
            <div className="text-center py-4">
              <p className="text-gray-600">Loading inventory events...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
              <p className="text-sm mt-2">Backend should be running on http://localhost:8080</p>
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventoryEvents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No inventory events found. Upload a CSV file or download Kaggle dataset to see data.
                      </td>
                    </tr>
                  ) : (
                    inventoryEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            event.eventType === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {event.eventType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.timestamp}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800">Frontend</h3>
              <p className="text-green-600">Running on http://localhost:3000</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800">Backend API</h3>
              <p className="text-blue-600">Running on http://localhost:8080</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 