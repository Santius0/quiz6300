import React, {useMemo, useRef} from "react";
import {Box} from "@mui/system";
import ImageComponent from "./Image.component";
import {Button, Typography} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";

import happy from "../media/images/happy.png";
import sad from "../media/images/sad.png";
import HTMLRenderer from "react-html-renderer";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const EndPage = ({score, playerName, questions, onPlayAgain}) => {

    const solutionsRef = useRef(null);

    const onClickedPlayAgain = e => {
        e.preventDefault();
        onPlayAgain();
    }

    const passed = useMemo(() => {
        return score >= Math.ceil(questions.length/2);
    }, [score, questions]);

    return (
        <Box mt={2}>
            <ImageComponent src={passed ? happy : sad} width={200} height={200}/>
            <Box mt={6}>
                <Typography variant="h3" fontWeight="bold" mb={2}>
                    {passed ? "Well Done!" + playerName : "Sorry " + playerName + ". Better Luck Next Time"}
                </Typography>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                    Score: {score}
                </Typography>
                <Button onClick={onClickedPlayAgain}>
                    Play Again! <ReplayIcon/>
                </Button>
            </Box>
            <Button color="secondary" onClick={() => solutionsRef.current.scrollIntoView({behavior: "smooth"})}>
                See Your Results Below <ArrowDownwardIcon/>
            </Button>
            <Box mt={2} mb={5} ref={solutionsRef}>
                {questions.map((item, index) => (
                    <div key={index}>
                        <Box mt={3}>
                            <Button className="no-click">
                                <Typography fontWeight="bolder"><HTMLRenderer html={item.question}/></Typography>
                            </Button>
                        </Box>
                        <Button className="no-click" color={item.correct ? "success" : "error"}>
                            <Typography><b>Your Answer:</b> <HTMLRenderer html={item.answer}/></Typography>
                        </Button>
                        {!item.correct ?
                            <Button className="no-click" color="success">
                                <Typography><b>Correct Answer:</b> <HTMLRenderer html={item.correct_answer}/></Typography>
                            </Button>
                            :
                            null
                        }
                    </div>
                    ))}
            </Box>
        </Box>
    );
}

export default EndPage;