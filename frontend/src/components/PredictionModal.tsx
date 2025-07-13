import React from 'react';

interface PredictionResult {
  productId: string;
  region: string;
  trending: boolean;
  demandIncrease: number;
  stockStatus: string;
}

interface PredictionModalProps {
  predictions: PredictionResult[];
  onClose: () => void;
}

const PredictionModal: React.FC<PredictionModalProps> = ({ predictions, onClose }) => {
  const getStockStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'low':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'good':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendingIcon = (trending: boolean) => {
    return trending ? (
      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-2 sm:mx-4 max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Prediction Results
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {predictions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No prediction results available.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {predictions.map((prediction, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                        {prediction.productId}
                      </h3>
                      {getTrendingIcon(prediction.trending)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Region:</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900">
                          {prediction.region}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Demand Increase:</span>
                        <span className={`text-xs sm:text-sm font-medium ${
                          prediction.demandIncrease > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {prediction.demandIncrease > 0 ? '+' : ''}{prediction.demandIncrease}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600">Stock Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(prediction.stockStatus)}`}>
                          {prediction.stockStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionModal; 