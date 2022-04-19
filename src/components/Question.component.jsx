import React, {useEffect, useState} from "react";
import {Button, Typography} from "@mui/material";
import {Box} from "@mui/system";
import HTMLRenderer from "react-html-renderer";

const QuestionComponent = props => {

    const [selected, setSelected] = useState(null);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        if(props.question.type === 'multiple') {
            setAnswers(props.question.incorrect_answers.concat(props.question.correct_answer)
                .map(value => ({value, sort: Math.random()}))
                .sort((a, b) => a.sort - b.sort)
                .map(({value}) => value));
        } else {
            setAnswers(["True", "False"]);
        }
    }, [props.question])

    const handleSelect = (answerIndex) => {
        if(answerIndex !== selected){
            setSelected(answerIndex);
        }
    }

    const submitAnswer = () => {
        props.onAnswer(answers[selected] === props.question.correct_answer);
    }

    return(
        <div>
            <Typography mt={5}>
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