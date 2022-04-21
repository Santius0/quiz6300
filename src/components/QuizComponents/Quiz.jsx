import React, {useEffect, useState} from "react";
import {Button, LinearProgress, Typography} from "@mui/material";
import {Box} from "@mui/system";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import QuestionComponent from "./Question.component";
import SelectInputComponent from "./SelectInput.component";
import TextInputComponent from "./TextInput.component";
import EndPage from "./EndPage";
import {displayError, displaySuccess} from "../../utils";
import TransitionComponent from "./Transition.component";

// ppl think things that load too fast are unreliable, so we have a minimum permitted load time to use for artificial
// slowdown
const minLoadTime = 1; //minimum load time in seconds

// constant quiz configuration values
const defaultChoice = {name: "Any", value: ""}; // default choice if no value is provided by user

// difficulties and question types are recorded in Open Trivia DB API documentation but are not provided by any
// endpoint, so we're going to hard code them in here
const difficulties = [
    defaultChoice,
    {name: "Easy", value: "easy"},
    {name: "Medium", value: "medium"},
    {name: "Hard", value: "hard"},
];

const questionTypes = [
    defaultChoice,
    {name: "Multiple Choice", value: "multiple"},
    {name: "True/False", value: "boolean"},
];

const Quiz = () => {
    // default/starting values for quiz
    // gets reset back to these on a page refresh
    const defaultQuizConfig = {
        playerName: "",
        numQuestions: 10,
        category: defaultChoice,
        difficulty: difficulties[0],
        questionType: questionTypes[0],
        sessionToken: defaultChoice.value,
    };

    const defaultQuizState = {
        loading: false,
        currQuestion: 0,
        currScore: 0,
        started: false,
        finished: false,
    };

    // quiz state
    const [quizConfig, setQuizConfig] = useState(defaultQuizConfig);    // data entered by user and fetched by API
    const [quizState, setQuizState] = useState(defaultQuizState);       // data used to run the game such as score etc.
    const [questions, setQuestions] = useState([]);            // list of questions obtained by API
    const [categories, setCategories] = useState([]);          // list of question categories obtained by API
    const [formErrors, setFormErrors] = useState({playerName: "", numQuestions: ""}); // for displaying form
                                                                                               // validations messages

    let formValid = false; // for form validation

    let tic = null;     // for tracking loading times for artificial slowdown
    let toc = null;

    // runs single time on first render
    useEffect(() => {
        fetchSessionToken(); // fetch or refresh session token if one already present. session token lasts 6 hours and
                             // ensures you don't get repeated questions when you hit play again.
                             // this can be stored on the user's browser, fetched and refreshed when necessary using
                             // localStorage for example, but the choice was made here to simply get a new token on
                             // entry

        fetchCategories();   // fetch categories from Open Trivia DB API.
                             // appends default category, {id: "", name: "Any"} to top of category list

        displaySuccess("Welcome To Quiz6300!"); // welcome message
    }, [])

    // starts or stop loading. if stopping, will wait loadTime seconds before updating loading state
    const load = (loadingStart, loadTime = minLoadTime) => {
        if (!loadingStart) {                              // if ending loading
            toc = (new Date()).getTime();
            loadTime = loadTime*1000;
            const elapsed = toc - tic;
            if (elapsed < loadTime) setTimeout(() => updateQuizStateItem("loading", loadingStart), (loadTime - elapsed)); // artificial slowdown
            else updateQuizStateItem("loading", loadingStart);
            tic = null;
            toc = null;
        } else {                                         // if starting loading
            tic = (new Date()).getTime();
            updateQuizStateItem("loading", loadingStart);
        }
    }

    // updates a single item in the quizConfig state
    const updateQuizConfigItem = (key, value) => {
        setQuizConfig(prevState => ({
            ...prevState,
            [key]: value
        }))
    }

    // updates a single item in the quizState state
    const updateQuizStateItem = (key, value) => {
        setQuizState(prevState => ({
            ...prevState,
            [key]: value
        }))
    }

    // creates the Open Trivia DB URL to be used for fetching questions based on the current configuration selected by
    // the user
    const generateQuestionRequestUrl = () => {
        // amount i.e number of questions can't be blank. everything else can be blank and is simply left out if it is
        let url = "https://opentdb.com/api.php?";
        url = url + "amount=" + parseInt(quizConfig.numQuestions);
        if(quizConfig.category.value !== defaultChoice.value) url = url + "&category=" + quizConfig.category.value;
        if(quizConfig.difficulty.value !== defaultChoice.value) url = url + "&difficulty=" + quizConfig.difficulty.value;
        if(quizConfig.questionType.value !== defaultChoice.value) url = url + "&type=" + quizConfig.questionType.value;
        if(quizConfig.sessionToken !== defaultChoice.value) url = url + "&token=" + quizConfig.sessionToken;
        return url;
    }

    // fetch questions from the Open Trivia DB based on the current configuration selected by the user
    const fetchQuestions = () => {
        load(true);
        fetch(generateQuestionRequestUrl())
            .then(res =>{
                return res.json();
            })
            .then(body => {
                setQuestions(body.results);
            })
            .catch(err => {
                displayError(err.message);
            })
            .finally(() => load(false));
    }

    // fetch sessions token from Open Trivia DB. if already have token refresh it instead.
    const fetchSessionToken = () => {
        load(true);
        const url = "https://opentdb.com/api_token.php?command=request";
        if(quizConfig.sessionToken) resetSessionToken();
        else {
            fetch(url)
                .then(res => {
                    return res.json();
                })
                .then(body => {
                    updateQuizConfigItem("sessionToken", body.token);
                })
                .catch(err => {
                    displayError(err.message);
                })
                .finally(() => load(false, 0.2));
        }
    }

    // refresh Open Trivia DB token
    const resetSessionToken = () => {
        load(true);
        const url = "https://opentdb.com/api_token.php?command=reset&token=" + quizConfig.sessionToken;
        fetch(url)
            .then(res => {
                return res.json();
            })
            .then(body => {
                updateQuizConfigItem("sessionToken", body.token);
            })
            .catch(err  => {
                displayError(err.message);
            })
            .finally(() => load(false, 0.2));
    }

    // fetches categories for user to pick from. called once on first render with useEffect
    const fetchCategories = () => {
        updateQuizStateItem("loading", true);
        const url = "https://opentdb.com/api_category.php";
        fetch(url)
            .then(res => {
                return res.json();
            })
            .then(body => {
                setCategories([{id:"", name:"Any"}].concat(body.trivia_categories));
            })
            .catch(err => {
                displayError(err.message);
            })
            .finally(() => updateQuizStateItem("loading", false));
    }

    // updates quizConfig state as forms are used
    const handleConfigChange = e => {
        const {name, value} = e.target;
        if(e.type === "change") updateQuizConfigItem(name, value);
        else updateQuizConfigItem(name, {name, value})
    }

    // is called when a used locks in an answer
    // saves the question, along with the answer chosen and if it was was correct for results and moves to next question
    const handleOnAnswer = (sentAnswer) => {
        questions[quizState.currQuestion]["answer"] = sentAnswer.answer;
        questions[quizState.currQuestion]["correct"] = sentAnswer.correct;
        if(sentAnswer.correct) updateQuizStateItem("currScore", quizState.currScore + 1);
        nextQuestion();
    }

    // moves to next question, if on the last question finish quiz instead
    const nextQuestion = () => {
        if(quizState.currQuestion < questions.length - 1) updateQuizStateItem("currQuestion", quizState.currQuestion + 1)
        else finishQuiz();
    }

    // reset quiz to play again
    const reset = () => {
        setQuizState(defaultQuizState);
        fetchSessionToken();
        setQuestions([]);
    }

    // validate form data. only need to validate playerName and numQuestions, the others are selectable and can be blank
    const validateForm = () => {
        let playerNameError = "";
        let numQuestionsError = "";
        if(quizConfig.playerName.length >= 20) playerNameError = "Player Name Must Be Less Than 20 Characters Long."
        if(quizConfig.numQuestions < 1) numQuestionsError = "Number Of Questions Must Be Greater Than 0."
        if(isNaN(parseInt(quizConfig.numQuestions))) numQuestionsError = "Please Enter A Whole Number."
        if(quizConfig.numQuestions === "") numQuestionsError = "Number Of Questions Cannot Be Blank."
        setFormErrors({
            playerName: playerNameError,
            numQuestions: numQuestionsError,
        });
        formValid = playerNameError === "" && numQuestionsError === "";
    }

    // fetch questions and starts quiz
    const startQuiz = () => {
        if(!formValid) return
        fetchQuestions();
        if(quizConfig.playerName === "") updateQuizConfigItem("playerName", "Anonymous");
        updateQuizStateItem("started", true);
    }

    // ends quiz
    const finishQuiz = () => {
      updateQuizStateItem("finished", true);
    }

    // if loading display loading bar
    if(quizState.loading){
        return(
            <Box mt={20}>
                <LinearProgress color="primary"/>
            </Box>
        );
    }

    // if not started display config screen
    if(!quizState.started){
        return (
            <TransitionComponent>
               <form>
                   <TextInputComponent label="Player Name" name="playerName" type="text" defaultValue={quizConfig.playerName} onChange={handleConfigChange} error={formErrors.playerName !== ""} errorText={formErrors.playerName}/>
                   <TextInputComponent label="Number of Questions" name="numQuestions" type="number" defaultValue={quizConfig.numQuestions} onChange={handleConfigChange} error={formErrors.numQuestions !== ""} errorText={formErrors.numQuestions}/>
                   <SelectInputComponent label="Category" name="category" options={categories.map(item => ({name: item.name, value: item.id}))} defaultOption={quizConfig.category} onChange={handleConfigChange}/>
                   <SelectInputComponent label="Difficulty" name="difficulty" options={difficulties} defaultOption={quizConfig.difficulty} onChange={handleConfigChange}/>
                   <SelectInputComponent label="Question Type" name="questionType" options={questionTypes} defaultOption={quizConfig.questionType} onChange={handleConfigChange}/>
                   <Box mt={3}>
                       <Button type="submit" onClick={e => {e.preventDefault(); validateForm(); startQuiz();}} variant="contained" fullWidth={true}>
                           Start <PlayArrowIcon/>
                       </Button>
                   </Box>
               </form>
            </TransitionComponent>
        );
    }

    // if finished display end screen
    if(quizState.finished){
        return(
            <TransitionComponent>
                <EndPage score={quizState.currScore} playerName={quizConfig.playerName} questions={questions} onPlayAgain={reset}/>
            </TransitionComponent>
        );
    }

    // display quiz screen with questions
    return(
        <div>
            <Box>
                <TransitionComponent>
                    <Typography variant="h4">Question: {quizState.currQuestion + 1}/{questions.length}</Typography>
                    <QuestionComponent question={questions[quizState.currQuestion]} onAnswer={handleOnAnswer}/>
                </TransitionComponent>
            </Box>
        </div>
    );
}

export default Quiz;