import React from 'react';

export default function OrderItem({ order }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-gray-200 transition hover:shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Order <span className="text-gray-500 font-mono">#{order.id.slice(0, 6)}...</span>
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
            order.status === 'paid'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Total */}
      <div className="mb-4 text-gray-700">
        <p>
          <strong>Total:</strong>{' '}
          <span className="text-blue-600 font-bold text-lg">${order.total.toFixed(2)}</span>
        </p>
      </div>

      {/* Product list */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Products:</h4>
        <ul className="space-y-3">
          {order.products.map((p, i) => (
            <li
              key={i}
              className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-3 hover:bg-gray-100"
            >
              <img
                src={p.image?.startsWith('http') ? p.image : '/placeholder.png'}
                alt={p.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder.png';
                }}
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <div className="flex flex-col justify-center">
                <span className="text-base font-semibold text-gray-900">{p.name}</span>
                <span className="text-sm text-gray-600">
                  {p.quantity} × ${p.price}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
