import React from 'react';
import InfoPage from './InfoPage';

const ReturnsPolicy = () => {
    return (
        <InfoPage
            title="Returns & Exchange"
            toc={[
                { name: 'Introduction', id: 'introduction' },
                { name: 'Return Window', id: 'window' },
                { name: 'Non-Returnable Items', id: 'non-returnable' }
            ]}
            content={`
                <div class="space-y-12">
                    <section id="introduction" class="space-y-6">
                        <p class="text-xl text-gray-800 font-serif italic">Seamless returns for an effortless shopping experience.</p>
                        <p class="text-gray-600">We want you to love your Sheshri purchase. If something isn't quite right, we're here to help.</p>
                    </section>
                    
                    <section id="window" class="space-y-6">
                        <h3 class="text-2xl font-serif font-bold text-gray-900">Return Window</h3>
                        <p>We accept returns within 7 calendar days of delivery. The item must be in its original, pristine condition with all Sheshri tags intact.</p>
                        <p>To initiate a return, please visit the "My Orders" section of your account or contact our support team.</p>
                    </section>
        
                    <section id="non-returnable" class="space-y-6">
                        <h3 class="text-2xl font-serif font-bold text-gray-900">Non-Returnable Items</h3>
                        <p>Due to their bespoke nature, the following items are final sale:</p>
                        <ul class="list-disc pl-5 space-y-3 bg-red-50 p-6 rounded-lg text-red-900">
                            <li>Custom-tailored or altered garments</li>
                            <li>Accessories and jewelry for hygiene reasons</li>
                            <li>Final Sale / Clearance collection items</li>
                        </ul>
                    </section>
                </div>
            `}
        />
    );
};

export default ReturnsPolicy;
