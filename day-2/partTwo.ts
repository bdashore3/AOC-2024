enum Sign {
    Inc = "inc",
    Dec = "dec",
}

interface Report {
    safe: boolean;
    levels: number[];
}

function parseReport(levels: number[]): boolean {
    // Store the report's direction
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

// Non-mutable slice
function removeFromArray(levels: number[], at: number): number[] {
    return [...levels.slice(0, at), ...levels.slice(at + 1)];
}

if (import.meta.main) {
    // Read the file
    const decoder = new TextDecoder("utf-8");
    const rawFile = await Deno.readFile("input.txt");
    const rawText = decoder.decode(rawFile).trim();

    const reports = rawText.split("\n").map((e): Report => {
        return {
            safe: true,
            levels: e.split(" ").map((n) => parseInt(n)),
        };
    });

    for (const report of reports) {
        // Initially check the safety flag
        report.safe = parseReport(report.levels);

        // If the safety check passes, congrats!
        if (report.safe) {
            continue;
        }

        // Part 2: Dampener mechanism
        // If the safety check failed, keep dropping levels until it's safe again (rewind and restart)
        // If after all checks, there's no safety, the levels are broken.
        for (let i = 0; i < report.levels.length; i++) {
            // Kinda went insane here, but we basically don't want to mutate the parent array.
            const newLevels = removeFromArray(report.levels, i);
            if (parseReport(newLevels)) {
                report.safe = true;
                break;
            }
        }
    }

    // Filter all the reports and log
    const safeReports = reports.filter((report) => report.safe);
    console.log(`${safeReports.length} reports are safe.`);
}
