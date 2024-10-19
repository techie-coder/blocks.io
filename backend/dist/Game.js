"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = require("./Map");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1Blocks = [];
        this.player2Blocks = [];
        console.log("entered game const");
        this.player1 = player1;
        this.player2 = player2;
        this.map = new Map_1.Map(5, 10);
        console.log("created map");
        this.moves = 0;
        this.startTime = new Date();
        this.player1Blocks = this.map.black;
        this.player2Blocks = this.map.white;
        this.currentPlayer = player1;
        console.log("control reached inside Game");
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                player: "Black"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                player: "White"
            }
        }));
    }
    getGameState() {
        return this.map.grid;
    }
    displayPlayerBlocks() {
        console.log(this.player1Blocks);
        console.log(this.player2Blocks);
    }
    makeMove(socket, move) {
        if (socket !== this.currentPlayer) {
            socket.send(JSON.stringify({ msg: "Not your turn!" }));
        }
        try {
            this.map.move(move);
            this.moves++;
        }
        catch (e) {
            socket.send(JSON.stringify({ error: e }));
        }
        //Check if game over
        let gameOverMsg = this.map.isGameOver();
        if (gameOverMsg) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: gameOverMsg
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: gameOverMsg
                }
            }));
        }
        //Emit the moves to the opponent
        if (socket === this.currentPlayer) {
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        else {
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        //Switch the turns
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
        this.currentPlayer.send(JSON.stringify({
            msg: "Your turn!"
        }));
    }
}
exports.Game = Game;
