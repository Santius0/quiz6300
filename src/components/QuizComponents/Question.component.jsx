import React, {useEffect, useState} from "react";
import {Button, Typography} from "@mui/material";
import {Box} from "@mui/system";
import HTMLRenderer from "react-html-renderer";


// component to render each question
const QuestionComponent = props => {

    const [selected, setSelected] = useState(null);
    const [answers, setAnswers] = useState([]);

    // on load, add the options for the question
    // for multiple choice, we add the correct answer in and shuffle the solutions around
    useEffect(() => {
        if(props.question.type === 'multiple') {
            setAnswers(props.question.incorrect_answers.concat(props.question.correct_answer)
                .map(value => ({value, sort: Math.random()}))
                .sort((a, b) => a.sort - b.sort)
                .map(({value}) => value));
        } else {
            setAnswers(["True", "False"]);
        }
        setSelected(null);
    }, [props.question])

    const handleSelect = (answerIndex) => {
        if(answerIndex !== selected){
            setSelected(answerIndex);
        }
    }

    const submitAnswer = () => {
        props.onAnswer({correct: answers[selected] === props.question.correct_answer, answer: answers[selected]});
    }

    return(
        <div>
            <Typography variant="h5" fontWeight="bold" fontStyle="italic" mt={5}>
                <HTMLRenderer html={props.question.question}/>
            </Typography>
            {answers.map((value, index) => (
                <Box mt={2} key={index}>
                    <Button onClick={() => handleSelect(index)} variant="contained" color={selected === index ? "success" : "primary"}>
                        <HTMLRenderer html={value}/>
                    </Button>
                </Box>
            ))}
            <Box mt={3}>
                <Button disabled={selected === null} onClick={submitAnswer} variant="outlined">Answer</Button>
            </Box>
        </div>
    );
}

export default QuestionComponent;