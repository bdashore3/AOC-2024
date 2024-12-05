// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
type WordSearch = Array<Array<string>>;

interface Coordinates {
    x: number;
    y: number;
}

const Directions: Record<string, Coordinates> = {
    "NW": { x: -1, y: -1 },
    "NE": { x: 1, y: -1 },
    "SW": { x: -1, y: 1 },
    "SE": { x: 1, y: 1 },
};

// Diagonals are only in these two direction pairs
const Diagonals = [
    ["NE", "SW"],
    ["NW", "SE"],
];

// Finds the amount of times "MAS" and its variants are present per diagonal
function parseDiagonals(
    wordSearch: WordSearch,
    x: number,
    y: number,
): number {
    const xCount = Diagonals.reduce((acc, diagonal) => {
        const finalWord = diagonal.reduce((acc, direction) => {
            const coords = Directions[direction];
            const letter = wordSearch?.[y + coords.y]?.[x + coords.x];
            if (Math.sign(coords.y) < 0) {
                return letter + acc;
            } else {
                return acc + letter;
            }
        }, "A");

        // Rather than extra logic, check if the word is the forward or backward case
        return (finalWord == "MAS" || finalWord == "SAM") ? acc + 1 : acc;
    }, 0);

    return xCount;
}

function solve(wordSearch: WordSearch) {
    let xmasCount = 0;

    // Iterate through the 2D array, separated by colums then rows
    for (let y = 0; y < wordSearch.length; y++) {
        const row = wordSearch[y];

        for (let x = 0; x < row.length; x++) {
            const letter = row[x];

            // Now, look at diagonals if the letter is A
            if (letter == "A") {
                const xCount = parseDiagonals(wordSearch, x, y);

                // Both diagonals need to be satisfied to count
                if (xCount == 2) {
                    xmasCount++;
                }
            }
        }
    }

    // Log the final count
    console.log(`X-MAS count: ${xmasCount}`);
}

if (import.meta.main) {
    // Read file
    const decoder = new TextDecoder("utf-8");
    const rawFile = await Deno.readFile("input.txt");
    const wordSearchString = decoder.decode(rawFile).trim();
    const wordSearch = wordSearchString.split("\n").map((row) => row.split(""));

    // Solve
    solve(wordSearch);
}
