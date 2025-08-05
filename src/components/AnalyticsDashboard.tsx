import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { X, Download, Trash2, Eye, EyeOff } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
    const { getAnalytics, clearAnalytics, exportAnalytics } = useAnalytics();
    const [events, setEvents] = useState(getAnalytics());
    const [isVisible, setIsVisible] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

      // Update events every second to show real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      const currentEvents = getAnalytics();
      setEvents(currentEvents);
    }, 1000);

    return () => clearInterval(interval);
  }, [getAnalytics]);

    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    const handleExport = () => {
        const data = exportAnalytics();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        if (confirm('Are you sure you want to clear all analytics data?')) {
            clearAnalytics();
        }
    };

    const getEventIcon = (event: string) => {
        switch (event) {
            case 'modal_view': return '👁️';
            case 'upgrade_start': return '🚀';
            case 'upgrade_complete': return '✅';
            case 'save_attempt': return '💾';
            case 'feature_blocked': return '🚫';
            case 'session_start': return '🎬';
            case 'trial_limit_reached': return '⚠️';
            default: return '📊';
        }
    };

    const getEventColor = (event: string) => {
        switch (event) {
            case 'upgrade_complete': return 'text-green-600';
            case 'save_attempt': return 'text-blue-600';
            case 'feature_blocked': return 'text-red-600';
            case 'trial_limit_reached': return 'text-orange-600';
            default: return 'text-gray-600';
        }
    };

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
                title="Show Analytics Dashboard"
            >
                <Eye className="w-5 h-5" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-xl max-w-md z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
                <div className="flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    <h3 className="font-bold text-sm">Analytics Dashboard</h3>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {events.length} events
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleExport}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Export Analytics"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleClear}
                        className="p-1 hover:bg-gray-200 rounded text-red-600"
                        title="Clear Analytics"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title={isExpanded ? "Collapse" : "Expand"}
                    >
                        {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Hide Dashboard"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-48'} overflow-hidden`}>
                <div className="p-3 max-h-80 overflow-y-auto">
                    {events.length === 0 ? (
                        <div className="text-center text-gray-500 text-sm py-4">
                            No events tracked yet
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {events.slice(-10).reverse().map((event, index) => (
                                <div key={index} className="border rounded p-2 text-xs">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span>{getEventIcon(event.event)}</span>
                                        <span className={`font-semibold ${getEventColor(event.event)}`}>
                                            {event.event}
                                        </span>
                                        <span className="text-gray-400">
                                            {new Date(event.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    {Object.keys(event.properties).length > 0 && (
                                        <div className="text-gray-600">
                                            {Object.entries(event.properties).map(([key, value]) => (
                                                <div key={key} className="flex justify-between">
                                                    <span className="font-medium">{key}:</span>
                                                    <span className="text-gray-500">
                                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard; 