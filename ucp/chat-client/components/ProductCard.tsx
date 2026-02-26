/*
 * Copyright 2026 UCP Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type React from 'react';
import type {Product} from '../types';
import {normalizeForDisplay} from '../utils/text';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({product, onAddToCart}) => {
  const isAvailable = product.offers.availability.includes('InStock');
  const handleAddToCartClick = () => onAddToCart?.(product);

  return (
    <div className="bg-white rounded-xl shadow-card hover:shadow-cardHover overflow-hidden w-64 flex-shrink-0 transition-shadow">
      <img
        src={product.image[0]}
        alt={normalizeForDisplay(product.name)}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3
          className="text-lg font-semibold text-gray-900 truncate"
          title={normalizeForDisplay(product.name)}>
          {normalizeForDisplay(product.name)}
        </h3>
        <p className="text-sm text-gray-600">{normalizeForDisplay(product.brand.name)}</p>
        <div className="flex justify-between items-center mt-3">
          <p className="text-lg font-bold text-gray-900">
            {product.offers.priceCurrency === 'EUR' ? '€' : '$'}
            {product.offers.price}
          </p>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              isAvailable
                ? 'bg-signal-light-positive/10 text-signal-light-positive ring-1 ring-signal-light-positive/30'
                : 'bg-signal-light-negative/10 text-signal-light-negative ring-1 ring-signal-light-negative/30'
            }`}>
            {isAvailable ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddToCartClick}
          disabled={!isAvailable || !onAddToCart}
          className="block w-full text-center bg-brand-primary text-white py-2 rounded-md mt-4 hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/40 transition-colors disabled:bg-solidBlue-40 disabled:cursor-not-allowed">
          Add to Checkout
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
