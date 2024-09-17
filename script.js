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
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    // ヘッダーの作成
    for (let i = 0; i < numElements; i++) {
        const th = document.createElement('th');
        th.textContent = `Element ${i + 1}`;
        th.setAttribute('onclick', `sortTable(${i})`);
        tableHeader.appendChild(th);
    }

    // 行の作成
    combinations.forEach(combination => {
        const tr = document.createElement('tr');
        combination.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            td.setAttribute('contenteditable', 'true');
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

function sortTable(columnIndex) {
    const table = document.getElementById('truthTable');
    const rows = Array.from(table.rows).slice(1);
    rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].textContent;
        const cellB = b.cells[columnIndex].textContent;
        return cellA.localeCompare(cellB);
    });
    rows.forEach(row => table.appendChild(row));
}

document.addEventListener('DOMContentLoaded', generateTruthTable);
