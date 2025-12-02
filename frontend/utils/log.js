let currentPage = 0;

function searchLogs() {
    const search = document.getElementById("search").value;

    const requestBody = {
        search: search ? search : null,
        page: currentPage,
        size: 10
    };

    fetch('/admin/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => {
            const logs = data.content;
            const logList = document.getElementById("log-list");
            logList.innerHTML = "";

            logs.forEach(log => {
                const row = document.createElement("tr");
                const formattedDate = formatDate(log.eventDate);
                row.innerHTML = `<td>${log.userCode}</td><td>${log.reportCode ? log.reportCode : 'N/A'}</td><td>${log.clinicCode ? log.clinicCode : 'N/A'}</td><td>${log.event}</td><td>${formattedDate}</td>`;
                logList.appendChild(row);
            });

            updatePagination(data);
        })
        .catch(error => console.error('Error:', error));
}

function search() {
    currentPage = 0;
    searchLogs();
}

function goToPage(page) {
    if (page < 0 || page >= totalPages) return;
    currentPage = page;
    searchLogs();
}

function updatePagination(data) {
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");

    totalPages = data.totalPages;

    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === totalPages - 1;
}

document.addEventListener("DOMContentLoaded", function() {
    searchLogs();
});

function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
