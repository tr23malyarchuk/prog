function sortTable(columnIndex, ascending = true) {
    const table = document.getElementById('data-table');
    const rows = Array.from(table.rows).slice(1); 
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        return ascending ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });
    rows.forEach(row => table.appendChild(row)); 
}

document.getElementById('sort-asc-btn').addEventListener('click', () => sortTable(1, true)); 
document.getElementById('sort-desc-btn').addEventListener('click', () => sortTable(1, false)); 
