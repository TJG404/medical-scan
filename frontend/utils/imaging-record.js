document.addEventListener("DOMContentLoaded", async () => {
    console.log("페이지 로드 완료, 초기화 시작");

    // 유저 정보 확인
    await fetchAuthUser();
    
    // 🛠 초기 데이터 로드
    loadStudyAndSeriesInfo();
    await loadPatientInfo();

    // 🛠 판독 데이터 로드 (최신 데이터 가져오기)
    await loadLatestRadiologistReport();

    // 버튼 이벤트 등록
    setupEventListeners();
});

// 최신 판독 데이터 로드 함수
async function loadLatestRadiologistReport() {
    const patientIdElement = document.getElementById("patientId");
    if (!patientIdElement || !patientIdElement.textContent.trim()) {
        console.warn("환자 ID가 아직 설정되지 않음, 판독 데이터 로드를 중단합니다.");
        return;
    }

    const patientId = patientIdElement.textContent.trim();

    try {
        const response = await fetch(`/patientScan/action/latest/${patientId}`);
        if (!response.ok) throw new Error(`서버 오류: ${response.statusText}`);

        const report = await response.json();
        console.log("최신 판독 데이터 응답:", report);

        if (!report || !report.reportCode) {
            console.warn("판독 데이터가 없음!");
            return;
        }

        updateReportFields(report);
    } catch (error) {
        console.error("판독 데이터 로드 중 오류 발생:", error);
    }
}

// 버튼 이벤트 핸들러 설정
function setupEventListeners() {
    // 판독 목록 버튼 (환자 ID를 URL에 추가)
    const editReportBtn = document.getElementById("editReportBtn");
    if (editReportBtn) {
        editReportBtn.addEventListener("click", () => {
            const pidElement = document.getElementById("patientId");
            const pid = pidElement ? pidElement.textContent.trim() : "defaultPid";

            if (!pid || pid === "-") {
                alert("환자 ID가 없습니다! 다시 확인해주세요.");
                console.error("환자 ID가 올바르지 않습니다.");
                return;
            }

            const targetUrl = `/patientScan/radiology/${pid}`;
            console.log(`페이지 이동: ${targetUrl}`);
            window.location.href = targetUrl;
        });
    }

}

// 최신 데이터 화면에 반영하는 함수
function updateReportFields(report) {
    const severityLevelElem = document.getElementById("severityLevel");
    if (severityLevelElem) severityLevelElem.value = report.severityLevel || "1";

    const reportStatusElem = document.getElementById("reportStatus");
    if (reportStatusElem) reportStatusElem.value = report.reportStatus || "Draft";

    const reportTextElem = document.getElementById("reportText");
    if (reportTextElem) reportTextElem.value = report.reportText || "";
}

async function loadStudyAndSeriesInfo() {
    try {
        const urlParts = window.location.pathname.split("/");
        const studyKey = urlParts[4];
        const seriesKey = urlParts[5];

        let response = await fetch(`/patientScan/action/study-series/${studyKey}/${seriesKey}`);
        let data = await response.json();

        if (!data || data.error) {
            console.error("Study/Series 정보를 불러올 수 없습니다!");
            return;
        }

        // Study 정보
        document.getElementById("studyDesc").innerText = data.study.studydesc || "N/A";
        document.getElementById("modality").innerText = data.study.modality || "N/A";
        document.getElementById("bodyPart").innerText = data.study.bodypart || "N/A";
        document.getElementById("accessNum").innerText = data.study.accessnum || "N/A";
        document.getElementById("studyDate").innerText = data.study.studydate || "N/A";
        document.getElementById("seriesCnt").innerText = data.study.seriescnt || "N/A";

        // Series 정보
        document.getElementById("seriesDesc").innerText = data.series.seriesdesc || "N/A";
        document.getElementById("seriesModality").innerText = data.series.modality || "N/A";
        document.getElementById("seriesDate").innerText = data.series.seriesdate || "N/A";
        document.getElementById("imageCnt").innerText = data.series.imagecnt || "N/A";
        document.getElementById("seriesNum").innerText = data.series.seriesnum || "N/A";

        // 판독 결과
        if (data.report) {
            document.getElementById("severityLevel").innerText = data.report.severityLevel || "N/A";
            document.getElementById("reportStatus").innerText = data.report.reportStatus || "N/A";
        }
    } catch (error) {
        console.error("Study/Series 정보 불러오는 중 오류 발생:", error);
    }
}

// 환자정보 불러오기
async function loadPatientInfo() {
    try {
        const urlParts = window.location.pathname.split("/");

        const pid = urlParts[3];

        let response = await fetch(`/patientScan/action/${pid}`);
        let patientData = await response.json();

        if (!patientData || patientData.length === 0 || patientData[0].error) {
            console.error("환자 정보를 불러올 수 없습니다!");
            return;
        }

        const patient = patientData[0];
        document.getElementById("patientName").innerText = patient.pname || "N/A";
        document.getElementById("patientId").innerText = patient.pid || "N/A";
        document.getElementById("patientSex").innerText = patient.psex || "N/A";
        document.getElementById("patientBirth").innerText = patient.pbirthdate || "N/A";
    } catch (error) {
        console.error("환자 정보 불러오는 중 오류 발생:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("saveReportBtn").addEventListener("click", saveRadiologistReport);
    setupAutoSave();
});

function setupAutoSave() {
    console.log("자동 저장 기능 활성화됨!");
    setInterval(saveRadiologistReport, 60000);
}

// yyyyMMdd → YYYY-MM-DDTHH:mm:ss 변환 (LocalDateTime 대응)
function formatTimestampString(dateString) {
    if (!dateString || dateString.length < 10) {
        return new Date().toISOString().substring(0, 19); // 현재 시간 ISO 형식
    }
    return `${dateString}T00:00:00`; // LocalDateTime 대응
}

async function saveRadiologistReport() {
    console.log("판독 데이터 저장 시도!");

    // 판독 내용이 없으면 저장하지 않음
    const reportTextElem = document.getElementById("reportText");
    if (!reportTextElem || reportTextElem.value.trim() === "") {
        console.warn("판독 내용이 없어 자동 저장을 중단합니다.");
        return;
    }

    function getElementValue(id, defaultValue = "N/A") {
        const elem = document.getElementById(id);
        return elem ? (elem.value || elem.innerText || defaultValue) : defaultValue;
    }

    function parseIntegerValue(id, defaultValue = 0) {
        const value = getElementValue(id, defaultValue);
        return isNaN(parseInt(value)) ? defaultValue : parseInt(value);
    }

    function calculateAge(birthDateString) {
        if (!birthDateString || birthDateString.length !== 8) {
            return "Unknown"; // 잘못된 입력값 처리
        }

        const birthYear = parseInt(birthDateString.substring(0, 4), 10);
        const birthMonth = parseInt(birthDateString.substring(4, 6), 10) - 1; // JS는 0부터 시작
        const birthDay = parseInt(birthDateString.substring(6, 8), 10);

        const today = new Date();
        const birthDate = new Date(birthYear, birthMonth, birthDay);

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        // 생일이 지나지 않았으면 나이 -1
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        return age;
    }

    const seriesInsUid = window.location.pathname.split("/")[5];

    const reportData = {
        seriesInsUid: seriesInsUid,
        patientId: getElementValue("patientId"),
        patientName: getElementValue("patientName"),
        patientSex: getElementValue("patientSex"),
        patientBirthDate: formatTimestampString(getElementValue("patientBirth")),
        patientAge: calculateAge(getElementValue("patientBirth")),
        studyDate: formatTimestampString(getElementValue("studyDate")),
        studyName: getElementValue("studyDesc"),
        modality: getElementValue("modality"),
        bodyPart: getElementValue("bodyPart"),
        severityLevel: getElementValue("severityLevel"),
        reportStatus: getElementValue("reportStatus"),
        reportText: getElementValue("reportText"),
        userCode: parseIntegerValue("userCode"),
        approveUserCode: parseIntegerValue("approveUserCode"),
        approveStudyDate: formatTimestampString(getElementValue("approveStudyDate")),
        regDate: new Date().toISOString(),
        modDate: new Date().toISOString()
    };

    console.log("보낼 데이터:", reportData);

    try {
        let response = await fetch("/patientScan/action/reports/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reportData),
        });

        let result = await response.json();
        console.log("저장 완료:", result);

        const statusElement = document.getElementById("autoSaveStatus");
        if (statusElement) {
            statusElement.innerText = "저장 완료!";
            statusElement.style.color = "green";

            // 5초 후 메시지 자동 삭제
            setTimeout(() => {
                statusElement.innerText = "";
            }, 5000);
        }
        document.getElementById("autoSaveStatus").innerText = "저장 완료!";
    } catch (error) {
        console.error("저장 오류:", error);
    }
}

async function fetchAuthUser() {
    try {
        const response = await fetch("/patientScan/action/authUser");
        if (!response.ok) throw new Error("유저 정보를 가져오지 못했습니다.");

        const authUser = await response.json();
        console.log("세션에서 가져온 유저 정보:", authUser);

        // HTML 요소 업데이트 (userCode 표시)
        document.getElementById("userCode").innerText = authUser.userCode;

    } catch (error) {
        console.error("세션 정보 가져오기 실패:", error);
        document.getElementById("userCode").innerText = "-"; // 에러 시 기본값
    }
}
