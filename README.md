# Weather application

### Overview:
This project is a web application that provides weather information for a specified location along with data from the NASA Astronomy Picture of the Day (APOD) API and top headlines from the News API. The page displays weather data, as well as additional information such as an APOD image, data, and news headlines. The project have admin page and uses the mongodb database to store, process and read user information and data received from the API's.

### Files:
admin.css
Contains CSS styling for admin dashboard elements.
style.css
Contains general CSS styles used throughout the application.
app.ejs
Main EJS template file for rendering dynamic content.
app.js
Main server-side JavaScript file responsible for setting up routes and handling server logic.
login.ejs
EJS template file for rendering the login page.
register.ejs
EJS template file for rendering the registration page.
scripts.js
Client-side JavaScript file containing scripts used throughout the application.

### Installation:
**install the project:**
```bash
git clone https://github.com/DemissenovDanial/WEB.git
```

**install the necessary node packages:**
```bash
npm install
```

### Run the server:
```bash
node app.js
```

### Used API's:
1) **OpenWeatherMap API: Shows the weather in a entered city**
2) **NASA APOD API: Shows the actual interesting news of the day according to NASA**
3) **News API: Provides access to a wide range of global and local news articles, blogs, and social media**

### Dependencies:
1) **"axios": "^1.6.7"**
2) **"dotenv": "^16.4.1"**
3) **"ejs": "^3.1.9"**
4) **"express": "^4.18.2"**
5) **"mongoose": "^8.1.1"**
6) **"path": "^0.12.7"**
