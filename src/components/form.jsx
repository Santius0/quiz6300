
import React from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";
import { SwitchTransition, CSSTransition } from "https://cdn.skypack.dev/react-transition-group";
import * as PIXI from "https://cdn.skypack.dev/pixi.js"
import gsap from "https://cdn.skypack.dev/gsap";
import { PixiPlugin } from "https://cdn.skypack.dev/gsap/PixiPlugin";

const reactFormContainer = document.querySelector('.react-form-container')

gsap.registerPlugin(PixiPlugin);

PixiPlugin.registerPIXI(PIXI);

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            name: "",
            email: "",
            phone: "",
            interest: "",
            isSubmitting: false,
            submitted: false,
            processComplete: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleTimeout = this.handleTimeout.bind(this)


        gsap.set('body', {
            background: 'linear-gradient(80deg, var(--depths) 0%, var(--abyss) 100%)', duration: 0.5,
        });

    }

    handleChange = (e) => {
        let newState = {}

        if (e.target.type == "select-one") {
            newState[e.target.name] = e.target.options[e.target.selectedIndex].value;
        } else {
            newState[e.target.name] = e.target.value;
        }

        this.setState(newState);

    }

    handleTimeout = (e) => {
        gsap.to(background, {
            pixi: { alpha: 1 }, duration: 3,
        });
        setTimeout(() => {
            this.setState({
                name: "",
                email: "",
                phone: "",
                interest: "",
                isSubmitting: false,
                submitted: false,
                processComplete: true
            });

            var tl = gsap.timeline({});

            tl.to(horror, {
                pixi: { alpha: 1 }, y: pixiApp.screen.height / 2, duration: 5,
            });

            tl.to(sigil, {
                pixi: { alpha: 1 }, y: pixiApp.screen.height / 7, duration: 5,
            }, "<50%");

            tl.to(horror, {
                pixi: { scaleX: 99, scaleY: 99 }, duration: 5,
            }, "+=1");

        }, 5000);
    }

    handleSubmit = (e, message) => {
        e.preventDefault()

        let formData = {
            formSender: this.state.name,
            formEmail: this.state.email,
            formTelephone: this.state.phone,
            formInterest: this.state.interest,
        }

        if (formData.formSender.length < 1 || formData.formEmail.length < 1 || formData.formTelephone.length < 1 || formData.formInterest.length < 1) {
            return false
        }

        this.setState({
            isSubmitting: true,
            submitted: false
        })

        setTimeout(() => {
            this.setState({
                isSubmitting: false,
                submitted: true
            });
        }, 2000);

    }

    render() {
        const isSubmitted = this.state.submitted;
        let screen;

        if (!isSubmitted) {
            screen = <ReactForm {...this.state} handleChange={this.handleChange} handleSubmit={this.handleSubmit} />;
        } else {
            screen = <ReactFormConfirmation {...this.state} handleTimeout={this.handleTimeout} />;
        }

        if (this.state.processComplete) {
            screen = false;
        }

        return (
            <>
                <SwitchTransition>
                    <CSSTransition
                        key={isSubmitted}
                        timeout={1300}
                        classNames="fade"
                        unmountOnExit
                        appear
                    >
                        <div>
                            {screen}
                        </div>
                    </CSSTransition>
                </SwitchTransition>

            </>
        )
    }
}

class ReactFormConfirmation extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.handleTimeout();
    }

    render() {
        return (
            <div className="confirmation">
                <img src="https://res.cloudinary.com/da7xooclf/image/upload/v1635044773/sigil_zj08kx.png" alt="" width="117.02" height="120" />
                <h1>Thank you for making contact, <span>{this.props.name}</span>.</h1>
                <p>Please be patient as we prepare, <strong>{this.props.interest}</strong>.</p>
            </div>
        )
    }
}

class ReactForm extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidUpdate(prevProps) {
        let fields = [this.props.name.length, this.props.email.length, this.props.phone.length, this.props.interest.length];
        let filledFields = 0;
        for (var i = 0; i < fields.length; ++i) {
            if (fields[i] != 0)
                filledFields++;
        }

        if (filledFields == 1) {
            gsap.to('body', {
                background: 'linear-gradient(100deg, var(--depths) 0%, var(--abyss) 100%)', duration: 0.5,
            });
        }
        if (filledFields == 2) {
            gsap.to('body', {
                background: 'linear-gradient(140deg, var(--depths) 0%, var(--abyss) 100%)', duration: 0.5,
            });
        }
        if (filledFields == 3) {
            gsap.to('body', {
                background: 'linear-gradient(160deg, var(--depths) 0%, var(--abyss) 100%)', duration: 0.5,
            });
        }
        if (filledFields == 4) {
            gsap.to('body', {
                background: 'linear-gradient(180deg, var(--depths) 0%, var(--abyss) 100%)', duration: 0.5,
            });
        }

    }

    render() {

        return (
            <div className="form">

                <div className="title">
                    <h1 className="title__real">
                        Make contact with the <span>Great Old Ones</span>
                    </h1>
                </div>

                <form className='react-form' autoComplete="off" onSubmit={this.props.handleSubmit}>

                    <div className="form-row">
                        <div className='form-group'>
                            <label htmlFor='formName'>Name</label>
                            <input id='formName' className='form-input' name='name' type='text' autoComplete="off" required onChange={this.props.handleChange} value={this.props.name} />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='formEmail'>Email</label>
                            <input id='formEmail' className='form-input' name='email' type='email' autoComplete="off" required onChange={this.props.handleChange} value={this.props.email} />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='formTelephone'>Phone number</label>
                            <input id='formTelephone' className='form-input' name='phone' type='text' autoComplete="off" required onChange={this.props.handleChange} value={this.props.phone} />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='formChoice'>Area of interest</label>
                            <div className="select-wrapper">
                                <select value={this.props.interest} name="interest" id="formChoice" autoComplete="off" required onChange={this.props.handleChange}>
                                    <option disabled value="">Select an option</option>
                                    <option value="Horrors beyond comprehension">💀 Horrors beyond comprehension</option>
                                    <option value="Eldritch terrors">🐙 Eldritch terrors</option>
                                    <option value="Forbidden knowledge">🧠 Forbidden knowledge</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-row form-row--footer">
                        <div className='form-group'>
                            <input id='formButton' className='btn' type='submit' placeholder='Send message' value={this.props.isSubmitting ? 'Transmitting...' : 'Make contact'} />
                        </div>
                        <div className="form-group">
                            <p className="disclaimer">By clicking on the submit button and submitting this form you will be indicating your consent to receiving eldritch communications via transmitted thought as outlined in our privacy policy.</p>
                        </div>
                    </div>
                </form>

            </div>
        )
    }
}

ReactDOM.render(<App />, reactFormContainer);

// Pixi app

PIXI.utils.skipHello();

const pixiApp = new PIXI.Application({
    backgroundAlpha: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: 1,
    antialias: true,
});

document.body.appendChild(pixiApp.view);

pixiApp.ticker.stop();

gsap.ticker.add(() => {
    pixiApp.ticker.update();
});

const container = new PIXI.Container();

pixiApp.stage.addChild(container);

const icon = PIXI.Texture.from('https://res.cloudinary.com/da7xooclf/image/upload/v1635044773/sigil_zj08kx.png');
const monster = PIXI.Texture.from('https://res.cloudinary.com/da7xooclf/image/upload/v1635543880/chthulu_fkkq3r.png');
const bg = PIXI.Texture.from('https://res.cloudinary.com/da7xooclf/image/upload/v1635548182/bg_dmqtdn_mv4z9d.png');

const background = new PIXI.Sprite(bg);
background.scale.set(1.0, 1.0);
background.anchor.set(0.5, 0.5);
background.x = 2 * pixiApp.screen.width / 4;
background.y = pixiApp.screen.height / 2;
background.alpha = 0;
pixiApp.stage.addChild(background);

const displacementSprite = PIXI.Sprite.from('https://res.cloudinary.com/da7xooclf/image/upload/v1635616672/displacement_map_repeat_tfirah.jpg');

displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
displacementFilter.padding = 10;

displacementSprite.position = background.position;

pixiApp.stage.addChild(displacementSprite);

background.filters = [displacementFilter];

displacementFilter.scale.x = 60;
displacementFilter.scale.y = 120;

const sigil = new PIXI.Sprite(icon);
sigil.scale.set(0.9, 0.9);
sigil.anchor.set(0.5, 0.5);
sigil.x = 2 * pixiApp.screen.width / 4;
sigil.y = 0;
sigil.alpha = 0;
pixiApp.stage.addChild(sigil);

const horror = new PIXI.Sprite(monster);
horror.scale.set(1.0, 1.0);
horror.anchor.set(0.5, 0.5);
horror.x = 2 * pixiApp.screen.width / 4;
horror.y = pixiApp.screen.height;
horror.alpha = 0;
pixiApp.stage.addChild(horror);

gsap.to(sigil, {
    rotation: 2 * Math.PI, duration: 5, repeat: -1, ease: "none",
});

pixiApp.ticker.add((delta) => {

    displacementSprite.x++;
    if (displacementSprite.x > displacementSprite.width) { displacementSprite.x = 0; }

});

window.addEventListener('resize', resize);

// Resize pixi app
function resize() {
    pixiApp.renderer.resize(window.innerWidth, window.innerHeight);

}

resize();
