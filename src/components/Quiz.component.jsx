import React, {useEffect, useState} from "react";
import {Box} from "@mui/system";
import {Typography, CircularProgress, Button} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';

import QuestionComponent from "./Question.component";
import SelectInputComponent from "./SelectInput.component";
import TextInputComponent from "./TextInput.component";

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

const QuizComponent = () => {

    const defaultQuizConfig = {
        playerName: "",
        numQuestions: 1,
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

    useEffect(() => {
        fetchSessionToken();
        // fetchQuestions();
        fetchCategories();
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
        url = url + "amount=" + quizConfig.numQuestions;
        if(quizConfig.category.value !== defaultChoice.value) url = url + "&category=" + quizConfig.category.value;
        if(quizConfig.difficulty.value !== defaultChoice.value) url = url + "&difficulty=" + quizConfig.difficulty.value;
        if(quizConfig.questionType.value !== defaultChoice.value) url = url + "&type=" + quizConfig.questionType.value;
        if(quizConfig.sessionToken !== defaultChoice.value) url = url + "&token=" + quizConfig.sessionToken;
        return url;
    }

    const fetchQuestions = () => {
        console.log(quizConfig);
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
                console.log(err)
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
                    console.log(err);
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
                console.log(err);
            });
    }

    const handleConfigChange = e => {
        updateQuizConfigItem(e.target.name, e.target.value);
    }

    const handleOnAnswer = (correct) => {
        if(correct) updateQuizStateItem("currScore", quizState.currScore + 1);
        nextQuestion();
    }

    const nextQuestion = () => {
        if(quizState.currQuestion < questions.length - 1) updateQuizStateItem("currQuestion", quizState.currQuestion + 1)
        else finishQuiz();
    }

    const reset = () => {
        // setQuizConfig(defaultQuizConfig);
        setQuizState(defaultQuizState);
        setQuestions([]);
        fetchQuestions();
    }

    const startQuiz = () => {
        fetchQuestions();
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
                console.log(err);
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
           <form>
               <TextInputComponent label="Player Name" name="playerName" type="text" defaultValue={quizConfig.playerName} onChange={handleConfigChange}/>
               <TextInputComponent label="Number of Questions" name="numQuestions" type="number" defaultValue={quizConfig.numQuestions} onChange={handleConfigChange}/>
               <SelectInputComponent label="Category" name="category" options={categories.map(item => ({name: item.name, value: item.id}))} defaultOption={quizConfig.category} onChange={handleConfigChange}/>
               <SelectInputComponent label="Difficulty" name="difficulty" options={difficulties} defaultOption={quizConfig.difficulty} defaultOptiononChange={handleConfigChange}/>
               <SelectInputComponent label="Question Type" name="questionType" options={questionTypes} defaultOption={quizConfig.questionType} onChange={handleConfigChange}/>
               <Box mt={3}>
                   <Button type="submit" onClick={e => {e.preventDefault(); startQuiz();}} variant="contained">
                       Start <PlayArrowIcon/>
                   </Button>
               </Box>
           </form>
        );
    }

    if(quizState.finished){
        return (
            <Box mt={30}>
                <Typography variant="h3" fontWeight="bold" mb={3}>
                    Final Sore: {quizState.currScore}
                </Typography>
                <Button onClick={e => {e.preventDefault(); reset();}}>
                    Play Again! <ReplayIcon/>
                </Button>
            </Box>
        );
    }

    return(
        <div>
            <Box>
                <Typography variant="h4">Question: {quizState.currQuestion + 1}/{questions.length}</Typography>
                <QuestionComponent question={questions[quizState.currQuestion]} onAnswer={handleOnAnswer}/>
                <Box mt={5}>
                    Score: {quizState.currScore} / {questions.length}
                </Box>
            </Box>
        </div>
    );
}

export default QuizComponent;