var currentPage = 1;
var itemsPerPage = 20;
var totalPages = 1;
var allStudies = [];
var filteredStudies = [];
var expandedRows = {};
var sortOrder = {};

document.addEventListener("DOMContentLoaded", function () {
    fetchAllPatientRecords();
});

// 모든 환자 데이터를 가져옴 (초기 로드)
function fetchAllPatientRecords() {
    fetch("/patientScan/action/records/all")
        .then(response => response.json())
        .then(data => {
            allStudies = [];
            console.log("초기 테이블 로드 응답 데이터:", data);
            data.forEach(patientData => {
                var patient = patientData.patient;
                var studyDetails = patientData.studyDetails || [];

                studyDetails.forEach(study => {
                    var seriesList = study.series || [];
                    seriesList.forEach(series => {
                        allStudies.push({
                            pname: patient.pname,
                            pid: patient.pid,
                            modality: series.modality || "N/A",
                            studydesc: study.study.studydesc || "N/A",
                            studydate: study.study.studydate || "N/A",
                            studykey: study.study.studykey || study.studykey,
                            serieskey: series.serieskey || series.serieskey,
                            accessnum: study.study.accessnum || "N/A",
                            imagecnt: series.imagecnt || 0
                        });
                    });
                });
            });

            filteredStudies = [...allStudies]; // 검색 초기화
            totalPages = Math.ceil(filteredStudies.length / itemsPerPage);
            displayPage(1);
        })
        .catch(error => console.error("API 호출 중 오류 발생:", error));
}

// 검색 기능
function searchPatient() {
    var pid = document.getElementById("searchPid").value.trim();
    var pname = document.getElementById("searchPname").value.trim();
    var startDate = document.getElementById("searchStartDate").value;
    var endDate = document.getElementById("searchEndDate").value;
    var description = document.getElementById("searchDescription").value.trim();
    var modality = document.getElementById("searchModality").value;
    var accession = document.getElementById("searchAccession").value.trim();

    var url = `/patientScan/action/search?pid=${pid}&pname=${pname}&studydateStart=${startDate}&studydateEnd=${endDate}&studydesc=${description}&modality=${modality}&accessnum=${accession}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            filteredStudies = [];

            data.forEach(studyItem => {
                var study = studyItem.study;
                var seriesList = studyItem.series || [];

                seriesList.forEach(series => {

                    if (modality && modality !== "" && modality !== series.modality) {
                        return;
                    }

                    filteredStudies.push({
                        pname: study.pname,
                        pid: study.pid,
                        modality: series.modality || "N/A",
                        studydesc: study.studydesc || "N/A",
                        studydate: study.studydate || "N/A",
                        studykey: study.studykey || study.studykey,
                        serieskey: series.serieskey || series.serieskey,
                        accessnum: study.accessnum || "N/A",
                        imagecnt: series.imagecnt || 0
                    });
                });
            });

            totalPages = Math.ceil(filteredStudies.length / itemsPerPage);
            displayPage(1);
        })
        .catch(error => console.error("검색 중 오류 발생:", error));
}

// 페이지별 데이터 표시
function displayPage(page) {
    currentPage = page;

    var start = (page - 1) * itemsPerPage;
    var end = start + itemsPerPage;
    var paginatedItems = filteredStudies.slice(start, end);

    renderPatientTable(paginatedItems);
    updatePaginationControls();
}

// 테이블 렌더링
// 테이블 렌더링
function renderPatientTable(data) {
    var tableBody = document.getElementById("patientRecords");
    tableBody.innerHTML = "";

    data.forEach((item, index) => {
        var row = document.createElement("tr");
        row.setAttribute("data-index", index);
        row.innerHTML = `
            <td>
                <button id="expand-btn-${index}" class="expand-btn" onclick="toggleRow(${index}, '${item.pid}')">▶</button>
            </td>
            <td>${item.pname}</td>
            <td>${item.pid}</td>
            <td>${item.studydate}</td>
            <td>${item.studydesc}</td>
            <td>${item.modality}</td>
            <td>${item.accessnum || "N/A"}</td>
            <td>${item.imagecnt}</td>
            <td>
                <button class="btn-analysis" onclick="analyzeImage('${item.pid}', '${item.studykey}', '${item.serieskey}')">
                    Viewer
                </button>
            </td>
        `;
        tableBody.appendChild(row);

        // ✅ 세부목록 추가
        var detailsRow = document.createElement("tr");
        detailsRow.setAttribute("id", `details-${index}`);
        detailsRow.style.display = "none";
        detailsRow.innerHTML = `
            <td colspan="9">
                <div class="details-content">
                    <p><strong>중증도 레벨:</strong> 불러오는 중...</p>
                    <p><strong>보고서 상태:</strong> 불러오는 중...</p>
                    <p><strong>판독 내용:</strong> 불러오는 중...</p>
                    <button class="btn-report disabled">판독 상세목록</button>
                </div>
            </td>
        `;
        tableBody.appendChild(detailsRow);
    });
}

// 세부목록 토글
function toggleRow(index, patientId) {
    var detailsRow = document.getElementById(`details-${index}`);

    if (!detailsRow) {
        console.error(`Row ${index} not found!`);
        return;
    }

    if (!expandedRows[index]) {
        detailsRow.innerHTML = `
            <td colspan="9">
                <div class="details-content">
                    <p><strong>중증도 레벨:</strong> 불러오는 중...</p>
                    <p><strong>보고서 상태:</strong> 불러오는 중...</p>
                    <p><strong>판독 내용:</strong> 불러오는 중...</p>
                </div>
            </td>
        `;
        fetchReportData(patientId, index);
        expandedRows[index] = true;
    }

    detailsRow.style.display = (detailsRow.style.display === "none" || detailsRow.style.display === "") ? "table-row" : "none";
}

// 판독 데이터 불러오기
function fetchReportData(patientId, index) {
    fetch(`/patientScan/action/latest/${patientId}`)
        .then(response => {
            if (!response.ok) {
                console.warn(`서버 응답 오류: ${response.status}`);
                return null;
            }
            return response.text(); // JSON 대신 text로 먼저 읽기
        })
        .then(text => {
            if (!text) return null; // 빈 응답이면 null 반환
            return JSON.parse(text); // JSON 파싱
        })
        .then(report => {
            let detailsRow = document.getElementById(`details-${index}`);
            let expandButton = document.getElementById(`expand-btn-${index}`);

            if (!detailsRow) return;

            // 판독 데이터가 없는 경우 처리
            if (!report) {
                detailsRow.innerHTML = `
                    <td colspan="9">
                        <div class="details-content">
                            <p><strong>중증도 레벨:</strong> 없음</p>
                            <p><strong>보고서 상태:</strong> 없음</p>
                            <p><strong>판독 내용:</strong> 없음</p>
                        </div>
                    </td>
                `;
                return;
            }

            let severityClass = getSeverityClass(report.severityLevel || "0");
            let severityText = getSeverityText(report.severityLevel || "0");

            // 세부목록 버튼 색상 변경
            if (expandButton) {
                expandButton.classList.add(severityClass);
            }

            // 판독 상세목록 버튼 색상 적용
            let reportButtonClass = severityClass ? `btn-report ${severityClass}` : "btn-report";

            // 세부목록 UI 업데이트 (판독 상세목록 버튼 추가)
            detailsRow.innerHTML = `
                <td colspan="9">
                    <div class="details-content ${severityClass}">
                        <p><strong>중증도 레벨:</strong> ${severityText}</p>
                        <p><strong>보고서 상태:</strong> ${report.reportStatus || "없음"}</p>
                        <p><strong>판독 내용:</strong> ${report.reportText || "내용 없음"}</p>
                        <button class="${reportButtonClass}" onclick="location.href='/patientScan/report-detail/${report.reportCode || ''}'">
                            판독 상세목록
                        </button>
                    </div>
                </td>
            `;

            // 판독 기록이 없으면 버튼 비활성화
            if (!report.reportCode) {
                detailsRow.querySelector(".btn-report").classList.add("disabled");
            }
        })
        .catch(error => {
            console.error("판독 데이터 가져오기 실패:", error);
        });
}

function getSeverityClass(severityLevel) {
    switch (severityLevel) {
        case "1": return "severity-critical";   // 파란색
        case "2": return "severity-urgent";    // 빨간색
        case "3": return "severity-high";      // 노란색
        case "4": return "severity-moderate";  // 초록색
        case "5": return "severity-low";       // 흰색
        default: return "severity-default";    // 기본값
    }
}

// 중증도 레벨을 사람이 읽을 수 있는 문자열로 변환하는 함수
function getSeverityText(severityLevel) {
    switch (severityLevel) {
        case "1": return "Critical (위급)";
        case "2": return "Urgent (긴급)";
        case "3": return "High (높음)";
        case "4": return "Moderate (보통)";
        case "5": return "Low (낮음)";
        default: return "Unknown (알 수 없음)";
    }
}

// 정렬 기능
function sortTable(columnKey) {
    if (!sortOrder[columnKey]) {
        sortOrder[columnKey] = 'asc';
    } else {
        sortOrder[columnKey] = sortOrder[columnKey] === 'asc' ? 'desc' : 'asc';
    }

    filteredStudies.sort((a, b) => {
        let valA = a[columnKey];
        let valB = b[columnKey];

        // Images 정렬
        if (columnKey === "imagecnt") {
            valA = (valA && !isNaN(valA)) ? Number(valA) : -1;
            valB = (valB && !isNaN(valB)) ? Number(valB) : -1;
        } else if (columnKey === "pid") {
            //  MRN 정렬 (첫 글자가 숫자인 값이 우선 정렬)
            const isDigitFirst = str => /^\d/.test(str); // 첫 글자가 숫자인 경우
            const isAlphaFirst = str => /^[A-Za-z]/.test(str); // 첫 글자가 영문인 경우

            if (isDigitFirst(valA) && isAlphaFirst(valB)) {
                return -1; // 숫자가 먼저 정렬
            } else if (isAlphaFirst(valA) && isDigitFirst(valB)) {
                return 1; // 영문이 숫자보다 뒤에 위치
            } else {
                return sortOrder[columnKey] === 'asc'
                    ? valA.localeCompare(valB, undefined, { numeric: true })
                    : valB.localeCompare(valA, undefined, { numeric: true });
            }
        } else if (columnKey === "studydate") {
            //  Study Date 정렬 (YYYYMMDD → 날짜 변환 후 정렬)
            valA = new Date(
                valA.substring(0, 4),  // YYYY
                valA.substring(4, 6) - 1, // MM (0부터 시작)
                valA.substring(6, 8)  // DD
            );
            valB = new Date(
                valB.substring(0, 4),
                valB.substring(4, 6) - 1,
                valB.substring(6, 8)
            );
        } else {
            // 일반적인 문자열 정렬 (대소문자 무시)
            valA = String(valA).toLowerCase();
            valB = String(valB).toLowerCase();
        }

        return sortOrder[columnKey] === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

    displayPage(1);
}

// Viewer 페이지 이동
function analyzeImage(pid, studykey, serieskey) {
    window.location.href = `/patientScan/imaging-record/${pid}/${studykey}/${serieskey}`;
}

// 페이지네이션 버튼
function updatePaginationControls() {
    var pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        let button = document.createElement("button");
        button.innerText = i;
        button.classList.add("pagination-btn");

        if (i === currentPage) {
            button.classList.add("active");
        }

        button.onclick = function () {
            displayPage(i);
        };

        pagination.appendChild(button);
    }
}
