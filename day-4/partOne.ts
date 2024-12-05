type WordSearch = Array<Array<string>>;

interface Coordinates {
    x: number;
    y: number;
}

// Direction lookup table with coordinate offsets as values
const Directions: Record<string, Coordinates> = {
    "N": { x: 0, y: -3 },
    "S": { x: 0, y: 3 },
    "W": { x: -3, y: 0 },
    "E": { x: 3, y: 0 },
    "NW": { x: -3, y: -3 },
    "NE": { x: 3, y: -3 },
    "SW": { x: -3, y: 3 },
    "SE": { x: 3, y: 3 },
};

function parseDirection(
    wordSearch: WordSearch,
    x: number,
    y: number,
    coords: Coordinates,
): string {
    let finalWord = "";

    // Sign-agnostic loop to look around a word
    // Grabs letters from 0 to the coordinate offset
    // Then, constructs them into the final word, which should be "XMAS"
    for (
        let step = 0;
        step <= Math.max(Math.abs(coords.x), Math.abs(coords.y));
        step++
    ) {
        const xStep = x + (step * Math.sign(coords.x));
        const yStep = y + (step * Math.sign(coords.y));
        const letter = wordSearch?.[yStep]?.[xStep];
        if (!letter) {
            break;
        }

        finalWord += letter;
    }

    return finalWord;
}

function solve(wordSearch: WordSearch) {
    let xmasCount = 0;

    // Iterate through the 2D array, separated by colums then rows
    for (let y = 0; y < wordSearch.length; y++) {
        const row = wordSearch[y];

        for (let x = 0; x < row.length; x++) {
            const letter = row[x];

            // Only need to look around if the letter is X
            if (letter == "X") {
                xmasCount += Object.keys(Directions).reduce(
                    (count, direction) => {
                        const finalWord = parseDirection(
                            wordSearch,
                            x,
                            y,
                            Directions[direction],
                        );

                        return finalWord == "XMAS" ? count + 1 : count;
                    },
                    0,
                );
            }
        }
    }

    // Log the final count
    console.log(`XMAS count: ${xmasCount}`);
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
