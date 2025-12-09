document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        const reportCode = getReportCodeFromURL();
        if (!reportCode) {
            console.error("URL에서 reportCode를 찾을 수 없습니다.");
            return;
        }
        fetchReportDetail(reportCode);

        const updateButton = document.getElementById("update-button");
        if (updateButton) {
            updateButton.addEventListener("click", function () {
                updateReport(reportCode);
            });
        } else {
            console.error("update-button 요소를 찾을 수 없습니다.");
        }

        const deleteButton = document.getElementById("delete-button");
        if (deleteButton) {
            deleteButton.addEventListener("click", function () {
                deleteReport(reportCode);
            });
        } else {
            console.error("delete-button 요소를 찾을 수 없습니다.");
        }
    }, 500);
});


function getReportCodeFromURL() {
    const pathSegments = window.location.pathname.split("/");
    return pathSegments[pathSegments.length - 1]; // 마지막 경로 값이 reportCode
}

function fetchReportDetail(reportCode) {
    fetch(`/patientScan/action/reports/${reportCode}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`서버 응답 실패: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("reportCode").innerText = data.reportCode;
            document.getElementById("patientId").innerText = data.patientId;
            document.getElementById("patientName").innerText = data.patientName;
            document.getElementById("patientBirthDate").innerText = data.patientBirthDate;
            document.getElementById("patientAge").innerText = `${data.patientAge} 세`;
            document.getElementById("doctor").innerText = data.userCode;
            document.getElementById("approveDate").innerText = new Date(data.approveStudyDate).toLocaleString();
            document.getElementById("studyName").innerText = data.studyName;
            document.getElementById("studyDate").innerText = new Date(data.studyDate).toLocaleString();
            document.getElementById("modality").innerText = data.modality;
            document.getElementById("bodyPart").innerText = data.bodyPart;
            document.getElementById("severityLevel").value = data.severityLevel;
            document.getElementById("reportStatus").value = data.reportStatus;
            document.getElementById("reportText").value = data.reportText;
        })
        .catch(error => console.error("판독 상세 정보를 가져오는 중 오류 발생:", error));
}


function updateReport(reportCode) {
    const updatedData = {
        severityLevel: document.getElementById("severityLevel").value,
        reportStatus: document.getElementById("reportStatus").value,
        reportText: document.getElementById("reportText").value
    };

    fetch(`/patientScan/action/reports/${reportCode}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    })
        .then(response => response.json())
        .then(() => {
            alert("판독 정보가 성공적으로 수정되었습니다!");
            const patientId = document.getElementById("patientId").innerText;
            window.location.href = `/patientScan/radiology/${patientId}`;
        })
        .catch(error => console.error("판독 정보 수정 중 오류 발생:", error));
}

function deleteReport(reportCode) {
    if (!confirm("정말로 삭제하시겠습니까?")) return;

    fetch(`/patientScan/action/reports/${reportCode}`, { method: "DELETE" })
        .then(response => {
            if (response.ok) {
                alert("판독 정보가 삭제되었습니다!");
                const patientId = document.getElementById("patientId").innerText;
                window.location.href = `/patientScan/radiology/${patientId}`;
            } else {
                alert("삭제 실패!");
            }
        })
        .catch(error => console.error("판독 정보 삭제 중 오류 발생:", error));
}
