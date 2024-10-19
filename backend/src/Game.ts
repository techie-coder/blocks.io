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
        this.player1 = player1;
        this.player2 = player2;
        this.map = new Map(5, 10);
        this.moves = 0;
        this.startTime = new Date();

        this.player1Blocks = this.map.black;
        this.player2Blocks = this.map.white;
        this.currentPlayer = player1;

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                player: "Player 1"
            }
        }))

        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                player: "Player 2"
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

    validateMove(socket: WebSocket, move: {
        from: Block, to: Block
    }): boolean{
        const playerBlocks = socket === this.currentPlayer ? this.player1Blocks : this.player2Blocks;
        const fromBlock = playerBlocks.find(block => block.xCord  === move.from.xCord && block.yCord === move.from.yCord);
        const max_rows = this.map.grid.length;
        const max_cols = this.map.grid[max_rows].length;
        if(fromBlock && move.to.xCord < max_rows && move.to.yCord < max_cols && move.to.type!=="obstacle"){
            return true;
        }else{
            return false;
        }
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
        if(this.map.isGameOver()){
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.map.winner
                }
            }))
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.map.winner
                }
            }))
        return;
        }

        if(socket === this.currentPlayer){
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }      
        else{
            this.player2.send(JSON.stringify({
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