import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl p-2 md:text-5xl font-bold bg-gradient-to-r from-midas-dark to-gray-800 bg-clip-text text-transparent mb-4">
            Hubungi Kami
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Butuh bantuan? Tim Midas Vault siap membantu Anda dengan layanan terbaik
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-100 transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Nama Usaha</h3>
                  <p className="text-gray-700 font-semibold">MIDAS VAULT</p>
                </div>
              </div>

              <div className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-100 transition-all duration-300">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Alamat Usaha</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Jalan Pahlawan No. 21 RT/RW 01/02 Krajan,<br />
                    Tegalrejo, Magelang,<br />
                    Jawa Tengah
                  </p>
                </div>
              </div>

              <div className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 transition-all duration-300">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">No Telepon</h3>
                  <a 
                    href="tel:+6289603318147" 
                    className="text-xl font-bold bg-gradient-to-r from-midas-gold to-yellow-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
                  >
                    +62 896-0331-8147
                  </a>
                </div>
              </div>
            </div>

            {/* Business Hours & Support */}
            <div className="space-y-6">
              <div className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-100 transition-all duration-300">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Jam Operasional</h3>
                  <div className="text-gray-700 space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Senin - Jumat:</span>
                      <span className="font-semibold text-midas-gold">08:00 - 17:00 WIB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sabtu:</span>
                      <span className="font-semibold text-midas-gold">08:00 - 15:00 WIB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Minggu:</span>
                      <span className="font-semibold text-red-500">Tutup</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-100 transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Email Support</h3>
                  <a 
                    href="mailto:support@midasvault.com" 
                    className="text-lg font-semibold bg-gradient-to-r from-midas-gold to-yellow-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
                  >
                    support@midasvault.com
                  </a>
                </div>
              </div>

              <div className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-100 transition-all duration-300">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Layanan Kami</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-midas-gold rounded-full"></div>
                      <span className="text-gray-700">Marketplace Jual Beli</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-midas-gold rounded-full"></div>
                      <span className="text-gray-700">Sistem Barter Produk</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-midas-gold rounded-full"></div>
                      <span className="text-gray-700">Tukar Tambah Barang</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-midas-gold rounded-full"></div>
                      <span className="text-gray-700">Verifikasi Produk Premium</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span>Lokasi Kami di Magelang</span>
            </h3>
            <p className="text-gray-600">Kunjungi kantor kami untuk konsultasi langsung</p>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200">
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
          <div className="mt-4 text-center">
            <p className="text-gray-600 flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Jalan Pahlawan No. 21, Tegalrejo, Magelang, Jawa Tengah</span>
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-midas-dark to-gray-900 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Siap Berkolaborasi dengan Kami?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Ada pertanyaan tentang layanan kami? Jangan ragu untuk menghubungi tim support kami yang siap membantu 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/6289603318147" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.262-6.209-3.553-8.485"/>
              </svg>
              <span>Hubungi via WhatsApp</span>
            </a>
            <a 
              href="mailto:support@midasvault.com" 
              className="group bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Kirim Email</span>
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center text-gray-500">
          <p className="text-sm">© 2025 Midas Vault. All rights reserved.</p>
          <p className="text-sm mt-2 flex items-center justify-center space-x-1">
            <svg className="w-4 h-4 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Platform Marketplace Modern dengan Sistem Barter dan Tukar Tambah</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;