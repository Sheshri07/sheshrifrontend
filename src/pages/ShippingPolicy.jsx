import React from 'react';
import InfoPage from './InfoPage';

const ShippingPolicy = () => {
    return (
        <InfoPage
            title="Shipping & Delivery"
            toc={[
                { name: 'Introduction', id: 'introduction' },
                { name: 'Domestic Delivery', id: 'domestic' },
                { name: 'International Logistics', id: 'international' }
            ]}
            content={`
                <div class="space-y-12">
                    <section id="introduction" class="space-y-6">
                        <p class="text-xl text-gray-800 font-serif italic">Craftsmanship delivered with precision to your doorstep.</p>
                        <p class="text-gray-600">At Sheshri, we understand that waiting for your order is the hardest part. That's why we've streamlined our shipping process to ensure your garments reach you as quickly and safely as possible.</p>
                    </section>
                    
                    <section id="domestic" class="space-y-6">
                        <h3 class="text-2xl font-serif font-bold text-gray-900">Domestic Delivery (India)</h3>
                        <p>We provide complimentary standard shipping on all orders within India. Every package is insured and tracked for your peace of mind.</p>
                        <div class="bg-primary-50 p-6 rounded-lg">
                            <ul class="list-disc pl-5 space-y-3">
                                <li><strong>Ready to Ship:</strong> Dispatched within 24 hours.</li>
                                <li><strong>Made to Order:</strong> Dispatched within 7-10 business days.</li>
                                <li><strong>Delivery Time:</strong> 2-5 business days after dispatch.</li>
                                <li><strong>Courier Partners:</strong> Blue Dart, Delhivery, and Ecom Express.</li>
                            </ul>
                        </div>
                    </section>
        
                    <section id="international" class="space-y-6">
                        <h3 class="text-2xl font-serif font-bold text-gray-900">International Logistics</h3>
                        <p>We bridge the gap between Indian heritage and the world, shipping to over 150 countries.</p>
                        <div class="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <p class="text-sm font-medium mb-2">Flat Rate International Shipping: $45 USD per order.</p>
                            <p class="text-xs text-gray-500">Note: Customs duties and taxes are the responsibility of the customer and are not included in the shipping fee.</p>
                        </div>
                    </section>
                </div>
            `}
        />
    );
};

export default ShippingPolicy;
