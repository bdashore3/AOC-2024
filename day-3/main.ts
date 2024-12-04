function partOne(input: string) {
    // Summon the demons
    const mulRegex = /(mul\((\d{1,3}),(\d{1,3})\))/gm;
    const mulMatches = input.matchAll(mulRegex);

    // Use a reducer instead of a for loop here
    const sum = mulMatches.reduce((acc, match) => {
        const firstNum = parseInt(match[2]);
        const secondNum = parseInt(match[3]);

        return acc + firstNum * secondNum;
    }, 0);

    console.log(`Part one sum: ${sum}`);
}

function partTwo(input: string) {
    // The demons have got worse
    const operationRegex = /(mul\((\d{1,3}),(\d{1,3})\))|do\(\)|don't\(\)/gm;
    const opMatches = input.matchAll(operationRegex);

    // Store the total sum and enable state
    let sum = 0;
    let enabled = true;

    for (const match of opMatches) {
        const operation = match[0];

        // Parse out the instruction
        switch (operation) {
            case "do()":
                enabled = true;
                break;
            case "don't()":
                enabled = false;
                break;
            default:
                break;
        }

        // Same sum operation as part 1, but embedded in the for loop
        if (enabled && operation.startsWith("mul")) {
            const firstNum = parseInt(match[2]);
            const secondNum = parseInt(match[3]);

            sum += firstNum * secondNum;
        }
    }

    console.log(`Part two sum: ${sum}`);
}

if (import.meta.main) {
    // Read the file
    const decoder = new TextDecoder("utf-8");
    const rawFile = await Deno.readFile("input.txt");
    const input = decoder.decode(rawFile);

    // Solve
    partOne(input);
    partTwo(input);
}
