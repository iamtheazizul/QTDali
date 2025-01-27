/*global google*/
/*global gapi*/

export const CLIENT_ID = '288631567035-n8tul6fqu0clnb2ojvj4msj1h6og82ec.apps.googleusercontent.com';
export const API_KEY = 'AIzaSyBsQIvc6WXOmLEBxx3ECCamjGcMOvKF64Y';
export const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
// Updated scopes to include write access
export const SCOPES = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events';

// Tokens storage
window.tokens = {
    account1: null,
    account2: null
};
let gapiInited = false;

// Store callback for time slot selection
let timeSlotCallback = null;

// Get button references dynamically
const getButtons = () => ({
    account1: {
        authButton: document.getElementById('authorize_button_1'),
        signoutButton: document.getElementById('signout_button_1')
    },
    account2: {
        authButton: document.getElementById('authorize_button_2'),
        signoutButton: document.getElementById('signout_button_2')
    }
});

export function gapiLoaded(onTimeSlotSelect) {
    // Store the callback for later use
    timeSlotCallback = onTimeSlotSelect;
    gapi.load('client', initializeGapiClient);
}

export async function initializeGapiClient() {
    try {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        maybeEnableButtons();
    } catch (error) {
        console.error("Error initializing the Google API client: ", error);
    }
}

export function maybeEnableButtons() {
    if (gapiInited) {
        const buttons = getButtons();
        Object.values(buttons).forEach(obj => {
            if (obj.authButton) {
                obj.authButton.style.visibility = 'visible';
            }
        });
    }
}

export function handleAuthClick(account) {
    const buttons = getButtons();
    const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (resp) => {
            if (resp.error) {
                alert("Error signing in: " + resp.error);
                return;
            }
            window.tokens[`account${account}`] = resp.access_token; // Store token in window.tokens
            
            const currentButtons = buttons[`account${account}`];
            if (currentButtons.signoutButton) {
                currentButtons.signoutButton.style.visibility = 'visible';
            }
            if (currentButtons.authButton) {
                currentButtons.authButton.innerText = 'Refresh';
            }
            alert(`Authorized Account ${account}`);
        }
    });

    if (!window.tokens[`account${account}`]) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

export function handleSignoutClick(account) {
    const buttons = getButtons();
    const token = window.tokens[`account${account}`];
    if (token !== null) {
        google.accounts.oauth2.revoke(token);
        window.tokens[`account${account}`] = null;
        const contentElement = document.getElementById('content');
        if (contentElement) {
            contentElement.innerText = '';
        }
        
        const currentButtons = buttons[`account${account}`];
        if (currentButtons.authButton) {
            currentButtons.authButton.innerText = 'Authorize Account ' + account;
        }
        if (currentButtons.signoutButton) {
            currentButtons.signoutButton.style.visibility = 'hidden';
        }
        alert(`Signed out Account ${account}`);
    }
}

// Fetch events for the selected date
export async function fetchEventsForSelectedDate() {
    const selectedDate = document.getElementById('event_date').value;
    if (!selectedDate) {
        alert('Please select a date.');
        return;
    }

    const localStartTime = new Date(selectedDate + 'T00:00:00');
    const localEndTime = new Date(selectedDate + 'T23:59:59');
    const startTime = localStartTime.toISOString();
    const endTime = localEndTime.toISOString();

    let allEvents = [];
    
    for (let i = 1; i <= 2; i++) {
        const account = `account${i}`;
        if (window.tokens[account]) {
            try {
                const request = {
                    'calendarId': 'primary',
                    'timeMin': startTime,
                    'timeMax': endTime,
                    'showDeleted': false,
                    'singleEvents': true,
                    'maxResults': 20,
                    'orderBy': 'startTime',
                };
                
                gapi.client.setToken({ access_token: window.tokens[account] });
                const response = await gapi.client.calendar.events.list(request);
                const events = response.result.items;

                allEvents.push(...events);
            } catch (err) {
                console.error(`Error fetching events for Account ${i}: ${err.message}`);
            }
        } else {
            console.log(`Account ${i} is not signed in.`);
        }
    }

    const freeTimes = findFreeTimes(allEvents, startTime, endTime);
    displayFreeTimes(freeTimes);
}

export function findFreeTimes(events, startTime, endTime) {
    const eventTimes = events.map(event => ({
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date)
    }));

    eventTimes.sort((a, b) => a.start - b.start);

    const freeTimes = [];
    const dayStart = new Date(startTime);
    const dayEnd = new Date(endTime);

    let lastEndTime = dayStart;

    for (const event of eventTimes) {
        if (lastEndTime < event.start) {
            freeTimes.push({ start: lastEndTime, end: event.start });
        }
        lastEndTime = new Date(Math.max(lastEndTime, event.end));
    }

    if (lastEndTime < dayEnd) {
        freeTimes.push({ start: lastEndTime, end: dayEnd });
    }

    return freeTimes;
}

export function displayFreeTimes(freeTimes) {
    const contentElement = document.getElementById('content');
    contentElement.innerHTML = '';

    if (freeTimes.length === 0) {
        contentElement.innerText = 'No free time available for the selected date.';
        return;
    }

    freeTimes.forEach(freeTime => {
        const startTime = new Date(freeTime.start);
        const endTime = new Date(freeTime.end);
        const hours = (endTime - startTime) / (1000 * 60 * 60);
        const timeOfDay = getTimeOfDay(startTime);
        
        const buttonLabel = `${startTime.toLocaleString()} - ${endTime.toLocaleString()}`;
        const timeSlotInfo = `${buttonLabel} (${hours.toFixed(1)} hours, ${timeOfDay})`;
        
        const freeTimeButton = document.createElement('button');
        freeTimeButton.innerText = buttonLabel;
        freeTimeButton.className = 'btn btn-outline-primary m-2';

        freeTimeButton.onclick = () => {
            if (timeSlotCallback) {
                timeSlotCallback(timeSlotInfo);
            }
        };

        contentElement.appendChild(freeTimeButton);
        contentElement.appendChild(document.createElement('br'));
    });
}

export function getTimeOfDay(date) {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
}