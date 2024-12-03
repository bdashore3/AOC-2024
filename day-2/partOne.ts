enum Sign {
    Inc = "inc",
    Dec = "dec",
}

interface Report {
    safe: boolean;
    levels: number[];
}

function parseReport(levels: number[]): boolean {
    let direction: Sign | undefined;

    // Start with the second element
    for (let i = 1; i < levels.length; i++) {
        const curLevel = levels[i];
        const prevLevel = levels[i - 1];
        const difference = Math.abs(curLevel - prevLevel);

        // Check difference bounds
        if (difference < 1 || difference > 3 || curLevel == prevLevel) {
            return false;
        }

        // Check signs
        const curDirection = curLevel > prevLevel ? Sign.Inc : Sign.Dec;
        if (!direction) {
            direction = curDirection;
            continue;
        }

        if (curDirection != direction) {
            return false;
        }
    }

    return true;
}

if (import.meta.main) {
    // Read the file
    const decoder = new TextDecoder("utf-8");
    const rawFile = await Deno.readFile("input.txt");
    const rawText = decoder.decode(rawFile).trim();

    // Map to a report object
    const reports = rawText.split("\n").map((e): Report => {
        return {
            safe: true,
            levels: e.split(" ").map((n) => parseInt(n)),
        };
    });

    // Change the safety flag if false
    for (const report of reports) {
        report.safe = parseReport(report.levels);
    }

    // Filter and log
    const safeReports = reports.filter((report) => report.safe);
    console.log(safeReports.length);
}
