document.addEventListener("DOMContentLoaded", function () {
    // 현재 페이지 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = urlParams.get("page") || "1"; // 기본값 1

    // 페이지네이션 버튼 이벤트 추가
    document.querySelectorAll(".pagination-btn").forEach(button => {
        const page = button.getAttribute("data-page");

        // 현재 페이지와 일치하는 버튼에 active 클래스 추가
        if (page === currentPage) {
            button.classList.add("active");
        }

        button.addEventListener("click", function () {
            goToPage(page);
        });
    });

    // 진료보기 버튼 이벤트 추가
    document.querySelectorAll(".clinic-btn").forEach(button => {
        button.addEventListener("click", function () {
            const pid = this.getAttribute("data-pid"); // data-pid 속성에서 환자 ID 가져오기
            goToClinic(pid);
        });
    });

    // 판독보기 버튼 이벤트 추가
    document.querySelectorAll(".report-btn").forEach(button => {
        button.addEventListener("click", function () {
            const pid = this.getAttribute("data-pid"); // data-pid 속성에서 환자 ID 가져오기
            goToReport(pid);
        });
    });
});

// 페이지 이동 함수
function goToPage(page) {
    window.location.href = "?page=" + page;
}

// 진료 페이지 이동 함수
function goToClinic(pid) {
    window.location.href = "/clinic/" + pid; // /clinic/{pid} 경로로 이동
}

// 판독 페이지 이동 함수
function goToReport(pid) {
    window.location.href = "/patientScan/radiology/" + pid;
}
