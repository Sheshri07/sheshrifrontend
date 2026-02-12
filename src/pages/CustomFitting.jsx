import React from 'react';
import InfoPage from './InfoPage';

const CustomFitting = () => {
    return (
        <InfoPage
            title="Custom Fitting & Tailoring"
            toc={[
                { name: 'Our Philosophy', id: 'philosophy' },
                { name: 'How It Works', id: 'process' },
                { name: 'Measurement Guide', id: 'guide' }
            ]}
            content={`
                <div class="space-y-12">
                    <section id="philosophy" class="space-y-6">
                        <p class="text-xl text-gray-800 font-serif italic">Every body is unique, and your clothes should be too.</p>
                        <p class="text-gray-600">At Sheshri, we believe that the perfect fit is the ultimate luxury. Our custom fitting service ensures that every garment flatters your silhouette perfectly.</p>
                    </section>
                    
                    <section id="process" class="space-y-6">
                        <h3 class="text-2xl font-serif font-bold text-gray-900">How It Works</h3>
                        <ol class="list-decimal pl-5 space-y-4">
                            <li><strong>Select Your Style:</strong> Choose any design from our collection.</li>
                            <li><strong>Provide Measurements:</strong> Submit your measurements online using our detailed guide, or visit our store for a professional measuring session.</li>
                            <li><strong>Custom Creation:</strong> Our master tailors will craft the garment to your exact specifications.</li>
                            <li><strong>Final Review:</strong> We ensure the fit is perfect before dispatching.</li>
                        </ol>
                    </section>
        
                    <section id="guide" class="space-y-6">
                        <h3 class="text-2xl font-serif font-bold text-gray-900">Need Help Measuring?</h3>
                        <p>Our video consultants can guide you through the measuring process step-by-step to ensure accuracy.</p>
                         <p><em>Custom tailoring adds 3-5 days to the standard delivery timeline.</em></p>
                    </section>
                </div>
            `}
        />
    );
};

export default CustomFitting;
