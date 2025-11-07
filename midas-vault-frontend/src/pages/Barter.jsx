import React from 'react';

const Barter = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-midas-dark mb-4">Barter Barang</h1>
          <p className="text-gray-600">Tukar barang Anda dengan barang pengguna lain tanpa uang</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="text-6xl mb-4">🔄</div>
          <h2 className="text-2xl font-semibold mb-4">Fitur Barter Segera Hadir!</h2>
          <p className="text-gray-600 mb-6">
            Kami sedang menyiapkan fitur barter yang akan memungkinkan Anda menukar barang 
            dengan pengguna lain secara mudah dan aman.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            <p className="font-semibold">Fitur yang akan datang:</p>
            <ul className="list-disc list-inside text-left mt-2 space-y-1">
              <li>Pilih barang Anda dan barang target</li>
              <li>Ajukan tawaran barter</li>
              <li>Negosiasi dengan pemilik barang</li>
              <li>Sistem rating dan reputasi</li>
              <li>Proses barter yang aman</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Barter;