// App.js
import {Row, Col, Button, Container, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import GoogleCalendar from './GoogleCalendar';
import AIRecommendations from './AIRecommendations';

function App() {
  const [questionType, setQuestionType] = useState('Outdoor')
  const [cbResponse, setCbResponse] = useState('')
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // GoogleCalendar.js calls this when user clicks a free time slot
  const handleTimeSlotSelect = (timeSlot) => {
    setUserInput(timeSlot);
  };

  const getInstructions = (qt, input) => {
    let prompt;
    switch(qt) {
      case 'Outdoor':
        prompt = `give me options on what outdoorsy things i can do during this time slot: ${input}`
        break;
      case 'Indoor':
        prompt = `give me options on what indoorsy things i can do during this time slot: ${input}`
        break;
      case 'Coping':
        prompt = `give me options on what things i can do to destress during this time slot: ${input}`
        break;
      default:
        prompt = input
    }
    return prompt
  }
  
  const handleSendData = async (e) => {
    e.preventDefault();
    console.log('form is submitted');
    const prompt = getInstructions(questionType, userInput);
  
    try {
      setIsLoading(true);
      const response = await fetch('http://127.0.0.1:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      const chatResponse = data.response;
      console.log(chatResponse);
      setCbResponse(chatResponse);
    } catch (error) {
      console.error('Error fetching data from Python server:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className='mt-3'>
      <div>
          <GoogleCalendar onTimeSlotSelect={handleTimeSlotSelect} />
      </div>
      
      <Row>
        {['Outdoor', 'Indoor', 'Coping'].map(el=> {
          return (
            <Col key={el}>
              <Button variant='primary' onClick={()=>setQuestionType(el)}>{el}</Button>
            </Col>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
          )                                            
        })}
      </Row>
      <h3 className='my-3'>
        Question type: <b>{questionType}</b>
      </h3>
      <Form onSubmit={handleSendData}>
          <Form.Control
            type='text'
            value={userInput}
            onChange={e=> setUserInput(e.target.value)}
            placeholder="Selected time slot will appear here..."                                                                                
            readOnly
          />
          <Button 
            variant='info' 
            type='submit' 
            className='mt-3'
            disabled={!userInput || isLoading}
          >
            {isLoading ? 'Loading...' : 'Submit'}
          </Button>
      </Form>
      
      {cbResponse && (
        <AIRecommendations                                                                                                           
          response={cbResponse} 
          timeSlot={userInput} 
        />
      )}
    </Container>
  );
}

export default App;