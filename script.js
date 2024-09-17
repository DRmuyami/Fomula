// script.js
function generateTruthTable() {
    const numElements = document.getElementById('numElements').value;
    const combinations = generateCombinations(numElements);
    renderTable(combinations, numElements);
}

function generateCombinations(numElements) {
    const combinations = [];
    const rows = Math.pow(2, numElements);
    for (let i = 0; i < rows; i++) {
        const combination = [];
        for (let j = numElements - 1; j >= 0; j--) {
            combination.push((i & (1 << j)) ? '1' : '0');
        }
        combinations.push(combination);
    }
    return combinations;
}

function renderTable(combinations, numElements) {
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');
    tableHeader.innerHTML = '<th>Index</th>';
    tableBody.innerHTML = '';

    // ヘッダーの作成
    for (let i = 0; i < numElements; i++) {
        const th = document.createElement('th');
        th.textContent = `Element ${i + 1}`;
        th.setAttribute('onclick', `sortTable(${i + 1})`);
        tableHeader.appendChild(th);
    }

    // 追加列のヘッダー
    const extraTh = document.createElement('th');
    extraTh.textContent = 'result value';
    tableHeader.appendChild(extraTh);

    // 行の作成
    combinations.forEach((combination, index) => {
        const tr = document.createElement('tr');
        const indexTd = document.createElement('td');
        indexTd.textContent = index;
        tr.appendChild(indexTd);
        combination.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            td.setAttribute('contenteditable', 'true');
            tr.appendChild(td);
        });
        // 追加列のセル
        const extraTd = document.createElement('td');
        extraTd.textContent = 'x';
        extraTd.setAttribute('contenteditable', 'true');
        extraTd.addEventListener('input', handleInput);
        tr.appendChild(extraTd);

        tableBody.appendChild(tr);
    });
}

function handleInput(event) {
    const validKeys = ['0', '1', 'x'];
    const inputValue = event.target.textContent;
    if (!validKeys.includes(inputValue)) {
        event.target.textContent = 'x';
    }
}

function sortTable(columnIndex) {
    const table = document.getElementById('truthTable');
    const rows = Array.from(table.rows).slice(1);
    const tbody = table.tBodies[0];
    const sortedRows = rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].textContent;
        const cellB = b.cells[columnIndex].textContent;
        return cellA.localeCompare(cellB);
    });
    sortedRows.forEach(row => tbody.appendChild(row));
}

function generateFormula() {
    const table = document.getElementById('truthTable');
    const rows = Array.from(table.rows).slice(1);
    const numElements = document.getElementById('numElements').value;
    let formula = '';

    rows.forEach(row => {
        const cells = Array.from(row.cells);
        const resultValue = cells.pop().textContent;
        if (resultValue === '1') {
            let term = '';
            cells.slice(1).forEach((cell, index) => { // Index列を除外
                const cellValue = cell.textContent;
                term += (cellValue === '1') ? `A${index}` : `!A${index}`;
            });
            formula += `(${term}) + `;
        }
    });

    formula = formula.slice(0, -3); // 最後の " + " を削除
    document.getElementById('formula').textContent = formula;
}

document.addEventListener('DOMContentLoaded', generateTruthTable);
