import WebSocket from "ws";
import { Game } from "./Game";
import { GET_GAME_STATE, INIT_GAME, MOVE } from "./messages";

export class GameManager{

    private games:Game[]
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor()
    {
        this.games = []
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket){
        this.users.push(socket);
        this.addHandler(socket);

    }

    removeUser(socket: WebSocket){
        this.users = this.users.filter(user => user !== socket);

    }

    private addHandler(socket: WebSocket){
        socket.on("message", data => {
            const message = JSON.parse(data.toString());
            if(message.type === INIT_GAME){
                if(this.pendingUser){
                   //start the game
                   const game = new Game(this.pendingUser, socket);
                   this.games.push(game);
                   this.pendingUser = null;

                }else{
                    this.pendingUser = socket;
                }
            }

            if(message.type === MOVE){
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if(game){
                    game.makeMove(socket, message.move);
                }
            }

            if(message.type === GET_GAME_STATE){
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if(game){
                    socket.send(JSON.stringify({gametate: game.getGameState()}));
                }
            }

        })

    }

}