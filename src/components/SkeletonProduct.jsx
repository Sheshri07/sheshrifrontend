import React from 'react';

const SkeletonProduct = () => {
    return (
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm h-full flex flex-col p-2 md:p-3 animate-pulse">
            <div className="relative rounded-xl overflow-hidden bg-gray-200 aspect-[3/4] w-full"></div>
            <div className="mt-4 flex-grow flex flex-col justify-between">
                <div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-1/3 mt-4"></div>
            </div>
        </div>
    );
};

export default SkeletonProduct;
