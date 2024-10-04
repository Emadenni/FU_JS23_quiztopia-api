# FU_JS23_quiztopia-api



This API allows users to manage quizzes, register points for answers, and retrieve leaderboard information. It provides functionalities for user registration, quiz creation, question management, and score tracking.

## API Endpoints

### User Endpoints
- **POST** `/users` - Create a new user
- **POST** `/login` - Log in an existing user

### Quiz Endpoints
- **POST** `/quizzes` - Create a new quiz
- **GET** `/quizzes` - Retrieve a list of all quizzes
- **GET** `/quizzes/{quizId}` - Retrieve details of a specific quiz
- **DELETE** `/quizzes/{quizId}` - Delete a specific quiz
- **POST** `/quizzes/questions/{quizId}` - Add questions to a quiz
- **GET** `/quizzes/{quizId}/leaderboard` - Retrieve the leaderboard for a specific quiz
- **PUT** `/quizzes/score/{quizId}/{questionId}` - Register points for answers to questions in a quiz
