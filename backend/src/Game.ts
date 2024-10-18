import { WebSocket } from "ws";
import { Block, Map } from "./Map";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private map: Map;
    private moves: string[];
    private startTime: Date;
    private player1Blocks:Block[] = [];
    private player2Blocks:Block[] = [];
    private currentPlayer: WebSocket;

    constructor(player1: WebSocket, player2: WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.map = new Map(50, 100);
        this.moves = [];
        this.startTime = new Date();

        this.generatePlayer1Blocks();
        this.generatePlayer2Blocks();
        this.currentPlayer = player1;
    }

    generatePlayer1Blocks(grid:Block[][] = this.map.grid, playerBlocks:Block[] = this.player1Blocks){
        const maxBlocks = 5;
        let blockCounter = 0;

        while(blockCounter < maxBlocks){
            const x = Math.floor((Math.random()*25));
            const y = Math.floor((Math.random() * 50));

            if(grid[x][y].type === "."){
                grid[x][y].type="playerBlock";
                playerBlocks.push(grid[x][y]);
                blockCounter++;
            }
        }
    }

    generatePlayer2Blocks(grid:Block[][] = this.map.grid, playerBlocks:Block[] = this.player2Blocks){
        const maxBlocks = 5;
        let blockCounter = 0;

        while(blockCounter < maxBlocks){
            const x = Math.floor((Math.random()*25));
            const y = Math.floor((Math.random() * 50));

            if(grid[x][y].type === "."){
                grid[x][y].type="playerBlock";
                playerBlocks.push(grid[x][y]);
                blockCounter++;
            }
        }
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

    makeMove(socket: WebSocket, move: {
        from: Block,
        to: Block
    }){
        if(socket !== this.currentPlayer){
            socket.send(JSON.stringify({error: "Not your turn!"}));
            return;
        }

        const isValid = this.validateMove(socket, move);

        const playerBlocks = socket === this.currentPlayer ? this.player1Blocks : this.player2Blocks;

        if(isValid){
            const y2 = move.to.yCord;
            const x2 = move.to.xCord;
            const x1 = move.from.xCord;
            const y1 = move.from.yCord;
            this.map.grid[x1][y1].type = ".";
            this.map.grid[x2][y2].type = "playerBlock";
            playerBlocks.
            socket.send(JSON.stringify({gameState: this.map.grid}));           
        }else{
            socket.send(JSON.stringify({error: "Invalid move"}));
            return;
        }


    }
}