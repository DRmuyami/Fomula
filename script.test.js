const { simplifyFormulaByQuineMcCluskeyAlgorithm2 } = require('./script.js');

describe('simplifyFormulaByQuineMcCluskeyAlgorithm2', () => {
    test('simplifies a formula with multiple terms', () => {
        const formula = '(!A0・!A1・A2) + (!A0・A1・A2) + (A0・!A1・!A2) + (A0・!A1・A2)';
        const expected = '(!A0・A2) + (A0・!A1)';
        const result = simplifyFormulaByQuineMcCluskeyAlgorithm2(formula);
        expect(result).toBe(expected);
    });

    test('simplifies a formula with a single term', () => {
        const formula = '(A0・A1・A2)';
        const expected = '(A0・A1・A2)';
        const result = simplifyFormulaByQuineMcCluskeyAlgorithm2(formula);
        expect(result).toBe(expected);
    });

    test('simplifies a formula with no terms', () => {
        const formula = '';
        const expected = '';
        const result = simplifyFormulaByQuineMcCluskeyAlgorithm2(formula);
        expect(result).toBe(expected);
    });

    test('simplifies a formula with negated terms', () => {
        const formula = '(!A0・A1) + (!A0・!A1)';
        const expected = '!A0';
        const result = simplifyFormulaByQuineMcCluskeyAlgorithm2(formula);
        expect(result).toBe(expected);
    });

    test('simplifies a formula with all possible combinations', () => {
        const formula = '(A0・A1) + (A0・!A1) + (!A0・A1) + (!A0・!A1)';
        const expected = '1'; // All possible combinations should simplify to 1
        const result = simplifyFormulaByQuineMcCluskeyAlgorithm2(formula);
        expect(result).toBe(expected);
    });
});
describe('simplifyFormulaByQuineMcCluskeyAlgorithm', () => {
    test('simplifies a formula with multiple terms', () => {
        const formula = '(!A0・!A1・A2) + (!A0・A1・A2) + (A0・!A1・!A2) + (A0・!A1・A2)';
        const expected = '(!A0・A2) + (A0・!A1)';
        const result = simplifyFormulaByQuineMcCluskeyAlgorithm(formula);
        expect(result).toBe(expected); // Expected: '(!A0・A2) + (A0・!A1)'
    });

    test('simplifies a formula with a single term', () => {
        const formula = '(A0・A1・A2)';
        const expected = '(A0・A1・A2)';
        const result = simplifyFormulaByQuineMcCluskeyAlgorithm(formula);
        expect(result).toBe(expected); // Expected: '(A0・A1・A2)'
    });

    test('simplifies a formula with no terms', () => {
        const formula = '';
        const expected = '';
        const result = simplifyFormulaByQuineMcCluskeyAlgorithm(formula);
        expect(result).toBe(expected); // Expected: ''
    });

    test('simplifies a formula with negated terms', () => {
        const formula = '(!A0・A1) + (!A0・!A1)';
        const expected = '!A0';
        const result = simplifyFormulaByQuineMcCluskeyAlgorithm(formula);
        expect(result).toBe(expected); // Expected: '!A0'
    });

    test('simplifies a formula with all possible combinations', () => {
        const formula = '(A0・A1) + (A0・!A1) + (!A0・A1) + (!A0・!A1)';
        const expected = '1'; // All possible combinations should simplify to 1
        const result = simplifyFormulaByQuineMcCluskeyAlgorithm(formula);
        expect(result).toBe(expected); // Expected: '1'
    });
});