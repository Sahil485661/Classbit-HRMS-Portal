import React from 'react';
import EventCalendar from '../../components/EventCalendar';

const CalendarPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Company Calendar</h1>
                <p className="text-[var(--text-secondary)] mt-1">View all events, notices, tasks, and deadlines in one full month glance.</p>
            </div>
            
            <EventCalendar viewMode="month" />
        </div>
    );
};

export default CalendarPage;
