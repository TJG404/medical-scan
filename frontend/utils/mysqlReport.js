// MySQL에서 판독 데이터 가져오기
async function loadRadiologistReport() {
    try {
        const seriesInsUid = window.location.pathname.split("/")[5];

        let response = await fetch(`/patientScan/action/reports/${seriesInsUid}`);
        let reports = await response.json();

        if (reports.length > 0) {
            document.getElementById("reportText").value = reports[0].reportText || "";
            document.getElementById("severityLevel").innerText = reports[0].severityLevel || "N/A";
            document.getElementById("reportStatus").innerText = reports[0].reportStatus || "N/A";
        }
    } catch (error) {
        console.error("판독 데이터 불러오기 오류:", error);
    }
}

// MySQL에 판독 데이터 저장
async function saveRadiologistReport() {

    const reportText = document.getElementById("reportText").value;
    const severityLevel = document.getElementById("severityLevel").innerText;
    const reportStatus = document.getElementById("reportStatus").innerText;
    const seriesInsUid = window.location.pathname.split("/")[5];

    const patientId = document.getElementById("patientId").innerText;
    const patientName = document.getElementById("patientName").innerText;
    const patientSex = document.getElementById("patientSex").innerText;
    const patientBirthDate = document.getElementById("patientBirth").innerText;
    const patientAge = document.getElementById("patientAge").innerText;
    const studyDate = document.getElementById("studyDate").innerText;
    const studyName = document.getElementById("studyDesc").innerText;
    const modality = document.getElementById("modality").innerText;
    const bodyPart = document.getElementById("bodyPart").innerText;
    const userCode = document.getElementById("userCode").innerText; // 판독 의사 ID
    const approveUserCode = document.getElementById("approveUserCode").innerText; // 승인 의사 ID
    const approveStudyDate = document.getElementById("approveStudyDate").innerText; // 판독 승인 날짜

    const reportData = {
        seriesInsUid: seriesInsUid,
        patientId: patientId,
        patientName: patientName,
        patientSex: patientSex,
        patientBirthDate: patientBirthDate,
        patientAge: patientAge,
        studyDate: studyDate,
        studyName: studyName,
        modality: modality,
        bodyPart: bodyPart,
        severityLevel: severityLevel,
        reportStatus: reportStatus,
        reportText: reportText,
        userCode: userCode,
        approveUserCode: approveUserCode,
        approveStudyDate: approveStudyDate,
        regDate: new Date().toISOString(),
        modDate: new Date().toISOString()
    };

    try {
        let response = await fetch("/patientScan/action/reports/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reportData),
        });

        let result = await response.json();
        console.log("저장 완료:", result);
        document.getElementById("autoSaveStatus").innerText = "자동 저장 완료!";
    } catch (error) {
        console.error("저장 오류:", error);
    }
}

// 자동 저장 기능 (1분마다 저장)
function setupAutoSave() {
    console.log("자동 저장 기능 활성화됨!");
    setInterval(saveRadiologistReport, 60000);
}

// 저장 버튼 클릭 이벤트 연결 & 자동 저장 설정
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("saveReportBtn").addEventListener("click", saveRadiologistReport);
    loadRadiologistReport(); // 페이지 로드 시 자동으로 데이터 불러오기
    setupAutoSave(); // **자동 저장 기능 실행**
});
