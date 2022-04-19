import './App.css';
import QuizComponent from "./components/Quiz.component";
import {Container, Typography} from "@mui/material";
import {Box} from "@mui/system";
import ParticlesBg from 'particles-bg'

import ImageComponent from "./components/Image.component";


import logo from "./media/images/quiz.png";

const App = () => {

    let config = {
        num: [4, 7],
        rps: 0.1,
        radius: [5, 40],
        life: [1.5, 3],
        v: [2, 3],
        tha: [-50, 50],
        alpha: [0.6, 0],
        scale: [.1, 0.9],
        position: "all",
        cross: "dead",
        random: 20
    };

    return (
        <div>
            <Container>
                <Box textAlign="center" mt={5}>
                    <ImageComponent src={logo} width={200}/>
                    <Typography variant="h2" fontWeight="bold" fontStyle="italic">
                        Quiz6300
                    </Typography>
                    <QuizComponent/>
                </Box>
            </Container>
            <ParticlesBg type="custom" config={config} bg={true}/>
        </div>
      );
}

export default App;
