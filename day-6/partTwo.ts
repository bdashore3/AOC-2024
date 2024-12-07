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
    direction: Direction;
}

interface PathInfo {
    path: Set<string>;
    isLoop: boolean;
}

const Guard: Coordinates = {
    row: 0,
    column: 0,
    direction: Direction.North,
};

// Utility function to visualize the grid
function logMap(grid: Grid) {
    console.log("Map Array:");
    for (const i in grid) {
        console.log("" + grid[i].join(""));
    }
}

// Take in an arbitrary set of coordinates now
function getNextMove(coords: Coordinates): Coordinates {
    let newRow = coords.row;
    let newCol = coords.column;

    switch (coords.direction) {
        case Direction.North:
            newRow = coords.row - 1;
            break;
        case Direction.South:
            newRow = coords.row + 1;
            break;
        case Direction.East:
            newCol = coords.column + 1;
            break;
        case Direction.West:
            newCol = coords.column - 1;
            break;
    }

    // Return a new coords instance
    return { row: newRow, column: newCol, direction: coords.direction };
}

function turnGuard() {
    switch (Guard.direction) {
        case Direction.North:
            Guard.direction = Direction.East;
            break;
        case Direction.South:
            Guard.direction = Direction.West;
            break;
        case Direction.West:
            Guard.direction = Direction.North;
            break;
        case Direction.East:
            Guard.direction = Direction.South;
            break;
    }
}

function iterate(grid: Grid): PathInfo {
    // Resets the guard location and position
    for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
        const columnIdx = grid[rowIdx].indexOf("^");
        if (columnIdx !== -1) {
            Guard.row = rowIdx;
            Guard.column = columnIdx;
            Guard.direction = Direction.North;
        }
    }

    // Set whether the guard is in an infinite loop
    // Also requires a Set instead of visualization for uniqueness purposes
    let isLoop = false;
    const visited: Set<string> = new Set();

    while (true) {
        const newCoords = getNextMove(Guard);
        const location = grid[newCoords.row]?.[newCoords.column];

        // Obstacle ahead
        if (location === "#") {
            turnGuard();
        } else {
            // The guard is in a loop
            const curCoordsString = JSON.stringify(Guard);
            if (visited.has(curCoordsString)) {
                isLoop = true;
                break;
            }

            // Mark the current location as visited
            visited.add(curCoordsString);

            // Visualization hook used with logMap(grid)
            //grid[Guard.row][Guard.column] = "X";

            // The guard has exited
            if (location === undefined) {
                break;
            }

            Guard.column = newCoords.column;
            Guard.row = newCoords.row;
        }
    }

    // Return information on the guard's travels
    return { path: visited, isLoop: isLoop };
}

function solve(grid: Grid) {
    // Requires a copy for the visualization hook
    const initialGrid = grid.map((row) => [...row]);
    const { path } = iterate(initialGrid);

    // An obstruction doesn't have a direction, so store a new set
    const obstructions: Set<string> = new Set();

    // Iterates through each step and places an obstruction
    // Then tests and sees if the guard starts looping
    for (const coordsString of path) {
        const gridCopy = grid.map((row) => [...row]);
        const coords: Coordinates = JSON.parse(coordsString);

        // Get an place an obstruction ahead of the current position
        const aheadCoords = getNextMove(coords);

        // Done with the loop
        if (gridCopy[aheadCoords.row]?.[aheadCoords.column] == undefined) {
            break;
        }

        gridCopy[aheadCoords.row][aheadCoords.column] = "#";

        // Test an iteration, if there is an infinite loop, add to the obstructions set
        if (iterate(gridCopy).isLoop) {
            const aheadString = JSON.stringify({
                row: aheadCoords.row,
                column: aheadCoords.column,
            });

            obstructions.add(aheadString);
        }
    }

    console.log(`Obstructions: ${obstructions.size}`);
}

if (import.meta.main) {
    // Read file and solve
    const rawInput = await Deno.readTextFile("input.txt");
    const grid = rawInput.trim().split("\n").map((row) => row.split(""));
    solve(grid);
}
