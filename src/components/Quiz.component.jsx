import React, {useEffect, useState} from "react";
import QuestionComponent from "./Question.component";
import HTMLRenderer from 'react-html-renderer'

// import "./form.css";

const QuizComponent = () => {

    const defaultQuizConfig = {
        playerName: "",
        numQuestions: 1,
        category: "",
        difficulty: "",
        questionType: "",
        sessionToken: "",
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
        if(quizConfig.category !== "") url = url + "&category=" + quizConfig.category;
        if(quizConfig.difficulty !== "") url = url + "&difficulty=" + quizConfig.difficulty;
        if(quizConfig.questionType !== "") url = url + "&type=" + quizConfig.questionType;
        if(quizConfig.sessionToken !== "") url = url + "&token=" + quizConfig.sessionToken;
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
                setCategories(body.trivia_categories);
            })
            .catch(err => {
                console.log(err);
            })
    }

    let questionComponents = [];
    for(let i=0; i<questions.length; i++){
        questionComponents.push(<QuestionComponent key={i} question={questions[i]} onAnswer={handleOnAnswer}/>);
    }

    if(quizState.loading) return <h1>Loading...</h1>

    if(!quizState.started){
        return (
            <form>
                <input type="text" value={quizConfig.playerName} onChange={handleConfigChange} name="playerName" placeholder="name"/>
                <input type="number" value={quizConfig.numQuestions} onChange={handleConfigChange} name="numQuestions" placeholder="Number Of Questions"/>
                <select value={quizConfig.category} onChange={handleConfigChange} name="category">
                    <option value="">Any</option>
                    {categories.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
                <select value={quizConfig.difficulty} onChange={handleConfigChange} name="difficulty">
                    <option value="">Any</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <select value={quizConfig.questionType} onChange={handleConfigChange} name="questionType">
                    <option value="">Any</option>
                    <option value="multiple">Multiple Choice</option>
                    <option value="boolean">True/False</option>
                </select>
                <button type="submit" onClick={e => {e.preventDefault(); startQuiz();}}>Start Quiz</button>
            </form>
        );
    }

    if(quizState.finished){
        return (
            <div>
                <h3>Final Score: {quizState.currScore}/{questions.length}</h3>
                <button onClick={e => {e.preventDefault(); reset();}}>Restart</button>
            </div>
        );
    }

    return(
        <div>
            <div className="react-form-container"> </div>
            <h3>Question: {quizState.currQuestion + 1}/{questions.length}</h3>
            <h3>Score: {quizState.currScore}</h3>
            {questionComponents[quizState.currQuestion]}
        </div>
    );
}

export default QuizComponent;