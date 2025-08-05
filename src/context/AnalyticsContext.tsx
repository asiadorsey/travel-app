import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface AnalyticsEvent {
    event: string;
    properties: Record<string, any>;
    timestamp: string;
    userId?: string;
    sessionId: string;
}

interface AnalyticsContextType {
    trackEvent: (event: string, properties?: Record<string, any>) => void;
    getAnalytics: () => AnalyticsEvent[];
    clearAnalytics: () => void;
    exportAnalytics: () => string;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
    trackEvent: () => { },
    getAnalytics: () => [],
    clearAnalytics: () => { },
    exportAnalytics: () => ''
});

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (!context) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context;
};

interface AnalyticsProviderProps {
    children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
    const [events, setEvents] = useState<AnalyticsEvent[]>([]);
    const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

    // Load analytics from localStorage on mount
    useEffect(() => {
        const savedEvents = localStorage.getItem('analytics_events');
        if (savedEvents) {
            try {
                setEvents(JSON.parse(savedEvents));
            } catch (error) {
                console.error('Failed to load analytics events:', error);
            }
        }
    }, []);

    // Save events to localStorage whenever they change
    useEffect(() => {
        if (events.length > 0) {
            localStorage.setItem('analytics_events', JSON.stringify(events));
        }
    }, [events]);

    const trackEvent = useCallback((event: string, properties: Record<string, any> = {}) => {
        const analyticsEvent: AnalyticsEvent = {
            event,
            properties: {
                ...properties,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                referrer: document.referrer
            },
            timestamp: new Date().toISOString(),
            sessionId
        };

        setEvents(prev => [...prev, analyticsEvent]);

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Analytics Event:', event, properties);
        }
    }, [sessionId]);

    const getAnalytics = useCallback(() => {
        return events;
    }, [events]);

    const clearAnalytics = useCallback(() => {
        setEvents([]);
        localStorage.removeItem('analytics_events');
    }, []);

    const exportAnalytics = useCallback(() => {
        return JSON.stringify(events, null, 2);
    }, [events]);

    // Make analytics available globally in development
    useEffect(() => {
        if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
            // Only set once to prevent infinite re-renders
            if (!(window as any).analytics) {
                (window as any).analytics = {
                    trackEvent,
                    getAnalytics,
                    clearAnalytics,
                    exportAnalytics
                };

                console.log('📊 Analytics commands available:');
                console.log('analytics.trackEvent("test_event", { property: "value" })');
                console.log('analytics.getAnalytics()');
                console.log('analytics.clearAnalytics()');
                console.log('analytics.exportAnalytics()');
            }
        }
    }, []); // Empty dependency array - only run once

    return (
        <AnalyticsContext.Provider value={{
            trackEvent,
            getAnalytics,
            clearAnalytics,
            exportAnalytics
        }}>
            {children}
        </AnalyticsContext.Provider>
    );
}; 