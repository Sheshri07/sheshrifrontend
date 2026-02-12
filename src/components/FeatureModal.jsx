import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureModal = ({ isOpen, onClose, title, description, buttonText, redirectLink }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-xl font-serif font-bold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 text-center">
                    <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                        {description}
                    </p>

                    <Link
                        to={redirectLink}
                        className="inline-block w-full py-4 px-6 bg-[#1a2e2e] text-white font-bold uppercase tracking-widest text-sm hover:bg-[#2c4a4a] transition-colors rounded"
                    >
                        {buttonText}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeatureModal;
