import React from 'react';
import InfoPage from './InfoPage';

const BookAppointment = () => {
    return (
        <InfoPage
            title="Book an Appointment"
            toc={[
                { name: 'Virtual Experience', id: 'virtual' },
                { name: 'In-Store Experience', id: 'instore' },
                { name: 'Booking Process', id: 'booking' }
            ]}
            content={`
                <div class="space-y-12">
                    <section id="virtual" class="space-y-6">
                         <h3 class="text-2xl font-serif font-bold text-gray-900">Virtual Shopping</h3>
                        <p class="text-xl text-gray-800 font-serif italic">Experience Sheshri from the comfort of your home.</p>
                        <p class="text-gray-600">Connect with our expert stylists via video call. Walk through our collections, see the fabrics up close, and get personalized styling advice tailored to your preferences.</p>
                        <a href="https://wa.me/917838418308" class="inline-block px-6 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition">Book Video Call via WhatsApp</a>
                    </section>
                    
                    <section id="instore" class="space-y-6">
                        <h3 class="text-2xl font-serif font-bold text-gray-900">In-Store Experience</h3>
                        <p>Visit our flagship boutique for a dedicated one-on-one session. Enjoy complimentary refreshments while our team helps you curate your perfect wardrobe.</p>
                        <p><strong>Location:</strong> Sheshri Fashion, Chowk Lucknow, India.</p>
                    </section>
        
                    <section id="booking" class="space-y-6">
                        <h3 class="text-2xl font-serif font-bold text-gray-900">How to Book</h3>
                        <p>Appointments are recommended to ensure dedicated attention, but walk-ins are always welcome. To schedule a visit, please contact us at least 24 hours in advance.</p>
                    </section>
                </div>
            `}
        />
    );
};

export default BookAppointment;
