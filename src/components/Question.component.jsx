import React from "react";

const QuestionComponent = props => {
    return(
        <p>{props.key + ". " + props.question.toString()}</p>
    );
}

export default QuestionComponent;