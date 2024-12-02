if (import.meta.main) {
    // Read the file
    const decoder = new TextDecoder("utf-8");
    const inputFile = await Deno.readFile("input.txt");
    const inputText = decoder.decode(inputFile);

    const firstCol: number[] = [];
    const secondCol: number[] = [];

    for (const line of inputText.trim().split("\n")) {
        const [first, second] = line.split(/\s+/).map((e) => parseInt(e));
        firstCol.push(first);
        secondCol.push(second);
    }

    // Sort the arrays
    const sortFunc = (a: number, b: number) => a - b;
    const sortedFirstCol = firstCol.sort(sortFunc);
    const sortedSecondCol = secondCol.sort(sortFunc);

    // Compute the path difference
    const paths: number[] = [];
    for (let i = 0; i < sortedFirstCol.length; i++) {
        const path = Math.abs(sortedFirstCol[i] - sortedSecondCol[i]);
        paths.push(path);
    }

    // Get the combined path differences
    const sum = paths.reduce((acc, e) => {
        return acc + e;
    });

    console.log(`Final distance: ${sum}`);
}
