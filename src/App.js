import React, { Component } from 'react';
import Spinner from './Spinner';
import loseSound from './sounds/Lose_v2.mp3';
import smallWinSound from './sounds/1_Win_Small.mp3';
import mediumWinSound from './sounds/2_Win_Medium.mp3';
import jackpotSound from './sounds/3_Jackpot.mp3';
import smallWinImage from './images/1_Big_Win.jpg';
import mediumWinImage from './images/2_Mega_Win.jpg';
import jackpotImage from './images/3_Jackpot.jpg';
import freeSpinImage from './images/Freespin_2-100.jpg';
import { ModalContent } from "./Modal";
import './App.css';

class App extends Component {
  state = {
    smallWinner: false,
    mediumWinner: false,
    jackpotWinner: false,
  };

  startPositions = {
    firstSpinner: 1,
    secondSpinner: 6,
    thirdSpinner: 3,
  };

  constructor(props) {
    super(props);
    this.finishHandler = this.finishHandler.bind(this);
    this.handleClick = this.handleClick.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.calculateStartPosition = this.calculateStartPosition.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress(event) {
    const losingSound = document.getElementById('losingSound');
    const jackpotSound = document.getElementById('jackpotSound');
    const mediumWinSound = document.getElementById('mediumWinSound');
    const smallWinSound = document.getElementById('smallWinSound');
    if (losingSound.currentTime > 0 && !losingSound.paused) {
        return;
    }
    if (jackpotSound.currentTime > 0 && !jackpotSound.paused) {
        return;
    }
    if (mediumWinSound.currentTime > 0 && !mediumWinSound.paused) {
        return;
    }
    if (smallWinSound.currentTime > 0 && !smallWinSound.paused) {
        return;
    }
    if (event.keyCode === 32) {
      this.handleClick();
    }
  }

  handleClick() {
    this.setState({
      smallWinner: false,
      mediumWinner: false,
      jackpotWinner: false,
      freeSpinWinner: false,
    });
    this.emptyArray();
    this.calculateStartPosition();
    ['_child1', '_child2', '_child3'].forEach(child => this[child].forceUpdateHandler());
  }

  static matches = [];

  finishHandler(value) {
    App.matches.push(value);
    if (App.matches.length === 3) {
      const results = App.matches.every(match => match === App.matches[0]);
      this.setState({ winner: results });
    }
  }

  emptyArray() {
    App.matches = [];
  }

  // calculate start positions for 3 spinners
  calculateStartPosition() {
    const totalSymbols = 7;
    const iconHeight = 400;

    let jackpotProbability = 0.0946 / 3;
    let mediumProbability = 0.1408 / 3 + jackpotProbability;
    let smallProbability = 0.1610 / 3 + mediumProbability;
    let freeSpinProbability = 0.10 / 3 + smallProbability;
    let randomNumber = Math.random();

    const spinner1Index = {
        'jackpot': 5,
        'freeSpin': 2,
        'highProtein': 1,
        'edamame': 3,
        'plantBased': 4,
        'beanCharacter': 6,
        'superSnack': 7,
    }

    const spinner2Index = {
        'jackpot': 2,
        'freeSpin': 7,
        'highProtein': 6,
        'edamame': 5,
        'plantBased': 1,
        'beanCharacter': 3,
        'superSnack': 4,
    }

    const spinner3Index = {
        'jackpot': 4,
        'freeSpin': 5,
        'highProtein': 2,
        'edamame': 7,
        'plantBased': 6,
        'beanCharacter': 1,
        'superSnack': 3,
    }

    if (randomNumber < jackpotProbability) {
      const jackpotSound = document.getElementById('jackpotSound');
      jackpotSound.play();
      console.log('Jackpot!');
      this.startPositions = {
        firstSpinner: spinner1Index['jackpot'] * iconHeight * -1,
        secondSpinner: spinner2Index['jackpot'] * iconHeight * -1,
        thirdSpinner: spinner3Index['jackpot'] * iconHeight * -1,
      };
      setTimeout(() => this.setState({jackpotWinner: true}), 3000);
    } else if (randomNumber < mediumProbability) {
      const mediumWinSound = document.getElementById('mediumWinSound');
      mediumWinSound.play();
      console.log('Medium win!');
      let index = Math.floor(Math.random() * totalSymbols) + 1;
      const keys = Object.keys(spinner1Index);
      while (keys[index - 1] === 'jackpot' || keys[index - 1] === 'freeSpin') {
        // Generate a random number between 1 and 7
        index = Math.floor(Math.random() * totalSymbols) + 1;
      }
      this.startPositions = {
          firstSpinner: spinner1Index[keys[index - 1]] * iconHeight * -1,
          secondSpinner: spinner2Index[keys[index - 1]] * iconHeight * -1,
          thirdSpinner: spinner3Index[keys[index - 1]] * iconHeight * -1,
      };
      setTimeout(() => this.setState({mediumWinner: true}), 3000);
    } else if (randomNumber < smallProbability) {
      const smallWinSound = document.getElementById('smallWinSound');
      smallWinSound.play();
      console.log('Small win!');
      const smallWinKeys = ['highProtein', 'plantBased', 'superSnack'];
      let key1 = smallWinKeys[Math.floor(Math.random() * smallWinKeys.length)];
      let key2 = smallWinKeys[Math.floor(Math.random() * smallWinKeys.length)];
      let key3 = smallWinKeys[Math.floor(Math.random() * smallWinKeys.length)];

      while (key1 === key2 && key2 === key3) {
        key1 = smallWinKeys[Math.floor(Math.random() * smallWinKeys.length)];
        key2 = smallWinKeys[Math.floor(Math.random() * smallWinKeys.length)];
        key3 = smallWinKeys[Math.floor(Math.random() * smallWinKeys.length)];
      }

      this.startPositions = {
          firstSpinner: spinner1Index[key1] * iconHeight * -1,
          secondSpinner: spinner2Index[key2] * iconHeight * -1,
          thirdSpinner: spinner3Index[key3] * iconHeight * -1,
      };
      setTimeout(() => this.setState({smallWinner: true}), 3000);
    } else if (randomNumber < freeSpinProbability) {
      const losingSound = document.getElementById('losingSound');
      losingSound.play();
      console.log('Free spin!');
      this.startPositions = {
          firstSpinner: spinner1Index['freeSpin'] * iconHeight * -1,
          secondSpinner: spinner2Index['freeSpin'] * iconHeight * -1,
          thirdSpinner: spinner3Index['freeSpin'] * iconHeight * -1,
      };
        setTimeout(() => this.setState({freeSpinWinner: true}), 3000);
    } else {
      const losingSound = document.getElementById('losingSound');
      losingSound.play();
      console.log('No win!');
      let firstIndex = Math.floor(Math.random() * totalSymbols);
      let secondIndex = Math.floor(Math.random() * totalSymbols);
      let thirdIndex = Math.floor(Math.random() * totalSymbols);
      const keys = Object.keys(spinner1Index);
      const barKeys = ['highProtein', 'plantBased', 'superSnack'];

      while (
        (keys[firstIndex] === keys[secondIndex] && keys[secondIndex] === keys[thirdIndex]) ||
        (barKeys.includes(keys[firstIndex]) && barKeys.includes(keys[secondIndex]) && barKeys.includes(keys[thirdIndex]))
        ) {
        firstIndex = Math.floor(Math.random() * totalSymbols);
        secondIndex = Math.floor(Math.random() * totalSymbols);
        thirdIndex = Math.floor(Math.random() * totalSymbols);
      }
      console.log(`First position: ${keys[firstIndex]}, Second position: ${keys[secondIndex]}, Third position: ${keys[thirdIndex]}`);
      this.startPositions = {
          firstSpinner: spinner1Index[keys[firstIndex]] * iconHeight * -1,
          secondSpinner: spinner2Index[keys[secondIndex]] * iconHeight * -1,
          thirdSpinner: spinner3Index[keys[thirdIndex]] * iconHeight * -1,
      };
    }
    this.startPositions.firstSpinner = this.startPositions.firstSpinner + 17 * iconHeight * -1 - 200;
    this.startPositions.secondSpinner = this.startPositions.secondSpinner + 23 * iconHeight * -1 - 200;
    this.startPositions.thirdSpinner = this.startPositions.thirdSpinner + 42 * iconHeight * -1 - 200;
    console.log(`Start positions: ${JSON.stringify(this.startPositions)}`)
  }

  render() {
    const firstTimer = 800;
    const secondTimer = 1200;
    const thirdTimer = 2000;
    return (
        <div>
          {this.state.jackpotWinner && (
              <ModalContent onClose={() => this.setState({jackpotWinner: false})}>
                <img src={jackpotImage} width={500} height={300} alt=""/>
              </ModalContent>
          )}
          {this.state.smallWinner && (
              <ModalContent onClose={() => this.setState({smallWinner: false})}>
                <img src={smallWinImage} width={500} height={300} alt=""/>
              </ModalContent>
          )}
          {this.state.mediumWinner && (
              <ModalContent onClose={() => this.setState({mediumWinner: false})}>
                <img src={mediumWinImage} width={500} height={300} alt=""/>
              </ModalContent>
          )}
          {this.state.freeSpinWinner && (
            <ModalContent onClose={() => this.setState({freeSpinWinner: false})}>
              <img src={freeSpinImage} width={500} height={300} alt=""/>
              </ModalContent>
          )}
          <audio id="losingSound">
            <source src={loseSound} type="audio/mp3"/>
          </audio>
          <audio id="smallWinSound">
            <source src={smallWinSound} type="audio/mp3"/>
          </audio>
          <audio id="mediumWinSound">
            <source src={mediumWinSound} type="audio/mp3"/>
          </audio>
          <audio id="jackpotSound">
              <source src={jackpotSound} type="audio/mp3"/>
          </audio>
          <div className="spinner-container">
            {[firstTimer, secondTimer, thirdTimer].map((timer, index) => (
                <Spinner key={index} onFinish={this.finishHandler} ref={child => this[`_child${index + 1}`] = child}
                         timer={timer} startPositions={this.startPositions} spinnerIndex={index}/>
            ))}
            <div className="gradient-fade"></div>
          </div>
        </div>
    );
  }
}

export default App;
