import React from 'react';
import { Card, Button } from 'react-bootstrap';

const RecommendationItem = ({ number, text, onAddToCalendar, timeSlot }) => {
  // Extract the activity name from the text (everything between ** and **)
  const activityName = text.match(/\*\*(.*?)\*\*/)?.[1] || "Activity";
  
  // Extract the description (everything after **: )
  const description = text.split("**: ")[1] || text;

  return (
    <div className="d-flex align-items-center gap-2 mb-2">
      <Button 
        variant="primary"
        onClick={() => onAddToCalendar(activityName, description, timeSlot)}
        style={{ minWidth: '40px' }}
      >
        {number}
      </Button>
      <span className="small">{text}</span>
    </div>
  );
};

const AIRecommendations = ({ response, timeSlot }) => {
  const checkAuthorization = () => {
    // Check if we have an active token for account1
    const token = window.tokens?.account1;
    if (!token) {
      alert('Please authorize your Google Calendar account first');
      return false;
    }
    return true;
  };

  const addToCalendar = async (activityName, description, timeSlot) => {
    if (!checkAuthorization()) return;

    try {
      // Wait for gapi to be loaded
      if (!window.gapi || !window.gapi.client) {
        alert('Google Calendar API is not loaded yet. Please try again in a moment.');
        return;
      }

      // Parse the timeSlot string to get start and end times
      // Example format: "12/27/2024, 2:00:00 PM - 12/27/2024, 3:00:00 PM (1.0 hours, Afternoon)"
      const times = timeSlot.split(' - ');
      if (times.length !== 2) {
        alert('Invalid time slot format');
        return;
      }

      const startTimeStr = times[0];
      const endTimeStr = times[1].split(' (')[0]; // Remove the duration and time of day info

      const startTime = new Date(startTimeStr);
      const endTime = new Date(endTimeStr);

      const event = {
        'summary': activityName,
        'description': description,
        'start': {
          'dateTime': startTime.toISOString(),
          'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        'end': {
          'dateTime': endTime.toISOString(),
          'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      // Set the token for the first account
      window.gapi.client.setToken({ access_token: window.tokens.account1 });

      const response = await window.gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
      });

      alert(`${activityName} has been added to your calendar!`);
      console.log('Event created: ', response.result);
    } catch (error) {
      console.error('Error creating calendar event:', error);
      if (error.result?.error?.message) {
        alert(`Error: ${error.result.error.message}`);
      } else {
        alert('Failed to add event to calendar. Please make sure you are authorized.');
      }
    }
  };

  // Split the response into individual recommendations
  const recommendations = response
    .split(/\d+\.\s/)
    .filter(Boolean)
    .map(text => text.trim());

  return (
    <Card className="mt-4">
      <Card.Body>
        <h3 className="h5 mb-4">AI Recommendations:</h3>
        {recommendations.map((text, index) => (
          <RecommendationItem
            key={index}
            number={index + 1}
            text={text}
            onAddToCalendar={addToCalendar}
            timeSlot={timeSlot}
          />
        ))}
      </Card.Body>
    </Card>
  );
};

export default AIRecommendations;