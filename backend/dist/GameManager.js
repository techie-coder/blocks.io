"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("./Game");
const messages_1 = require("./messages");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
    }
    addHandler(socket) {
        socket.on("message", data => {
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    //start the game
                    console.log("control reached inside handler");
                    const game = new Game_1.Game(this.pendingUser, socket);
                    console.log("Init game");
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            if (message.type === messages_1.MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.move);
                }
            }
            if (message.type === messages_1.GET_GAME_STATE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    socket.send(JSON.stringify({ gamestate: game.getGameState() }));
                }
            }
        });
    }
}
exports.GameManager = GameManager;
