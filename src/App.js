import {Container, Typography} from "@mui/material";
import {Box} from "@mui/system";
import {ToastContainer} from 'react-toastify';
import {AnimatePresence} from "framer-motion";
import ParticlesBg from 'particles-bg'

import Quiz from "./components/QuizComponents/Quiz";
import ImageComponent from "./components/QuizComponents/Image.component";
import TransitionComponent from "./components/QuizComponents/Transition.component";

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import logo from "./media/images/quiz.png";


const App = () => {

    // config for custom animated background
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
            <AnimatePresence exitBeforeEnter={true}>
                <Container>
                    <Box textAlign="center" mt={5}>
                        <TransitionComponent>
                            <ImageComponent src={logo} width={200}/>
                            <Typography variant="h2" fontWeight="bold" fontStyle="italic">
                                Quiz6300
                            </Typography>
                        </TransitionComponent>
                        <Quiz/>
                    </Box>
                </Container>
            </AnimatePresence>
            <ParticlesBg type="custom" config={config} bg={true}/>
            <ToastContainer/>
        </div>
      );
}

export default App;
