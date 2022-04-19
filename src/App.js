import logo from "./media/images/quiz.png";
import {useMemo} from "react";
import './App.css';
import Quiz from "./components/Quiz";
import {Container, Typography} from "@mui/material";
import {Box} from "@mui/system";
import ParticlesBg from 'particles-bg'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {AnimatePresence} from "framer-motion";

import ImageComponent from "./components/Image.component";
import TransitionComponent from "./components/Transition.component";

const bgAnimations = ['custom', 'cobweb'];

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

    const bg = useMemo(() => Math.floor(Math.random() * bgAnimations.length), []);

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
                            <Quiz/>
                        </TransitionComponent>
                    </Box>
                </Container>
            </AnimatePresence>
            <ParticlesBg type={bgAnimations[bg]} config={config} bg={true}/>
            <ToastContainer/>
        </div>
      );
}

export default App;
