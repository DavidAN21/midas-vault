import React from 'react';

const TradeIn = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-midas-dark mb-4">Tukar Tambah</h1>
          <p className="text-gray-600">Upgrade barang lama Anda dengan tambahan biaya</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-semibold mb-4">Fitur Tukar Tambah Segera Hadir!</h2>
          <p className="text-gray-600 mb-6">
            Fitur tukar tambah akan memungkinkan Anda menukar barang lama dengan barang baru 
            yang lebih bagus dengan membayar selisih harga.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
            <p className="font-semibold">Fitur yang akan datang:</p>
            <ul className="list-disc list-inside text-left mt-2 space-y-1">
              <li>Pilih barang lama dan barang baru</li>
              <li>Hitung selisih harga otomatis</li>
              <li>Negosiasi nilai tukar</li>
              <li>Pembayaran selisih yang aman</li>
              <li>Proses tukar tambah terintegrasi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeIn;