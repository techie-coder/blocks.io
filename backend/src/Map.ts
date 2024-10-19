export type Block = {
    type: "playerBlock" | "obstacle" | "tnt" | "booster" | "endPoint" | "." | null,
    xCord: number,
    yCord: number
}

export class Map {
    private rows: number;
    private cols: number;
    public grid: Block[][];
    public black: Block[];
    public white: Block[];
    public winner: string;

    constructor(rows: number, cols: number) {
        console.log("entered map const");

        this.rows = rows;
        this.cols = cols;
        this.grid = this.generateGrid();
        this.grid[rows - 1][cols - 1].type = "endPoint";
        this.black = [];
        this.white = [];
        this.generateObstacles();
        this.generateTnts();
        this.generateBoosters();
        this.black = this.generatePlayerBlocks([]);
        this.white = this.generatePlayerBlocks([]);
        this.winner = "";
    }

    generateGrid(max_rows: number = this.rows, max_cols: number = this.cols): Block[][] {
        const newGrid: Block[][] = [];

        for (let i = 0; i < max_rows; i++) {
            const row: Block[] = [];
            for (let j = 0; j < max_cols; j++) {
                row.push({
                    type: ".",
                    xCord: i,
                    yCord: j
                });
            }
            newGrid.push(row);
        }
        return newGrid;
    }

    generateObstacles() {
        const maxObstacles = 3;
        let obstacles = 0;
        const minDistance = 2;

        while (obstacles < maxObstacles) {
            let x = Math.floor((Math.random() * this.rows));
            let y = Math.floor((Math.random() * this.cols));

            if (this.grid[x][y].type !== "endPoint" && !this.isNearOtherObstacles(x, y, minDistance)) {
                this.grid[x][y].type = "obstacle";
                obstacles++;
            }
        }
    }

    generateTnts() {
        const maxTnts = 2;
        let tnts = 0;
        const minDistance = 2;

        while (tnts < maxTnts) {
            let x = Math.floor((Math.random() * this.rows));
            let y = Math.floor((Math.random() * this.cols));

            if (this.grid[x][y].type === "obstacle" || this.grid[x][y].type === "endPoint" || this.isNearOtherTnts(x, y, minDistance)) {
                continue;
            } else {
                this.grid[x][y].type = "tnt";
                tnts++;
            }
        }
    }

    generateBoosters() {
        const maxBoosters = 2;
        let boosters = 0;
        const minDistance = 2;

        while (boosters < maxBoosters) {
            let x = Math.floor((Math.random() * this.rows));
            let y = Math.floor((Math.random() * this.cols));

            if (this.grid[x][y].type === "obstacle" || this.grid[x][y].type === "tnt" || this.grid[x][y].type === "endPoint" || this.isNearOtherBoosters(x, y, minDistance)) {
                continue;
            } else {
                this.grid[x][y].type = "booster";
                boosters++;
            }
        }
    }

    generatePlayerBlocks(playerBlocks: Block[]) {
        const maxBlocks = 2;
        let blockCounter = 0;
        const minDistance = 3;

        while (blockCounter < maxBlocks) {
            let x = Math.floor((Math.random() * (this.rows / 2)));
            let y = Math.floor((Math.random() * (this.cols / 2)));

            if (this.grid[x][y].type === "." && !this.isNearOtherPlayerBlocks(x, y, minDistance)) {
                this.grid[x][y].type = "playerBlock";
                playerBlocks.push(this.grid[x][y]);
                blockCounter++;
            }
        }
        return playerBlocks;
    }

    displayMap(): void {
        console.log(this.grid);
    }

    isGameOver() {
        const isBlackWinner = this.black.find(block => block.type === "endPoint");
        const isWhiteWinner = this.white.find(block => block.type === "endPoint");

        if (isBlackWinner || isWhiteWinner) {
            if (isBlackWinner) {
                this.winner = "black";
            } else if (isWhiteWinner) {
                this.winner = "white";
            }
            return JSON.stringify({ msg: `Winner is ${this.winner}` });
        } else {
            return null;
        }
    }

    move(move: { from: Block, to: Block }) {
        // Check if the move is valid
        if (this.grid[move.from.xCord][move.from.yCord].type !== "playerBlock" ||
            this.grid[move.to.xCord][move.to.yCord].type === "obstacle" ||
            Math.abs(move.from.xCord - move.to.xCord) > 1 || Math.abs(move.from.yCord - move.to.yCord) > 1) {
                console.log("Wrong Move!");
                return;
        }

        // Check which player's block is moving
        const block1index = this.black.findIndex(block => block.xCord === move.from.xCord && block.yCord === move.from.yCord);
        const block2index = this.white.findIndex(block => block.xCord === move.from.xCord && block.yCord === move.from.yCord);
        const toBlock = move.to;

        // Handle the black player's move
        if (block1index !== -1) {
            const block1 = this.black[block1index];
            this.grid[block1.xCord][block1.yCord].type = "."; // Clear the old block position

            // Handle boosters, TNT, and obstacles for black player
            this.handleBlockMovementEffects(toBlock);

            this.grid[toBlock.xCord][toBlock.yCord].type = "playerBlock"; // Set new block position
            this.black[block1index] = toBlock; // Update black player's blocks

        } else if (block2index !== -1) {
            const block2 = this.white[block2index];
            this.grid[block2.xCord][block2.yCord].type = "."; // Clear the old block position

            // Handle boosters, TNT, and obstacles for white player
            this.handleBlockMovementEffects(toBlock);

            this.grid[toBlock.xCord][toBlock.yCord].type = "playerBlock"; // Set new block position
            this.white[block2index] = toBlock; // Update white player's blocks
        }
    }

    handleBlockMovementEffects(toBlock: Block) {
        // Handle booster effects
        if (this.grid[toBlock.xCord][toBlock.yCord].type === "booster") {
            this.grid[toBlock.xCord][toBlock.yCord].type = "."; // Clear booster
            toBlock.xCord = Math.min(toBlock.xCord + 2, this.rows - 1); // Ensure within bounds
            toBlock.yCord = Math.min(toBlock.yCord + 2, this.cols - 1);
        }

        // Handle TNT effects
        if (this.grid[toBlock.xCord][toBlock.yCord].type === "tnt") {
            this.grid[toBlock.xCord][toBlock.yCord].type = "."; // Clear TNT
            toBlock.xCord = Math.max(toBlock.xCord - 10, 0); // Ensure not below 0
        }

        // Handle obstacle effects
        if (this.grid[toBlock.xCord][toBlock.yCord].type === "obstacle") {
            toBlock.xCord = Math.max(toBlock.xCord - 1, 0); // Move one block back
            toBlock.yCord = Math.max(toBlock.yCord - 1, 0);
        }
    }

    isNearOtherBoosters(x: number, y: number, minDistance: number): boolean {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.grid[i][j].type === "booster") {
                    const distance = Math.abs(x - i) + Math.abs(y - j);
                    if (distance < minDistance) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isNearOtherTnts(x: number, y: number, minDistance: number): boolean {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.grid[i][j].type === "tnt") {
                    const distance = Math.abs(x - i) + Math.abs(y - j);
                    if (distance < minDistance) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isNearOtherObstacles(x: number, y: number, minDistance: number): boolean {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.grid[i][j].type === "obstacle") {
                    const distance = Math.abs(x - i) + Math.abs(y - j);
                    if (distance < minDistance) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isNearOtherPlayerBlocks(x: number, y: number, minDistance: number): boolean {
        for (const block of this.black.concat(this.white)) {
            const distance = Math.abs(x - block.xCord) + Math.abs(y - block.yCord);
            if (distance < minDistance) {
                return true;
            }
        }
        return false;
    }
}
