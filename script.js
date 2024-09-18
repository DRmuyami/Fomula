// script.js

// 真理値表を生成する関数
function generateTruthTable() {
    const numElements = document.getElementById('numElements').value; // 要素数を取得
    const combinations = generateCombinations(numElements); // 真理値表の組み合わせを生成
    renderTable(combinations, numElements); // テーブルを描画
}

// 真理値表の組み合わせを生成する関数
function generateCombinations(numElements) {
    const combinations = [];
    const rows = Math.pow(2, numElements); // 行数は2の要素数乗
    for (let i = 0; i < rows; i++) {
        const combination = [];
        for (let j = numElements - 1; j >= 0; j--) {
            combination.push((i & (1 << j)) ? '1' : '0'); // 各ビットをチェックして0または1を追加
        }
        combinations.push(combination);
    }
    return combinations;
}

// テーブルを描画する関数
function renderTable(combinations, numElements) {
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');
    tableHeader.innerHTML = '<th>Index</th>'; // インデックス列のヘッダー
    tableBody.innerHTML = '';

    // 各要素のヘッダーを作成
    for (let i = 0; i < numElements; i++) {
        const th = document.createElement('th');
        th.textContent = `Element ${i + 1}`;
        th.setAttribute('onclick', `sortTable(${i + 1})`); // ソート機能を追加
        tableHeader.appendChild(th);
    }

    // 追加列のヘッダー
    const extraTh = document.createElement('th');
    extraTh.textContent = 'result value';
    tableHeader.appendChild(extraTh);

    // 各行を作成
    combinations.forEach((combination, index) => {
        const tr = document.createElement('tr');
        const indexTd = document.createElement('td');
        indexTd.textContent = index; // インデックスを設定
        tr.appendChild(indexTd);
        combination.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            td.setAttribute('contenteditable', 'true'); // 編集可能に設定
            tr.appendChild(td);
        });
        // 追加列のセル
        const extraTd = document.createElement('td');
        extraTd.textContent = 'x'; // 初期値を 'x' に設定
        extraTd.setAttribute('contenteditable', 'true');
        extraTd.addEventListener('input', handleInput); // 入力制限を追加
        tr.appendChild(extraTd);

        tableBody.appendChild(tr);
    });
}

// 入力制限を処理する関数
function handleInput(event) {
    const validKeys = ['0', '1', 'x'];
    const inputValue = event.target.textContent;
    if (!validKeys.includes(inputValue)) {
        event.target.textContent = 'x'; // 無効な入力は 'x' にリセット
    }
}

// テーブルをソートする関数
function sortTable(columnIndex) {
    const table = document.getElementById('truthTable');
    const rows = Array.from(table.rows).slice(1); // ヘッダーを除く行を取得
    const tbody = table.tBodies[0];
    const sortedRows = rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].textContent;
        const cellB = b.cells[columnIndex].textContent;
        return cellA.localeCompare(cellB); // 文字列として比較
    });
    sortedRows.forEach(row => tbody.appendChild(row)); // ソートされた行を再配置
}

// ログを表示する関数
function logMessage(message) {
    const logDiv = document.getElementById('log');
    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    logDiv.appendChild(logEntry);
}

// bitstate配列を作成する関数
function createBitstateArray(numElements) {
    const arraySize = Math.pow(2, numElements);
    const bitstateArray = new Array(arraySize).fill(0);
    return bitstateArray;
}

/*
function simplifyFormulaByQuineMcCluskeyAlgorithm(formula) {
    logMessage('Starting simplification process');
    const terms = formula.split(' + ').map(term => term.split('・').map(literal => {
        const negated = literal.startsWith('!');
        return {
            variable: literal.replace('!', ''),
            negated
        };
    }));

    logMessage('Parsed terms: ' + JSON.stringify(terms));
    const numVariables = terms[0].length;
    const primeImplicants = [];
    const table = new Map();

    terms.forEach(term => {
        const binary = term.map(({ variable, negated }) => {
            const index = parseInt(variable.replace('A', ''));
            return negated ? 0 : (1 << (numVariables - 1 - index));
        }).reduce((acc, val) => acc | val, 0);

        if (!table.has(binary)) {
            table.set(binary, 0);
        }
        table.set(binary, table.get(binary) + 1);
    });

    logMessage('Generated table: ' + JSON.stringify(Array.from(table.entries())));
    const sortedTable = Array.from(table.keys()).sort((a, b) => table.get(a) - table.get(b));
    const column = Array.from({ length: numVariables + 1 }, () => new Set());

    sortedTable.forEach((key, index) => {
        const binary = key.toString(2).padStart(numVariables, '0');
        const count = table.get(key);
        const primeImplicant = {
            binary,
            count
        };
        primeImplicants.push(primeImplicant);

        for (let i = 0; i < numVariables; i++) {
            if (binary[i] === '1') {
                column[i].add(primeImplicant);
            }
        }
        column[numVariables].add(primeImplicant);
    });

    logMessage('Prime implicants: ' + JSON.stringify(primeImplicants));
    const essentialPrimeImplicants = new Set();
    const coveredTerms = new Set();

    for (let i = 0; i < numVariables; i++) {
        const currentColumn = column[i];
        const nextColumn = column[i + 1];
        const remainingTerms = new Set();

        currentColumn.forEach(primeImplicant => {
            if (primeImplicant.count === 1) {
                essentialPrimeImplicants.add(primeImplicant);
                primeImplicant.covered = true;
                const binary = primeImplicant.binary;
                terms.forEach((term, index) => {
                    const termBinary = term.map(({ variable, negated }) => {
                        const idx = parseInt(variable.replace('A', ''));
                        return negated ? 0 : (1 << (numVariables - 1 - idx));
                    }).reduce((acc, val) => acc | val, 0);
                    if (binary === termBinary) {
                        coveredTerms.add(index);
                    }
                });
            } else {
                remainingTerms.add(primeImplicant);
            }
        });

        column[i + 1] = remainingTerms;
    }

    logMessage('Essential prime implicants: ' + JSON.stringify(Array.from(essentialPrimeImplicants)));
    let simplifiedFormula = '';

    essentialPrimeImplicants.forEach(primeImplicant => {
        const binary = primeImplicant.binary;
        const term = binary.split('').map((bit, index) => {
            const variable = `A${numVariables - 1 - index}`;
            return bit === '1' ? variable : `!${variable}`;
        }).join('・');
        simplifiedFormula += `(${term}) + `;
    });

    simplifiedFormula = simplifiedFormula.slice(0, -3); // 最後の " + " を削除
    logMessage('Simplified formula: ' + simplifiedFormula);
    return simplifiedFormula;
}
    */

/*
function simplifyFormulaByQuineMcCluskeyAlgorithm(formula) {
    const terms = formula.split(' + ').map(term => term.split('・').map(literal => {
        const negated = literal.startsWith('!');
        return {
            variable: literal.replace('!', ''),
            negated
        };
    }));

    const numVariables = terms[0].length;
    const primeImplicants = [];
    const table = new Map();

    terms.forEach(term => {
        const binary = term.map(({ variable, negated }) => {
            const index = parseInt(variable.replace('A', ''));
            return negated ? 0 : (1 << (numVariables - 1 - index));
        }).reduce((acc, val) => acc | val, 0);

        if (!table.has(binary)) {
            table.set(binary, 0);
        }
        table.set(binary, table.get(binary) + 1);
    });

    const sortedTable = Array.from(table.keys()).sort((a, b) => table.get(a) - table.get(b));
    const column = Array.from({ length: numVariables + 1 }, () => new Set());

    sortedTable.forEach((key, index) => {
        const binary = key.toString(2).padStart(numVariables, '0');
        const count = table.get(key);
        const primeImplicant = {
            binary,
            count
        };
        primeImplicants.push(primeImplicant);

        for (let i = 0; i < numVariables; i++) {
            if (binary[i] === '1') {
                column[i].add(primeImplicant);
            }
        }
        column[numVariables].add(primeImplicant);
    });

    const essentialPrimeImplicants = new Set();
    const coveredTerms = new Set();

    for (let i = 0; i < numVariables; i++) {
        const currentColumn = column[i];
        const nextColumn = column[i + 1];
        const remainingTerms = new Set();

        currentColumn.forEach(primeImplicant => {
            if (primeImplicant.count === 1) {
                essentialPrimeImplicants.add(primeImplicant);
                primeImplicant.covered = true;
                const binary = primeImplicant.binary;
                terms.forEach((term, index) => {
                    const termBinary = term.map(({ variable, negated }) => {
                        const idx = parseInt(variable.replace('A', ''));
                        return negated ? 0 : (1 << (numVariables - 1 - idx));
                    }).reduce((acc, val) => acc | val, 0);
                    if (binary === termBinary) {
                        coveredTerms.add(index);
                    }
                });
            } else {
                remainingTerms.add(primeImplicant);
            }
        });

        column[i + 1] = remainingTerms;
    }

    let simplifiedFormula = '';

    essentialPrimeImplicants.forEach(primeImplicant => {
        const binary = primeImplicant.binary;
        const term = binary.split('').map((bit, index) => {
            const variable = `A${numVariables - 1 - index}`;
            return bit === '1' ? variable : `!${variable}`;
        }).join('・');
        simplifiedFormula += `(${term}) + `;
    });

    simplifiedFormula = simplifiedFormula.slice(0, -3); // 最後の " + " を削除
    return simplifiedFormula;
}
*/

// 以下のような論理式をクワイン・マクラスキー法により簡略化する関数
// 引数はformula。例えば、(!A0!A1A2) + (!A0A1A2) + (A0!A1!A2) + (A0!A1A2)　のような形式
// 戻り値は簡略化された数式
// 適当にログを挟んでください。
function simplifyFormulaByQuineMcCluskeyAlgorithm2(formula) {
    
}

// 数式を逆ポーランド記法に変換する関数
// 引数はformula。例えば、 (!A0!A1A2) + (!A0A1A2) + (A0!A1!A2) + (A0!A1A2)　のような形式
// 戻り値は変換後の数式
function infixToRPN(formula) {
    const precedence = {
        '!': 3,
        '・': 2,
        '+': 1
    };

    const operators = [];
    const output = [];

    formula.split(' ').forEach(token => {
        if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators[operators.length - 1] !== '(') {
                output.push(operators.pop());
            }
            operators.pop();
        } else if (token in precedence) {
            while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
                output.push(operators.pop());
            }
            operators.push(token);
        } else {
            output.push(token);
        }
    });

    while (operators.length) {
        output.push(operators.pop());
    }

    return output.join(' ');
}

// 数式を以下の規則に従って成形する関数
// (を｛に、)を｝に、+をORに、・をANDに変換する
function formatFormula(formula) {
    return formula.replace(/\(/g, '{').replace(/\)/g, '}').replace(/\+/g, ' OR ').replace(/・/g, ' AND ');
}

// 数式を生成する関数
function generateFormula() {
    const table = document.getElementById('truthTable');
    if (!table) {
        logMessage('Truth table element not found');
        return;
    }
    const rows = Array.from(table.rows).slice(1); // ヘッダーを除く行を取得
    const numElements = document.getElementById('numElements').value;
    let formula = '';
    const bitstateArray = createBitstateArray(numElements);

    rows.forEach(row => {
        const cells = Array.from(row.cells);
        let resultValue = cells.pop().textContent; // result value 列を取得
        if (resultValue === 'x') {
            resultValue = '0'; // result value が 'x' の場合、0に設定
        }
        if (resultValue === '1') {
            let term = '';
            let index = 0;
            cells.slice(1).forEach((cell, idx) => { // Index列を除外
                const cellValue = cell.textContent;
                term += (cellValue === '1') ? `A${idx}` : `!A${idx}`;
                //term += '・'; // AND演算子として「・」を追加
                index |= (cellValue === '1') ? (1 << idx) : 0; // インデックスを計算
            });
            //term = term.slice(0, -1); // 最後の「・」を削除
            formula += `(${term}) + `;
            bitstateArray[index] = 1; // bitstate配列に結果を設定
        }
    });

    formula = formula.slice(0, -3); // 最後の " + " を削除
    logMessage('Generated formula: ' + formula); // デバッグ用ログ

    const simplifiedFormulaFormula = simplifyFormulaByQuineMcCluskeyAlgorithm(formula);
    logMessage('Generated simpleFormula: ' + simplifiedFormulaFormula); // デバッグ用ログ

    /*
    
    const rpnFormula = infixToRPN(simplifiedFormulaFormula)
    logMessage('Generated rpnformula: ' + rpnFormula); // デバッグ用ログ

    formattedFormula = formatFormula(rpnFormula);
    logMessage('Formatted formula: ' + formattedFormula); // デバッグ用ログ 
    */

    //document.getElementById('formula').textContent = rpnFormula; // 逆ポーランド記法された数式を表示
}

// ページ読み込み時に真理値表を生成
document.addEventListener('DOMContentLoaded', generateTruthTable);
