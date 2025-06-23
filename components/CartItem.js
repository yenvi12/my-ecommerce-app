import React from 'react';

export default function CartItem({ item, onRemove, onUpdate }) {
  const { product, quantity, id } = item;

  return (
    <div className="flex items-center gap-4 bg-white shadow-sm rounded p-4 mb-4">
      <img
        src={product.image || '/placeholder.png'}
        alt={product.name}
        className="w-24 h-24 object-contain border rounded"
      />

      <div className="flex-1">
        <h4 className="text-lg font-semibold">{product.name}</h4>
        <p className="text-green-600 font-medium">${product.price.toFixed(2)}</p>

        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            value={quantity}
            min={1}
            onChange={(e) => onUpdate(id, parseInt(e.target.value))}
            className="w-20 px-2 py-1 border rounded"
          />

          <button
            onClick={() => onRemove(id)}
            className="text-red-600 font-medium hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
