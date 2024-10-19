
export type Block = {
    type: "playerBlock" | "obstacle" | "tnt" | "booster" |"endPoint" | "." |null,
    xCord: number,
    yCord: number
}

export class Map {
    private rows: number;
    private cols: number;
    public grid: Block[][];
    public black: Block[];
    public white: Block[];
    public winner: Block | undefined | null;

    constructor(rows: number, cols: number){
        this.rows = rows;
        this. cols = cols;
        this.grid = this.generateGrid();
        this.grid[rows-1][cols-1].type = "endPoint";
        this.generateObstacles();
        this.generateTnts()
        this.generateBoosters();
        this.black = this.generatePlayerBlocks([]);
        this.white = this.generatePlayerBlocks([]);
        this.winner = null;
    }

    generateGrid(max_rows: number = this.rows, max_cols: number = this.cols): Block[][]{
        const newGrid: Block[][] = [];

        for (let i = 0; i < max_rows; i++) {
          const row: Block[] = [];
          for(let j = 0; j < max_cols; j++){
            row.push( {
                    type: ".",
                    xCord: i,
                    yCord: j
                }); 
          }
          newGrid.push(row);
        }
        return newGrid;
        }

    generateObstacles(){

        const maxObstacles = 5;
        let obstacles = 0;

        while(obstacles < maxObstacles){
            let x = Math.floor((Math.random() * this.rows));
            let y = Math.floor((Math.random() * this.cols));
            
            if(!(this.grid[x][y].type === "endPoint"))
            {   
                this.grid[x][y].type="obstacle";
                obstacles++;
            } 
            
        }
    }

    generateTnts(){
        const maxTnts = 3;
        let tnts = 0;

        while(tnts < maxTnts){
            let x = Math.floor((Math.random() * this.rows));
            let y = Math.floor((Math.random() * this.cols));

            if(this.grid[x][y].type === "obstacle" || this.grid[x][y].type==="endPoint"){
                continue;
            }
            else{
                this.grid[x][y].type = "tnt";
                tnts++;
            }
        }
    }

    generateBoosters(){
        const maxBoosters = 3;
        let boosters = 0;

        while(boosters < maxBoosters)
            {
                let x = Math.floor((Math.random() * this.rows));
                let y = Math.floor((Math.random() * this.cols));

                if(this.grid[x][y].type === "obstacle" || this.grid[x][y].type === "tnt" || this.grid[x][y].type==="endPoint"){
                    continue;
                }else{
                    this.grid[x][y].type = "booster";
                    boosters++;
                }
            }
    }

    generatePlayerBlocks(playerBlocks:Block[]){
        const maxBlocks = 5;
        let blockCounter = 0;

        while(blockCounter < maxBlocks){
            let x = Math.floor((Math.random()*(this.rows/2)));
            let y = Math.floor((Math.random() * (this.cols/2)));

            if(this.grid[x][y].type === "."){
                this.grid[x][y].type="playerBlock";
                playerBlocks.push(this.grid[x][y]);
                blockCounter++;
            }
        }
        return playerBlocks;
    }


    displayMap():void {
        console.log(this.grid);
    }

    isGameOver(){
        const isBlackWinner = this.black.find(block => block.type==="endPoint");
        const isWhiteWinner = this.white.find(block => block.type=== "endPoint");
        this.winner = isBlackWinner === null ? isWhiteWinner : isBlackWinner;
        if(this.winner){
            return true;
        }
        else{
            return false;
        }
    }

    move(move :{from: Block, to:Block}){
        
        //Check if block is movable
        if((this.grid[move.from.xCord][move.from.yCord].type !== "playerBlock") || this.grid[move.to.xCord][move.to.yCord].type==="obstacle"){
            return "Invalid Move";
        }

        //Check if block exists
        const block1index = this.black.findIndex(block => block.xCord === move.from.xCord && block.yCord === move.from.yCord);
        const block2index = this.white.findIndex(block => block.xCord === move.from.xCord && block.yCord === move.from.yCord);
        const toBlock = move.to;


        //Modify the block properties
        if(block1index !== -1){
            const block1 = this.black[block1index];
            this.grid[block1.xCord][block1.yCord].type = ".";
            this.grid[toBlock.xCord][toBlock.yCord].type = "playerBlock";
            this.black[block1index] = toBlock;
            
        }else if(block2index !== -1){
            const block2 = this.white[block2index];
            this.grid[block2.xCord][block2.yCord].type = ".";
            this.grid[toBlock.xCord][toBlock.yCord].type = "playerBlock";
            this.white[block1index] = toBlock;
        }

    }
    
}
