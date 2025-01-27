# QuickThought
A web app that helps users manage their free time and generate recommendations for activities.

NOTE: You need your own API_Key to run this application as it relies on OpenAI's API

Quickthought is an innovative application designed to help individuals, particularly college students, 
efficiently find and manage their free time. Borne out of a business idea, this project responses to the common 
challenge students face in coordinating schedules and maximizing leisure time. By integrating Google 
Calendar and OpenAI's APIs, and utilizing Google’s OAuth for secure authentication, Quickthought 
seeks to streamline this process.

Sample Video: QuickThought Demo.mkv

# Setup Process
## Step 1: Clone the Repository
Open a terminal and navigate to your desired directory. Clone the repository using:

git clone <repository_url>

## Step 2: Navigate to the Project Directory
cd quickthought

## Step 3: Install Dependencies
Ensure you have Node.js installed. Use npm to install the necessary packages:
npm install

## Step 4: Set Up Environment Variables
Create a .env file in the project root and add your Google API keys and any other necessary environment variables.

## Step 5: Run the Application
Start the development server with:
npm start
Access the application by visiting http://localhost:3000 in your web browser.
Some users might need to install flask as well to run the app.py file.

# Learning Journey
The inspiration for Quickthought emerged from my experiences as a college student, where I observed that finding 
free time was often a challenge. My vision was to create a solution that would empower students to maximize their 
college experiences. I believe Quickthought has the potential to significantly improve students' lives by enabling 
them to effortlessly find and coordinate free time with friends or classmates, thus fostering a sense of community. 
Throughout this project, I gained valuable experience with Google API services and React.js for front-end development. 
I chose React.js based on a friend's recommendation and the growing popularity of the framework. While developing 
Quickthought, I encountered challenges, particularly with navigating OAuth authentication. This process required 
careful reading of documentation and troubleshooting, which taught me the importance of patience and attention to 
detail in software development.
