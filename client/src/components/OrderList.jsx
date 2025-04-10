import React from 'react';

export default function OrderList({ orders }) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Commandes en cours</h2>
      {orders.map((order, index) => (
        <div key={index} className="bg-white rounded-xl p-3 shadow flex justify-between">
          <span>{order.name}</span>
          <span className="font-semibold">{order.cocktail}</span>
        </div>
      ))}
    </div>
  );
}