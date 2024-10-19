"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = require("./Map");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1Blocks = [];
        this.player2Blocks = [];
        this.player1 = player1;
        this.player2 = player2;
        this.map = new Map_1.Map(5, 10);
        this.moves = 0;
        this.startTime = new Date();
        this.player1Blocks = this.map.black;
        this.player2Blocks = this.map.white;
        this.currentPlayer = player1;
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                player: "Player 1"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                player: "Player 2"
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
    validateMove(socket, move) {
        const playerBlocks = socket === this.currentPlayer ? this.player1Blocks : this.player2Blocks;
        const fromBlock = playerBlocks.find(block => block.xCord === move.from.xCord && block.yCord === move.from.yCord);
        const max_rows = this.map.grid.length;
        const max_cols = this.map.grid[max_rows].length;
        if (fromBlock && move.to.xCord < max_rows && move.to.yCord < max_cols && move.to.type !== "obstacle") {
            return true;
        }
        else {
            return false;
        }
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
        if (this.map.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.map.winner
                }
            }));
            this.player2.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.map.winner
                }
            }));
            return;
        }
        if (socket === this.currentPlayer) {
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        else {
            this.player1.send(JSON.stringify({
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
