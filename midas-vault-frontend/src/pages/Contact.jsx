import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-midas-dark mb-4">Hubungi Kami</h1>
          <p className="text-gray-600 text-lg">Butuh bantuan? Tim Midas Vault siap membantu Anda</p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-midas-gold/10 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Nama Usaha</h3>
                  <p className="text-gray-700">MIDAS VAULT</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-midas-gold/10 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Alamat Usaha</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Jalan Pahlawan No. 21 RT/RW 01/02 Krajan,<br />
                    Tegalrejo, Magelang,<br />
                    Jawa Tengah
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-midas-gold/10 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">No Telepon</h3>
                  <a 
                    href="tel:+6289603318147" 
                    className="text-midas-gold hover:text-midas-dark transition-colors font-medium"
                  >
                    +62 896-0331-8147
                  </a>
                </div>
              </div>
            </div>

            {/* Business Hours & Support */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-midas-gold/10 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Jam Operasional</h3>
                  <div className="text-gray-700 space-y-1">
                    <p>Senin - Jumat: 08:00 - 17:00 WIB</p>
                    <p>Sabtu: 08:00 - 15:00 WIB</p>
                    <p>Minggu: Tutup</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-midas-gold/10 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                  <a 
                    href="mailto:support@midasvault.com" 
                    className="text-midas-gold hover:text-midas-dark transition-colors"
                  >
                    support@midasvault.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-midas-gold/10 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Layanan</h3>
                  <div className="text-gray-700 space-y-1">
                    <p>• Marketplace Jual Beli</p>
                    <p>• Sistem Barter Produk</p>
                    <p>• Tukar Tambah Barang</p>
                    <p>• Verifikasi Produk</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Lokasi Kami di Magelang</h3>
          <div className="rounded-xl overflow-hidden shadow-md">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d7912.06502081504!2d110.2683890751781!3d-7.461655288162744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sJl%20Pahlawan%20No.%2021%20RT%2FRW%2001%2F02%20Krajan%2C%20Tegalrejo%2C%20Magelang%2C%20Jawa%20Tengah!5e0!3m2!1sid!2sid!4v1764434277710!5m2!1sid!2sid" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Midas Vault di Magelang"
              className="w-full"
            ></iframe>
          </div>
          <div className="mt-4 text-center text-gray-600">
            <p>📍 Jalan Pahlawan No. 21, Tegalrejo, Magelang, Jawa Tengah</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Ada pertanyaan tentang layanan kami? Jangan ragu untuk menghubungi!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/6289603318147" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
            >
              WhatsApp
            </a>
            <a 
              href="mailto:support@midasvault.com" 
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Email Kami
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2024 Midas Vault. All rights reserved.</p>
          <p className="mt-2">Platform Marketplace Modern dengan Sistem Barter dan Tukar Tambah</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;