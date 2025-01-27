// GoogleCalendar.js
import React, { useEffect } from 'react';
import {
    handleAuthClick,
    handleSignoutClick,
    fetchEventsForSelectedDate,
    gapiLoaded,
} from './GoogleCalendarModel';

const GoogleCalendarQuickstart = ({ onTimeSlotSelect }) => {
    useEffect(() => {
        const loadGAPI = () => {
            const script1 = document.createElement("script");
            script1.src = "https://apis.google.com/js/api.js";
            script1.async = true;
            script1.defer = true;
            script1.onload = () => gapiLoaded(onTimeSlotSelect);
            document.body.appendChild(script1);
    
            const script2 = document.createElement("script");
            script2.src = "https://accounts.google.com/gsi/client";
            script2.async = true;
            script2.defer = true;
            document.body.appendChild(script2);
        };
    
        loadGAPI();

        return () => {
            const scripts = document.querySelectorAll('script[src*="googleapis.com"]');
            scripts.forEach(script => script.remove());
        };
    }, [onTimeSlotSelect]);

    return (
        <div>
            <h1>QuickThought</h1>
            <div className="account-buttons">
                <div className="account-group">
                    <button
                        id="authorize_button_1"
                        onClick={() => handleAuthClick(1)}
                        style={{ visibility: 'hidden' }}
                    >
                        Authorize Account 1
                    </button>
                    <button
                        id="signout_button_1"
                        onClick={() => handleSignoutClick(1)}
                        style={{ visibility: 'hidden' }}
                    >
                        Sign Out Account 1
                    </button>
                </div>
                <div className="account-group">
                    <button
                        id="authorize_button_2"
                        onClick={() => handleAuthClick(2)}
                        style={{ visibility: 'hidden' }}
                    >
                        Authorize Account 2
                    </button>
                    <button
                        id="signout_button_2"
                        onClick={() => handleSignoutClick(2)}
                        style={{ visibility: 'hidden' }}
                    >
                        Sign Out Account 2
                    </button>
                </div>
            </div>
            
            <h2>Select Date to Fetch Events</h2>
            <input type="date" id="event_date" />
            <button onClick={() => fetchEventsForSelectedDate(onTimeSlotSelect)}>Fetch Events</button>
    
            <pre id="content"></pre>
        </div>
    );
};

export default GoogleCalendarQuickstart;