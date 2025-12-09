document.addEventListener("DOMContentLoaded", function() {
    const patientCode = getPatientCodeFromURL();

    if (patientCode) {
        document.getElementById("patient-code").textContent = patientCode + "님의 진료기록";
        fetchClinicData(patientCode);
    } else {
        console.error("URL에서 환자 코드를 찾을 수 없습니다.");
    }

    // 버튼 클릭 시 addClinic 페이지로 이동
    document.querySelector("#add-button").addEventListener("click", function() {
        window.location.href = "/clinic/add/" + patientCode;
    });
});

// URL에서 환자코드 추출
function getPatientCodeFromURL() {
    const pathSegments = window.location.pathname.split("/");
    return pathSegments.length > 2 ? pathSegments[2] : null;  // /clinic/{patientCode} 구조
}

// 진료 데이터 및 페이징 처리 변수
let allClinics = []; // 전체 데이터를 저장할 배열
let currentPage = 1; // 현재 페이지
const itemsPerPage = 10; // 한 페이지당 표시할 개수

// 진료 데이터 가져오기
function fetchClinicData(patientCode) {
    fetch(`/clinic/action/${patientCode}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("진료 정보를 찾을 수 없습니다.");
            }
            return response.json();
        })
        .then(data => {
            allClinics = data; // 전체 데이터 저장
            currentPage = 1; // 페이지 초기화
            updatePaginationControls(); // 페이지네이션 버튼 업데이트
            displayPage(currentPage); // 첫 페이지 데이터 표시
        })
        .catch(error => {
            console.error("진료 데이터를 가져오는 중 오류 발생:", error);
        });
}

// 특정 페이지의 데이터 표시 함수
function displayPage(page) {
    const tbody = document.getElementById("clinic-body");

    if (!tbody) {
        console.error("tbody 요소를 찾을 수 없습니다.");
        return;
    }

    tbody.innerHTML = ""; // 기존 데이터 초기화
    currentPage = page; // 현재 페이지 업데이트

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = allClinics.slice(start, end);

    paginatedItems.forEach(clinic => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${clinic.clinicCode}</td>
            <td>${clinic.patientCode}</td>
            <td>${clinic.clinicDate ? new Date(clinic.clinicDate).toLocaleDateString() : "미등록"}</td>
            <td>${clinic.context}</td>
            <td>${new Date(clinic.regDate).toLocaleString()}</td>
            <td>${new Date(clinic.modDate).toLocaleString()}</td>
            <td><button class="detail-button" data-cliniccode="${clinic.clinicCode}">상세보기</button></td>
        `;

        tbody.appendChild(tr);
    });

    // 상세보기 버튼 이벤트 추가
    document.querySelectorAll(".detail-button").forEach(button => {
        button.addEventListener("click", function() {
            const clinicCode = this.getAttribute("data-cliniccode");
            window.location.href = `/clinic/detail/${clinicCode}`;
        });
    });

    document.querySelectorAll(".pagination-btn").forEach(btn => {
        btn.classList.remove("active"); // 기존 활성 클래스 제거
    });

    const activeBtn = document.querySelector(`.pagination-btn:nth-child(${page})`);
    if (activeBtn) {
        activeBtn.classList.add("active"); // 현재 페이지 버튼에 활성 클래스 추가
    }
}

// 페이지네이션 버튼 생성
function updatePaginationControls() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = ""; // 기존 버튼 초기화

    const totalPages = Math.ceil(allClinics.length / itemsPerPage);

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
