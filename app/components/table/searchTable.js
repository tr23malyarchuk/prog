function searchTable() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('#data-table tr:not(:first-child)'); 

    rows.forEach(row => {
        const cells = Array.from(row.cells);
        const rowText = cells.map(cell => cell.textContent.toLowerCase()).join(' ');
        row.style.display = rowText.includes(searchInput) ? '' : 'none'; 
    });
}

document.getElementById('search-input').addEventListener('input', searchTable);
