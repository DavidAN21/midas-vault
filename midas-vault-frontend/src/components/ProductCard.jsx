import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getConditionColor = (condition) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      fair: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800',
    };
    return colors[condition] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition-all duration-300">
      <div className="relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.verified_at && (
          <div className="absolute top-2 right-2 bg-midas-gold text-midas-dark px-2 py-1 rounded-full text-xs font-semibold">
            ✓ Verified
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(product.condition)}`}>
            {product.condition}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-midas-gold">{formatPrice(product.price)}</span>
          <span className="text-sm text-gray-500 capitalize">{product.category}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>By: {product.user?.name}</span>
          <span>{new Date(product.created_at).toLocaleDateString('id-ID')}</span>
        </div>
        
        <div className="flex space-x-2">
          <Link
            to={`/marketplace/${product.id}`}
            className="flex-1 bg-midas-gold text-midas-dark text-center py-2 rounded-xl font-semibold hover:bg-yellow-500 transition-colors"
          >
            Beli
          </Link>
          <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-300 transition-colors">
            Barter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;