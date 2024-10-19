import { WebSocket } from "ws";
import { Block, Map } from "./Map";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private map: Map;
    private moves: number;
    private startTime: Date;
    private player1Blocks:Block[] = [];
    private player2Blocks:Block[] = [];
    private currentPlayer: WebSocket;

    constructor(player1: WebSocket, player2: WebSocket){

        console.log("entered game const");

        this.player1 = player1;
        this.player2 = player2;
        this.map = new Map(5, 10);
        console.log("created map");
        this.moves = 0;
        this.startTime = new Date();

        this.player1Blocks = this.map.black;
        this.player2Blocks = this.map.white;
        this.currentPlayer = player1;

        console.log("control reached inside Game");

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                player: "Black"
            }
        }))

        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                player: "White"
            }
        }))

    }


    getGameState():Block[][]{
        return this.map.grid;
    }

    displayPlayerBlocks(){
        console.log(this.player1Blocks);
        console.log(this.player2Blocks);
    }


    makeMove(socket: WebSocket, move: {to: Block, from: Block}){
        
        if(socket !== this.currentPlayer){
            socket.send(JSON.stringify({msg: "Not your turn!"}));
        }

        try{
            this.map.move(move);
            this.moves++;
        }catch(e){
            socket.send(JSON.stringify({error: e}));
        }

        //Check if game over
        let gameOverMsg = this.map.isGameOver();

        if(gameOverMsg){
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: gameOverMsg
                }
            }))
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: gameOverMsg
                }
            }))
        
        }

        //Emit the moves to the opponent

        if(socket === this.currentPlayer){
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }      
        else{
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }

        //Switch the turns
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
        this.currentPlayer.send(JSON.stringify(
            {
                msg: "Your turn!"
            }
        ))

    }


}