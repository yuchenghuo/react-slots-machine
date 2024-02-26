import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Spinner extends Component {
    state = {
        position: 0,
        lastPosition: null
    };

    static iconHeight = 400;

    constructor(props) {
        super(props);
        this.start = this.setStartPosition(props);
        if (props.spinnerIndex === 0) {
            this.spinnerName = "firstSpinner";
        } else if (props.spinnerIndex === 1) {
            this.spinnerName = "secondSpinner";
        } else {
            this.spinnerName = "thirdSpinner";
        }
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    }

    componentDidMount() {
        this.reset();
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.startPositions[this.spinnerName] !== this.props.startPositions[this.spinnerName]) {
            this.start = this.setStartPosition(this.props);
            this.reset();
        }
    }

    setStartPosition(props) {
        return props.startPositions[this.spinnerName];
    }

    forceUpdateHandler() {
        this.reset();
    }

    reset() {
        clearInterval(this.timer);
        this.setState({ position: this.start, timeRemaining: parseInt(this.props.timer) });
        this.timer = setInterval(() => this.tick(), 100);
    }

    moveBackground() {
        this.setState(prevState => ({
            position: prevState.position - 800,
            timeRemaining: prevState.timeRemaining - 100
        }));
    }

    getSymbolFromPosition() {
        const { position } = this.state;
        const totalSymbols = 7;
        const maxPosition = Spinner.iconHeight * (totalSymbols - 1) * -1;
        let moved = parseInt(this.props.timer) / 100 * this.multiplier;
        let startPosition = this.start;
        let currentPosition = startPosition;

        for (let i = 0; i < moved; i++) {
            currentPosition -= Spinner.iconHeight;
            if (currentPosition < maxPosition) {
                currentPosition = 0;
            }
        }

        this.props.onFinish(currentPosition);
    }

    tick() {
        if (this.state.timeRemaining <= 0) {
            clearInterval(this.timer);
            this.getSymbolFromPosition();
        } else {
            this.moveBackground();
        }
    }

    render() {
        const { position } = this.state;
        return <div style={{ backgroundPosition: '0px ' + position + 'px' }} className="icons" />;
    }
}

export default Spinner;
