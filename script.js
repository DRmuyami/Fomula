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

// クワイン・マクラスキー法による論理式の簡略化
//参考サイトhttps://shibaken-8128.hatenablog.com/entry/2021/12/01/110905
function simplification(bitstateArray) {
    logMessage('Original bitstate array: ' + bitstateArray.join(', ')); // デバッグ用ログ

    // 最小項を抽出
    const minterms = [];
    bitstateArray.forEach((value, index) => {
        if (value === 1) {
            minterms.push(index.toString(2).padStart(bitstateArray.length.toString(2).length, '0'));
        }
    });
    logMessage('Minterms: ' + JSON.stringify(minterms)); // デバッグ用ログ

    // 最小項をグループ化
    const groups = {};
    minterms.forEach(minterm => {
        const onesCount = minterm.split('1').length - 1;
        if (!groups[onesCount]) groups[onesCount] = [];
        groups[onesCount].push(minterm);
    });
    logMessage('Grouped minterms: ' + JSON.stringify(groups)); // デバッグ用ログ

    // 隣接する最小項をマージ
    let mergedGroups = {};
    let hasMerged = true;
    while (hasMerged) {
        hasMerged = false;
        mergedGroups = {};
        logMessage('Starting new merge iteration'); // マージ処理の開始をログ出力
        Object.keys(groups).forEach(group => {
            groups[group].forEach(minterm => {
                Object.keys(groups).forEach(nextGroup => {
                    if (parseInt(nextGroup) === parseInt(group) + 1) {
                        groups[nextGroup].forEach(nextMinterm => {
                            const diff = minterm.split('').filter((bit, index) => bit !== nextMinterm[index]);
                            if (diff.length === 1) {
                                const mergedMinterm = minterm.split('').map((bit, index) => {
                                    return bit === nextMinterm[index] ? bit : '-';
                                }).join('');
                                if (!mergedGroups[mergedMinterm]) mergedGroups[mergedMinterm] = [];
                                mergedGroups[mergedMinterm].push(minterm, nextMinterm);
                                hasMerged = true;
                                logMessage(`Merged ${minterm} and ${nextMinterm} into ${mergedMinterm}`); // マージ結果をログ出力
                            }
                        });
                    }
                });
            });
        });
        logMessage('Merged groups before update: ' + JSON.stringify(mergedGroups)); // 更新前のマージグループをログ出力
        groups = mergedGroups;
        logMessage('Merged groups after update: ' + JSON.stringify(groups)); // 更新後のマージグループをログ出力
    }
    logMessage('Finished merging iterations'); // マージ処理の終了をログ出力

    // 必須主項を抽出
    const essentialPrimeImplicants = [];
    Object.keys(groups).forEach(group => {
        groups[group].forEach(minterm => {
            const isEssential = !Object.keys(groups).some(otherGroup => {
                return groups[otherGroup].some(otherMinterm => {
                    return otherMinterm !== minterm && otherMinterm.split('').every((bit, index) => {
                        return bit === '-' || bit === minterm[index];
                    });
                });
            });
            if (isEssential) essentialPrimeImplicants.push(minterm);
        });
    });
    logMessage('Essential prime implicants: ' + JSON.stringify(essentialPrimeImplicants)); // デバッグ用ログ

    // 最小積和形に変換
    const simplifiedFormula = essentialPrimeImplicants.map(minterm => {
        return minterm.split('').map((bit, index) => {
            return bit === '-' ? '' : (bit === '1' ? `A${index}` : `!A${index}`);
        }).join('');
    }).join(' + ');

    logMessage('Simplified formula: ' + simplifiedFormula); // デバッグ用ログ
    return simplifiedFormula;
}

// 数式を逆ポーランド記法に変換する関数
function infixToRPN(formula) {
    const precedence = {
        '!': 3,
        '*': 2,
        '+': 1
    };
    const output = [];
    const operators = [];
    const tokens = formula.match(/A\d+|!A\d+|[()*+]/g);

    tokens.forEach(token => {
        if (/A\d+|!A\d+/.test(token)) {
            output.push(token);
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators.length && operators[operators.length - 1] !== '(') {
                output.push(operators.pop());
            }
            operators.pop();
        } else {
            while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
                output.push(operators.pop());
            }
            operators.push(token);
        }
    });

    while (operators.length) {
        output.push(operators.pop());
    }

    return output.join(' ');
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
                term += (cellValue === '1') ? `A${idx}` : `!A${idx}`; // 入力に基づいて項を生成
                index |= (cellValue === '1') ? (1 << idx) : 0; // インデックスを計算
            });
            formula += `(${term}) + `;
            bitstateArray[index] = 1; // bitstate配列に結果を設定
        }
    });

    formula = formula.slice(0, -3); // 最後の " + " を削除
    logMessage('Generated formula: ' + formula); // デバッグ用ログ

    const rpnFormula = infixToRPN(formula)
    document.getElementById('formula').textContent = rpnFormula; // 逆ポーランド記法された数式を表示

    // 簡略化された数式を生成
    const simplifiedFormula = simplification(bitstateArray);
    logMessage('Simplified formula: ' + simplifiedFormula); // デバッグ用ログ
    document.getElementById('formula').textContent = simplifiedFormula; // 簡略化された数式を表示
}

// ページ読み込み時に真理値表を生成
document.addEventListener('DOMContentLoaded', generateTruthTable);
