type Grid = string[][];
enum Direction {
    North = "^",
    South = "v",
    West = "<",
    East = ">",
}

interface Coordinates {
    row: number;
    column: number;
}

const Guard = {
    row: 0,
    column: 0,
    position: Direction.North,
};

// Utility function to visualize the grid
function logMap(grid: Grid) {
    console.log("Map Array:");
    for (const i in grid) {
        console.log("" + grid[i].join(""));
    }
}

function getNextMove(): Coordinates {
    let newRow = 0;
    let newCol = 0;

    switch (Guard.position) {
        case Direction.North:
            newRow = Guard.row - 1;
            newCol = Guard.column;
            break;
        case Direction.South:
            newRow = Guard.row + 1;
            newCol = Guard.column;
            break;
        case Direction.East:
            newRow = Guard.row;
            newCol = Guard.column + 1;
            break;
        case Direction.West:
            newRow = Guard.row;
            newCol = Guard.column - 1;
            break;
    }

    return { row: newRow, column: newCol };
}

function turnGuard() {
    switch (Guard.position) {
        case Direction.North:
            Guard.position = Direction.East;
            break;
        case Direction.South:
            Guard.position = Direction.West;
            break;
        case Direction.West:
            Guard.position = Direction.North;
            break;
        case Direction.East:
            Guard.position = Direction.South;
            break;
    }
}

// A non-set method of checking for footsteps
function solve(grid: Grid) {
    // Get guard position
    for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
        const columnIdx = grid[rowIdx].indexOf("^");
        if (columnIdx !== -1) {
            Guard.row = rowIdx;
            Guard.column = columnIdx;
        }
    }

    let footsteps = 0;
    while (true) {
        // Where is the guard moving next?
        const newCoords = getNextMove();

        // What's ahead of the guard?
        const location = grid[newCoords.row]?.[newCoords.column];

        // Obstacle ahead
        if (location === "#") {
            turnGuard();
        } else {
            if (location !== "X") {
                footsteps++;
            }

            // Mark the current location as visited
            grid[Guard.row][Guard.column] = "X";

            Guard.column = newCoords.column;
            Guard.row = newCoords.row;

            // The guard has exited
            if (location === undefined) {
                break;
            }
        }
    }

    // Visualize the final map
    logMap(grid);
    console.log(`Footsteps: ${footsteps}`);
}

if (import.meta.main) {
    // Read file and solve
    const rawInput = await Deno.readTextFile("input.txt");
    const grid = rawInput.trim().split("\n").map((row) => row.split(""));
    solve(grid);
}
