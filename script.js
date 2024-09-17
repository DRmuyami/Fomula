// script.js
let tableData = [
    { element: 'A', value: '1' },
    { element: 'B', value: '0' }
];

function renderTable() {
    const tbody = document.querySelector('#sortableTable tbody');
    tbody.innerHTML = '';
    tableData.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        Object.values(row).forEach((cellData, colIndex) => {
            const td = document.createElement('td');
            td.textContent = cellData;
            td.setAttribute('contenteditable', 'true');
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

function sortTable(columnIndex) {
    const table = document.getElementById('sortableTable');
    const rows = Array.from(table.rows).slice(1);
    rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].textContent;
        const cellB = b.cells[columnIndex].textContent;
        return cellA.localeCompare(cellB);
    });
    rows.forEach(row => table.appendChild(row));
}

function addRow() {
    tableData.push({ element: 'New', value: 'x' });
    renderTable();
}

function deleteRow() {
    tableData.pop();
    renderTable();
}

function addColumn() {
    const newColumn = prompt("Enter the name of the new column:");
    if (newColumn) {
        tableData.forEach(row => row[newColumn] = 'x');
        const th = document.createElement('th');
        th.textContent = newColumn;
        th.setAttribute('onclick', `sortTable(${Object.keys(tableData[0]).length - 1})`);
        document.querySelector('#sortableTable thead tr').appendChild(th);
        renderTable();
    }
}

function deleteColumn() {
    const columnToDelete = prompt("Enter the name of the column to delete:");
    if (columnToDelete) {
        tableData.forEach(row => delete row[columnToDelete]);
        const ths = document.querySelectorAll('#sortableTable th');
        ths.forEach((th, index) => {
            if (th.textContent === columnToDelete) {
                th.remove();
                tableData.forEach(row => {
                    const cells = document.querySelectorAll(`#sortableTable tbody tr td:nth-child(${index + 1})`);
                    cells.forEach(cell => cell.remove());
                });
            }
        });
        renderTable();
    }
}

document.addEventListener('DOMContentLoaded', renderTable);
