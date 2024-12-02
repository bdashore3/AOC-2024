if (import.meta.main) {
    // Read the file
    const decoder = new TextDecoder("utf-8");
    const inputFile = await Deno.readFile("input.txt");
    const inputText = decoder.decode(inputFile);

    // firstCol: locationIds
    // secondCol: Frequency of numbers
    const firstCol: number[] = [];
    const secondCol: number[] = [];

    for (const line of inputText.trim().split("\n")) {
        const [first, second] = line.split(/\s+/).map((e) => parseInt(e));
        firstCol.push(first);
        secondCol.push(second);
    }

    // Sort the arrays
    const secondColFreqs = secondCol.reduce(
        (acc: Map<number, number>, e: number) => {
            return acc.set(e, (acc.get(e) || 0) + 1);
        },
        new Map(),
    );

    // Run multiplication operation
    let simScore = 0;
    for (const locationId of firstCol) {
        simScore += locationId * (secondColFreqs.get(locationId) ?? 0);
    }

    console.log(`Similarity score: ${simScore}`);
}
