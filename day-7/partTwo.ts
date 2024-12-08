interface Equation {
    answer: number;
    inputs: number[];
    asserted: boolean;
}

// Use numbers for operations
// Utilized when computing operation combinations
// Part 2: Add concat operation, everything else is the same
enum Operation {
    Add = 0,
    Multiply = 1,
    Concat = 2,
}

const Operations = {
    0: (a: number, b: number) => a + b,
    1: (a: number, b: number) => a * b,
    2: (a: number, b: number) => parseInt(`${a}${b}`),
};

function getPossibleOps(equation: Equation) {
    const inputLen = equation.inputs.length;
    const opCount = inputLen - 1;
    const allOpsLength = Object.keys(Operations).length;

    // Maximum amount of permutations
    // all possible operations ^ amount of operations to do
    const maxPermutations = Math.pow(allOpsLength, opCount);

    // Iterate and get all possible combinations of operations
    for (let i = 0; i < maxPermutations; i++) {
        const possibleOps: Operation[] = [];

        let temp = i;
        for (let j = 0; j < opCount; j++) {
            possibleOps.push(temp % allOpsLength);
            temp = Math.floor(temp / allOpsLength);
        }

        // Apply the combinations and get the value
        const value = possibleOps.reduce((result, op, index) => {
            return Operations[op](result, equation.inputs[index + 1]);
        }, equation.inputs[0]);

        // Get out if the value is found
        if (value === equation.answer) {
            equation.asserted = true;
            return;
        }
    }
}

function solve(equations: Equation[]) {
    for (const equation of equations) {
        getPossibleOps(equation);
    }

    // Compute the sum based on the equations that assert the correct value
    const validSum = equations.filter((equation) => equation.asserted).reduce(
        (sum, equation) => sum + equation.answer,
        0,
    );

    console.log(`Sum: ${validSum}`);
}

if (import.meta.main) {
    const rawInput = await Deno.readTextFile("input.txt");
    const lines = rawInput.trim().split("\n");
    const equations: Equation[] = lines.map((line): Equation => {
        const splitLine = line.split(" ");
        const answerString = splitLine.shift();
        if (!answerString) {
            throw new Error("Cannot parse equation map");
        }

        const answer = parseInt(answerString.slice(0, answerString.length - 1));

        return {
            answer,
            inputs: splitLine.map((num) => parseInt(num)),
            asserted: false,
        };
    });

    solve(equations);
}
