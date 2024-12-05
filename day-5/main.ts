type Rules = Map<number, Set<number>>;
interface Update {
    valid: boolean;
    elements: Array<number>;
}
type Updates = Update[];

// Check if the update is valid
// If not, set the flag to false
function checkUpdates(rules: Rules, updates: Updates) {
    for (const update of updates) {
        // Use a lookahead method instead of lookbehind
        // This makes the code easier to read by working with
        // the current element instead of the previous element in rule lookup
        for (let i = 0; i < update.elements.length; i++) {
            const curNum = update.elements[i];

            // Is there a number afterwards?
            const nextNum = update.elements[i + 1];
            if (!nextNum) {
                continue;
            }

            // Is there a rule?
            const rule = rules.get(curNum);
            if (!rule) {
                continue;
            }

            // Let's say we have 47|53
            // 47 has to be before 53, which means that 53 has to be after 47
            // So if we get a rule with key 53, and 47 is next num,
            // the update is invalid
            if (rule.has(nextNum)) {
                update.valid = false;
            }
        }
    }
}

// Gets the middle value from each update in a set of updates
// Then returns the sum (the final step to the solution)
function addMiddleArrayValues(updates: Updates) {
    return updates.reduce((count, update) => {
        const midElement =
            update.elements[Math.floor(update.elements.length / 2)];
        return count + midElement;
    }, 0);
}

function partOne(rules: Rules, updates: Updates) {
    checkUpdates(rules, updates);
    const validUpdates = updates.filter((update) => update.valid);

    console.log(`Part 1 update sum: ${addMiddleArrayValues(validUpdates)}`);
}

// Rules:
// - If A is not after B, place it ahead
// - If B is not after A, place it behind
// - If there's no rule, keep everything the same
// Ex. Applying 47|53 shows that 53 isn't after 47,
// so 53 needs to go ahead
function fixUpdate(rules: Rules, update: Update) {
    update.elements.sort((a, b) => {
        if (rules.get(a)?.has(b)) {
            return 1;
        } else if (rules.get(b)?.has(a)) {
            return -1;
        } else {
            return 0;
        }
    });

    return update;
}

function partTwo(rules: Rules, updates: Updates) {
    checkUpdates(rules, updates);

    // List magic to filter out the invalid updates and re-sort them
    const invalidUpdates = updates.filter((update) => !update.valid).map((
        update,
    ) => fixUpdate(rules, update));
    console.log(`Part 2 update sum: ${addMiddleArrayValues(invalidUpdates)}`);
}

if (import.meta.main) {
    const rawFile = await Deno.readTextFile("input.txt");
    const [rawRules, rawUpdates] = rawFile.trim().split("\n\n");

    // Map rules to an after key with a before set
    // Ex. 47|53, 65|53 = 53: {47, 65}
    // This mapping is to make further code readable (see checkUpdates)
    const rules: Rules = new Map<number, Set<number>>();
    rawRules.split("\n").map((ruleSet) => {
        const [before, after] = ruleSet.split("|").map((e) => parseInt(e));
        const existingRule = rules.get(after);
        if (existingRule) {
            existingRule.add(before);
        } else {
            const beforeSet = new Set([before]);
            rules.set(after, beforeSet);
        }
    });

    // Map updates to a 2d array
    const updates = rawUpdates.split("\n").map((update): Update => {
        return {
            valid: true,
            elements: update.split(",").map((e) => parseInt(e)),
        };
    });

    partOne(rules, updates);
    partTwo(rules, updates);
}
