type Grid = string[][];
interface Coordinates {
    row: number;
    column: number;
}

interface Antenna {
    symbol: string;
    coordinates: Coordinates[];
}

// Extracts each antenna and its associated coordinates
function extractAntennae(grid: Grid): Antenna[] {
    const antennae: Antenna[] = [];
    for (let i = 0; i < grid.length; i++) {
        const row = grid[i];

        for (let j = 0; j < row.length; j++) {
            const element = row[j];
            if (element === ".") {
                continue;
            }

            const newCoords: Coordinates = {
                row: i,
                column: j,
            };

            const existingAntenna = antennae.find((antenna) =>
                antenna.symbol === element
            );

            if (existingAntenna) {
                existingAntenna.coordinates.push(newCoords);
            } else {
                const newAntenna: Antenna = {
                    symbol: element,
                    coordinates: [newCoords],
                };
                antennae.push(newAntenna);
            }
        }
    }

    return antennae;
}

function solve(grid: Grid) {
    const maxRows = grid.length - 1;
    const maxCols = grid[0].length - 1;
    const antennae: Antenna[] = extractAntennae(grid);

    // Store all antinodes in a set to ensure uniqueness
    const antinodes: Set<string> = new Set();

    // Get the possible combinations for distance and determine antinodes
    for (const antenna of antennae) {
        antenna.coordinates.forEach((curCoords, i) => {
            antenna.coordinates.slice(i + 1).forEach((nextCoords) => {
                const rowDistance = curCoords.row - nextCoords.row;
                const colDistance = curCoords.column - nextCoords.column;

                // Move back and forth from the point
                for (const direction of [-1, 1]) {
                    // One antinode is away from the currently selected coords,
                    // The second is away from the predicted coords
                    const refCoords = direction > 0 ? curCoords : nextCoords;

                    const antinodeCoords: Coordinates = {
                        row: refCoords.row + direction * rowDistance,
                        column: refCoords.column + direction * colDistance,
                    };

                    // Checks for out of bounds
                    if (
                        antinodeCoords.row > maxRows ||
                        antinodeCoords.column > maxCols ||
                        antinodeCoords.row < 0 || antinodeCoords.column < 0
                    ) {
                        continue;
                    }

                    antinodes.add(JSON.stringify(antinodeCoords));
                }
            });
        });
    }

    console.log(`Amount of antinodes: ${antinodes.size}`);
}

if (import.meta.main) {
    const rawInput = await Deno.readTextFile("input.txt");
    const grid = rawInput.trim().split("\n").map((row) => row.split(""));
    solve(grid);
}
