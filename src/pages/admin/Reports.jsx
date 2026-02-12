import React from 'react';
import { FileText, BarChart3, TrendingUp, Download, Calendar } from 'lucide-react';

const Reports = () => {
    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Reports & Analytics</h1>
                <p className="text-gray-500">View detailed business insights and reports</p>
            </div>

            {/* Coming Soon Card */}
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="text-white" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Advanced Reporting</h2>
                    <p className="text-gray-600 mb-6">
                        Comprehensive reporting and analytics features are coming soon!
                        Get detailed insights into sales, revenue, customer behavior, and more.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-left bg-gray-50 p-6 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <BarChart3 className="text-purple-600" size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Analytics</p>
                                <p className="font-semibold text-gray-900">Sales Data</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <TrendingUp className="text-purple-600" size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Growth</p>
                                <p className="font-semibold text-gray-900">Trends</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <Download className="text-purple-600" size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Export</p>
                                <p className="font-semibold text-gray-900">PDF/Excel</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <Calendar className="text-purple-600" size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Period</p>
                                <p className="font-semibold text-gray-900">Custom Range</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
