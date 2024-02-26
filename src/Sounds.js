import React from 'react';

function LosingSound() {
    return (
        <audio id="losingSound">
            <source src="sounds/lose.mp3" />
        </audio>
    );
}

function SmallWinningSound() {
    return (
        <audio autoPlay="autoplay" className="player" preload="false">
            <source src="https://andyhoffman.codes/random-assets/img/slots/small_win.wav" />
        </audio>
    );
}

function MediumWinningSound() {
    return (
        <audio autoPlay="autoplay" className="player" preload="false">
            <source src="https://andyhoffman.codes/random-assets/img/slots/medium_win.wav" />
        </audio>
    );
}

function JackpotWinningSound() {
    return (
        <audio autoPlay="autoplay" className="player" preload="false">
            <source src="https://andyhoffman.codes/random-assets/img/slots/jackpot_win.wav" />
        </audio>
    );
}

export { LosingSound, SmallWinningSound, MediumWinningSound, JackpotWinningSound };
