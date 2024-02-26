import React, { Component } from 'react';
import Spinner from './Spinner';
import loseSound from './sounds/Lose_v2.mp3';
import smallWinSound from './sounds/1_Win_Small.mp3';
import mediumWinSound from './sounds/2_Win_Medium.mp3';
import jackpotSound from './sounds/3_Jackpot.mp3';
import smallWinImage from './images/1_Big_Win.jpg';
import mediumWinImage from './images/2_Mega_Win.jpg';
import jackpotImage from './images/3_Jackpot.jpg';
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
    this.handleClick();
  }

  handleClick() {
    this.setState({
      smallWinner: false,
      mediumWinner: false,
      jackpotWinner: false,
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

    let jackpotProbability = 0.10;
    let mediumProbability = 0.18 + jackpotProbability;
    let smallProbability = 0.26 + mediumProbability;
    let freeSpinProbability = 0.10 + smallProbability;
    jackpotProbability /= 3;
    mediumProbability /= 3;
    smallProbability /= 3;
    freeSpinProbability /= 3;
    let randomNumber = Math.random();

    if (randomNumber < jackpotProbability) {
      const jackpotSound = document.getElementById('jackpotSound');
      jackpotSound.play();
      console.log('Jackpot!');
      const jackpotPosition = 2 * iconHeight * -1;
      this.startPositions = {
        firstSpinner: jackpotPosition,
        secondSpinner: jackpotPosition,
        thirdSpinner: jackpotPosition,
      };
      setTimeout(() => this.setState({jackpotWinner: true}), 3000);
    } else if (randomNumber < mediumProbability) {
      const mediumWinSound = document.getElementById('mediumWinSound');
      mediumWinSound.play();
      console.log('Medium win!');
      let index = 2;
      while (index === 2 || index === 7) {
        // Generate a random number between 1 and 7
        index = Math.floor(Math.random() * totalSymbols) + 1;
      }
      const mediumPosition = index * iconHeight * -1;
      this.startPositions = {
          firstSpinner: mediumPosition,
          secondSpinner: mediumPosition,
          thirdSpinner: mediumPosition,
      };
      setTimeout(() => this.setState({mediumWinner: true}), 3000);
    } else if (randomNumber < smallProbability) {
      const smallWinSound = document.getElementById('smallWinSound');
      smallWinSound.play();
      console.log('Small win!');
      const smallWinIndexes = [1, 4, 6];
      const index1 = smallWinIndexes[Math.floor(Math.random() * smallWinIndexes.length)];
      const index2 = smallWinIndexes[Math.floor(Math.random() * smallWinIndexes.length)];
      const index3 = smallWinIndexes[Math.floor(Math.random() * smallWinIndexes.length)];

      this.startPositions = {
          firstSpinner: index1 * iconHeight * -1,
          secondSpinner: index2 * iconHeight * -1,
          thirdSpinner: index3 * iconHeight * -1,
      };
      setTimeout(() => this.setState({smallWinner: true}), 3000);
    } else if (randomNumber < freeSpinProbability) {
      const losingSound = document.getElementById('losingSound');
      losingSound.play();
      console.log('Free spin!');
      const freeSpinPosition = 7 * iconHeight * -1;
      this.startPositions = {
          firstSpinner: freeSpinPosition,
          secondSpinner: freeSpinPosition,
          thirdSpinner: freeSpinPosition,
      };
    } else {
      const losingSound = document.getElementById('losingSound');
      losingSound.play();
      console.log('No win!');
      let firstPosition = (Math.floor(Math.random() * totalSymbols)) * iconHeight * -1;
      let secondPosition = (Math.floor(Math.random() * totalSymbols)) * iconHeight * -1;
      let thirdPosition = (Math.floor(Math.random() * totalSymbols)) * iconHeight * -1;
      while (
            // Check if all 3 positions are the same
            (firstPosition === secondPosition && secondPosition === thirdPosition) ||
            // Check if 3 positions are in a permutation of 1, 4, 6
            (firstPosition === 1 && secondPosition === 1 && thirdPosition === 1) ||
            (firstPosition === 1 && secondPosition === 1 && thirdPosition === 4) ||
            (firstPosition === 1 && secondPosition === 1 && thirdPosition === 6) ||
            (firstPosition === 1 && secondPosition === 4 && thirdPosition === 1) ||
            (firstPosition === 1 && secondPosition === 4 && thirdPosition === 4) ||
            (firstPosition === 1 && secondPosition === 4 && thirdPosition === 6) ||
            (firstPosition === 1 && secondPosition === 6 && thirdPosition === 1) ||
            (firstPosition === 1 && secondPosition === 6 && thirdPosition === 4) ||
            (firstPosition === 1 && secondPosition === 6 && thirdPosition === 6) ||
            (firstPosition === 4 && secondPosition === 1 && thirdPosition === 1) ||
            (firstPosition === 4 && secondPosition === 1 && thirdPosition === 4) ||
            (firstPosition === 4 && secondPosition === 1 && thirdPosition === 6) ||
            (firstPosition === 4 && secondPosition === 4 && thirdPosition === 1) ||
            (firstPosition === 4 && secondPosition === 4 && thirdPosition === 4) ||
            (firstPosition === 4 && secondPosition === 4 && thirdPosition === 6) ||
            (firstPosition === 4 && secondPosition === 6 && thirdPosition === 1) ||
            (firstPosition === 4 && secondPosition === 6 && thirdPosition === 4) ||
            (firstPosition === 4 && secondPosition === 6 && thirdPosition === 6) ||
            (firstPosition === 6 && secondPosition === 1 && thirdPosition === 1) ||
            (firstPosition === 6 && secondPosition === 1 && thirdPosition === 4) ||
            (firstPosition === 6 && secondPosition === 1 && thirdPosition === 6) ||
            (firstPosition === 6 && secondPosition === 4 && thirdPosition === 1) ||
            (firstPosition === 6 && secondPosition === 4 && thirdPosition === 4) ||
            (firstPosition === 6 && secondPosition === 4 && thirdPosition === 6) ||
            (firstPosition === 6 && secondPosition === 6 && thirdPosition === 1) ||
            (firstPosition === 6 && secondPosition === 6 && thirdPosition === 4) ||
            (firstPosition === 6 && secondPosition === 6 && thirdPosition === 6)
        ) {
        firstPosition = (Math.floor(Math.random() * totalSymbols)) * iconHeight * -1;
        secondPosition = (Math.floor(Math.random() * totalSymbols)) * iconHeight * -1;
        thirdPosition = (Math.floor(Math.random() * totalSymbols)) * iconHeight * -1;
      }
      this.startPositions = {
          firstSpinner: firstPosition,
          secondSpinner: secondPosition,
          thirdSpinner: thirdPosition,
      };
    }
    // testing
    // this.startPositions = {
    //     firstSpinner: 0,
    //     secondSpinner: 0,
    //     thirdSpinner: 0,
    // }
    this.startPositions.firstSpinner = this.startPositions.firstSpinner + 17 * iconHeight * -1;
    this.startPositions.secondSpinner = this.startPositions.secondSpinner + 23 * iconHeight * -1;
    this.startPositions.thirdSpinner = this.startPositions.thirdSpinner + 42 * iconHeight * -1;
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
