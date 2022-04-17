import React, {useEffect, useState} from "react";
import QuestionComponent from "./Question.component";

import "./form.css";

const QuizComponent = () => {

    const [quizConfig, setQuizConfig] = useState({
        playerName: "",
        numQuestions: 10,
        category: null,
        difficulty: null,
        questionType: null,
        sessionToken: null,
    });
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        fetchSessionToken();
        // fetchQuestions();
    }, [])

    const generateQuestionRequestUrl = () => {
        let url = "https://opentdb.com/api.php?";
        url = url + "amount=" + quizConfig.numQuestions;
        if(quizConfig.category) url = url + "&category=" + quizConfig.category;
        if(quizConfig.difficulty) url = url + "&difficulty=" + quizConfig.difficulty;
        if(quizConfig.questionType) url = url + "&type=" + quizConfig.questionType;
        if(quizConfig.sessionToken) url = url + "&token=" + quizConfig.sessionToken;
        return url;
    }

    const fetchQuestions = () => {
        fetch(generateQuestionRequestUrl())
            .then(res =>{
                return res.json();
            })
            .then(body => {
                console.log(body.results);
                setQuestions(body.results);
            })
            .catch(err => {
                console.log(err)
            });
    }

    const fetchSessionToken = () => {
        const url = "https://opentdb.com/api_token.php?command=request";
        if(quizConfig.sessionToken) resetSessionToken();
        else {
            fetch(url)
                .then(res => {
                    return res.json();
                })
                .then(body => {
                    setQuizConfig(prevState => ({
                        ...prevState,
                        sessionToken: body.token
                    }));
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const resetSessionToken = () => {
      const url = "https://opentdb.com/api_token.php?command=reset&token=" + quizConfig.sessionToken;
      fetch(url)
          .then(res => {
              return res.json();
          })
          .then(body => {
              setQuizConfig(prevState => ({
                  ...prevState,
                  sessionToken: body.token
              }));
          })
          .catch(err  => {
              console.log(err);
          });
    }

    return(
        <div>
            <div className="react-form-container"> </div>
            {questions.map((value, index) => (
                <QuestionComponent key={index} question={value}/>
            ))}
        </div>
    );
}

export default QuizComponent;