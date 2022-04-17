import React, {useEffect, useState} from "react";
import "./Question.css";

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
    }, [])


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
            <h1>{props.question.question}</h1>
            {answers.map((value, index) => (
                <p className={selected === index ? "selected" : ""} key={index} onClick={() => handleSelect(index)}>{value}</p>
            ))}
            <button disabled={selected === null} onClick={submitAnswer}>Answer</button>
        </div>
    );
}

export default QuestionComponent;