# Quiz App For COMP 6300 Assignment 3

### Homepage: <a href="https://santius0.github.io/quiz6300/" target="_blank"> https://santius0.github.io/quiz6300/ </a>

#### Uses the <a href="https://opentdb.com/api_config.php" target="_blank">Open Trivia DB API</a> to create a simple quiz app. App allows a user to enter a player name and their preferred number of questions as well as select a category, difficultly and question type. The user then goes through the quiz selecting answers from the provided solutions, after which they are presented with their score and results. If player name is left blank the player is given the name 'Anonymous'. Number of questions is required. All other fields can be left blank as the default option is 'Any', if no value is provided for them the API will return questions without filtering with these fields. The API will attempt to get as close to as many questions as requested but fewer questions are available the more options are selected. For example if you select the category of Science: Mathematics, 20 questions, hard, True/False, there may only be 5 questions that meet that criteria and so only 5 questions will be returned. 

##### Resources Used:
1. [MUI](https://mui.com)
2. [particles-bg](https://github.com/lindelof/particles-bg)
3. [Framer Motion](https://www.framer.com/docs/animation/)
4. [React Toastify](https://www.npmjs.com/package/react-toastify)
5. [React HTML Renderer](https://www.npmjs.com/package/react-html-renderer)
6. [Github Pages](https://www.npmjs.com/package/gh-pages)
7. Icons From [FlatIcon](https://www.flaticon.com/)
   1. <a href="https://www.flaticon.com/free-icons/happy" title="happy icons">Happy icons created by Freepik - Flaticon</a>
   2. <a href="https://www.flaticon.com/free-icons/sad" title="sad icons">Sad icons created by justicon - Flaticon</a>
   3. <a href="https://www.flaticon.com/free-icons/quiz" title="quiz icons">Quiz icons created by smashingstocks - Flaticon</a>
