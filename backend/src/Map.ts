
export type Block = {
    type: "playerBlock" | "obstacle" | "tnt" | "booster" |"endPoint" | "." |null,
    xCord: number,
    yCord: number
}

export class Map {
    private rows: number;
    private cols: number;
    public grid: Block[][];

    constructor(rows: number, cols: number){
        this.rows = rows;
        this. cols = cols;
        this.grid = this.generateGrid();
        this.grid[rows-1][cols-1].type = "endPoint";
    }

    generateGrid(max_rows: number = this.rows, max_cols: number = this.cols): Block[][]{
        const newGrid: Block[][] = [];

        for (let i = 0; i < max_rows; i++) {
          for(let j = 0; j < max_cols; j++){
                newGrid[i][j].type = "."; 
          }
        }
        
        this.generateObstacles();
        this.generateTnts()
        this.generateBoosters();

        return newGrid;
        }

    generateObstacles(grid: Block[][] = this.grid){

        const maxObstacles = 5;
        let obstacles = 0;

        while(obstacles < maxObstacles){
            const x = Math.floor((Math.random() * this.rows));
            const y = Math.floor((Math.random() * this.cols));
            
            if(!(grid[x][y].type === "endPoint"))
            {   
                grid[x][y].type="obstacle";
                obstacles++;
            } 
    
            
        }
    }

    generateTnts(grid:Block[][] = this.grid){
        const maxTnts = 3;
        let tnts = 0;

        while(tnts < maxTnts){
            const x = Math.floor((Math.random() * this.rows));
            const y = Math.floor((Math.random() * this.cols));

            if(grid[x][y].type === "obstacle" || grid[x][y].type==="endPoint"){
                continue;
            }
            else{
                grid[x][y].type = "tnt";
                tnts++;
            }
        }
    }

    generateBoosters(grid:Block[][] = this.grid){
        const maxBoosters = 3;
        let boosters = 0;

        while(boosters < maxBoosters)
            {
                const x = Math.floor((Math.random() * this.rows));
                const y = Math.floor((Math.random() * this.cols));

                if(grid[x][y].type === "obstacle" || grid[x][y].type === "tnt" || grid[x][y].type==="endPoint"){
                    continue;
                }else{
                    grid[x][y].type = "booster";
                    boosters++;
                }
            }
    }

    displayMap():void {
        console.log(this.grid);
    }
    
}
