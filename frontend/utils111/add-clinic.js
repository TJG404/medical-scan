document.addEventListener("DOMContentLoaded", function () {
    const patientCode = getPatientCodeFromURL();
    const form = document.getElementById("addClinic-form");

    if (patientCode) {
        document.getElementById("patient-code").textContent = patientCode + "님 진료 등록";
    } else {
        console.error("URL에서 환자 코드를 찾을 수 없습니다.");
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const userCode = document.getElementById("userCode").value;
        const context = document.getElementById("context").value;
        const clinicDateInput = document.getElementById("clinicDate").value;

        // 입력된 날짜를 Date 객체로 변환
        const clinicDate = new Date(clinicDateInput);
        const currentDate = new Date();

        // 시간을 00:00:00으로 초기화하여 날짜만 비교
        currentDate.setHours(0, 0, 0, 0);
        clinicDate.setHours(0, 0, 0, 0);

        if (clinicDate > currentDate) {
            alert("유효하지 않은 날짜입니다.");
            return;
        }

        if (clinicDateInput.trim() === "") {
            alert("진료 날짜를 작성해주세요.");
            return;
        }
        if(context.trim() === ""){
            alert("진료 내용을 작성해주세요.");
            return;
        }
        await addAction(patientCode, userCode, clinicDateInput, context);
    });
});


// URL에서 환자 코드 추출
function getPatientCodeFromURL(){
    const pathSegments=window.location.pathname.split("/");
    return pathSegments.length > 3 ? pathSegments[3]:null; // /clinic/add/{patientCode} 구조
}

async function addAction(patientCode,userCode,clinicDate,context){
    const response = await fetch("/clinic/action",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "patientCode":patientCode,
            "userCode":userCode,
            "clinicDate":clinicDate,
            "context":context
        })
    });
    if (response.ok) {
        window.location.href = "/clinic/"+patientCode;
        alert("진료 등록 성공!");
        return true;
    } else {
        const json = await response.json();
        alert(`오류 : ${json.message}`);
        return json.isValid;
    }

}

