import React, {useEffect, useState} from "react";
import {Button, CircularProgress, Typography} from "@mui/material";
import {Box} from "@mui/system";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import QuestionComponent from "./Question.component";
import SelectInputComponent from "./SelectInput.component";
import TextInputComponent from "./TextInput.component";
import EndPage from "./EndPage";
import {displayError, displaySuccess} from "../utils";
import TransitionComponent from "./Transition.component";

const defaultChoice = {name: "Any", value: ""};

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

    const [quizConfig, setQuizConfig] = useState(defaultQuizConfig);

    const [quizState, setQuizState] = useState(defaultQuizState);

    const [questions, setQuestions] = useState([]);

    const [categories, setCategories] = useState([]);

    const [formErrors, setFormErrors] = useState({playerName: "", numQuestions: ""});

    let formValid = false;

    useEffect(() => {
        fetchSessionToken();
        fetchCategories();
        displaySuccess("Welcome To Quiz6300!");
    }, [])

    const updateQuizConfigItem = (key, value) => {
        setQuizConfig(prevState => ({
            ...prevState,
            [key]: value
        }))
    }

    const updateQuizStateItem = (key, value) => {
        setQuizState(prevState => ({
            ...prevState,
            [key]: value
        }))
    }

    const generateQuestionRequestUrl = () => {
        let url = "https://opentdb.com/api.php?";
        url = url + "amount=" + parseInt(quizConfig.numQuestions);
        if(quizConfig.category.value !== defaultChoice.value) url = url + "&category=" + quizConfig.category.value;
        if(quizConfig.difficulty.value !== defaultChoice.value) url = url + "&difficulty=" + quizConfig.difficulty.value;
        if(quizConfig.questionType.value !== defaultChoice.value) url = url + "&type=" + quizConfig.questionType.value;
        if(quizConfig.sessionToken !== defaultChoice.value) url = url + "&token=" + quizConfig.sessionToken;
        return url;
    }

    const fetchQuestions = () => {
        updateQuizStateItem("loading", true);
        fetch(generateQuestionRequestUrl())
            .then(res =>{
                return res.json();
            })
            .then(body => {
                setQuestions(body.results);
                updateQuizStateItem("loading", false);
            })
            .catch(err => {
                displayError(err.message);
            });
    }

    const fetchSessionToken = () => {
        updateQuizStateItem("loading", true);
        const url = "https://opentdb.com/api_token.php?command=request";
        if(quizConfig.sessionToken) resetSessionToken();
        else {
            fetch(url)
                .then(res => {
                    return res.json();
                })
                .then(body => {
                    updateQuizConfigItem("sessionToken", body.token);
                    updateQuizStateItem("loading", false);
                })
                .catch(err => {
                    displayError(err.message);
                })
        }
    }

    const resetSessionToken = () => {
        updateQuizStateItem("loading", true);
        const url = "https://opentdb.com/api_token.php?command=reset&token=" + quizConfig.sessionToken;
        fetch(url)
            .then(res => {
                return res.json();
            })
            .then(body => {
                updateQuizConfigItem("sessionToken", body.token);
                updateQuizStateItem("loading", false);
            })
            .catch(err  => {
                displayError(err.message);
            });
    }

    const handleConfigChange = e => {
        const {name, value} = e.target;
        if(e.type === "change") updateQuizConfigItem(name, value);
        else updateQuizConfigItem(name, {name, value})
    }

    const handleOnAnswer = (sentAnswer) => {
        questions[quizState.currQuestion]["answer"] = sentAnswer.answer;
        questions[quizState.currQuestion]["correct"] = sentAnswer.correct;
        if(sentAnswer.correct) updateQuizStateItem("currScore", quizState.currScore + 1);
        nextQuestion();
    }

    const nextQuestion = () => {
        if(quizState.currQuestion < questions.length - 1) updateQuizStateItem("currQuestion", quizState.currQuestion + 1)
        else finishQuiz();
    }

    const reset = () => {
        setQuizState(defaultQuizState);
        setQuestions([]);
    }

    const validateForm = () => {
        let playerNameError = "";
        let numQuestionsError = "";
        if(quizConfig.playerName.length >= 20) playerNameError = "Player Name Must Be Less Than 20 Characters Long."
        if(quizConfig.numQuestions < 1) numQuestionsError = "Number Of Questions Must Be Greater Than 0."
        if(isNaN(parseInt(quizConfig.numQuestions))) numQuestionsError = "Please Enter An Integer Value."
        setFormErrors({
            playerName: playerNameError,
            numQuestions: numQuestionsError,
        });
        formValid = playerNameError === "" && numQuestionsError === "";
    }

    const startQuiz = () => {
        if(!formValid) return
        fetchQuestions();
        if(quizConfig.playerName === "") updateQuizConfigItem("playerName", "Anonymous");
        updateQuizStateItem("started", true);
    }

    const finishQuiz = () => {
      updateQuizStateItem("finished", true);
    }

    const fetchCategories = () =>{
        const url = "https://opentdb.com/api_category.php";
        fetch(url)
            .then(res => {
                return res.json();
            })
            .then(body => {
                setCategories([defaultChoice].concat(body.trivia_categories));
            })
            .catch(err => {
                displayError(err.message);
            })
    }

    if(quizState.loading){
        return(
            <Box mt={20}>
                <CircularProgress/>
            </Box>
        );
    }

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
                       <Button type="submit" onClick={e => {e.preventDefault(); validateForm(); startQuiz();}} variant="contained">
                           Start <PlayArrowIcon/>
                       </Button>
                   </Box>
               </form>
            </TransitionComponent>
        );
    }

    if(quizState.finished){
        return(
            <TransitionComponent>
                <EndPage score={quizState.currScore} playerName={quizConfig.playerName} questions={questions} onPlayAgain={reset}/>
            </TransitionComponent>
        );
    }

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