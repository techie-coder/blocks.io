"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = require("./Map");
class Game {
    constructor(player1, player2) {
        this.player1Blocks = [];
        this.player2Blocks = [];
        this.player1 = player1;
        this.player2 = player2;
        this.map = new Map_1.Map(50, 100);
        this.moves = [];
        this.startTime = new Date();
        this.generatePlayer1Blocks();
        this.generatePlayer2Blocks();
        this.currentPlayer = player1;
    }
    generatePlayer1Blocks(grid = this.map.grid, playerBlocks = this.player1Blocks) {
        const maxBlocks = 5;
        let blockCounter = 0;
        while (blockCounter < maxBlocks) {
            const x = Math.floor((Math.random() * 25));
            const y = Math.floor((Math.random() * 50));
            if (grid[x][y].type === ".") {
                grid[x][y].type = "playerBlock";
                playerBlocks.push(grid[x][y]);
                blockCounter++;
            }
        }
    }
    generatePlayer2Blocks(grid = this.map.grid, playerBlocks = this.player2Blocks) {
        const maxBlocks = 5;
        let blockCounter = 0;
        while (blockCounter < maxBlocks) {
            const x = Math.floor((Math.random() * 25));
            const y = Math.floor((Math.random() * 50));
            if (grid[x][y].type === ".") {
                grid[x][y].type = "playerBlock";
                playerBlocks.push(grid[x][y]);
                blockCounter++;
            }
        }
    }
    displayPlayerBlocks() {
        console.log(this.player1Blocks);
        console.log(this.player2Blocks);
    }
    makeMove(socket, move) {
        if (socket !== this.currentPlayer) {
            socket.send(JSON.stringify({ error: "Not your turn!" }));
            return;
        }
    }
}
exports.Game = Game;
