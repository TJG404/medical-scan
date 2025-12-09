import { validateUsername, validatePassword, validateEmail, validateName, validatePhone, formatPhoneString } from "./validation.js";

window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("signup-form");
    const verifyBtn = document.getElementById("email-verify-btn");
    const username = document.getElementById("username")
    const password = document.getElementById("password")
    const hospital = document.getElementById("hospital")
    const department = document.getElementById("department")
    const name = document.getElementById("name")
    const email = document.getElementById("email")
    const verification = document.getElementById("verification-code")
    const phone = document.getElementById("phone")
    const privacyPolicyCheckbox = document.getElementById("privacy-policy");

    let checkUsername = false;
    let checkPassword = false;
    let checkHospitalDepartment = false;
    let checkName = false;
    let checkEmail = false;
    let checkVerification = false;
    let checkPhone = false;

    verifyBtn.addEventListener("click", async () => {
        const email = document.getElementById("email").value;

        if(email && validateEmail(email)){
            alert("인증코드 발송 완료!");
            document.getElementById("verification-code-container").style.display = "block";
            await sendEmail(email);
        } else if(!email) {
            alert("이메일을 입력 해주세요.");
        } else if (!validateEmail(email)) {
            alert("이메일 형식에 맞게 입력해주세요.");
        }
    });

    username.addEventListener("focusout", async () => {
       let target = username.value;
       const msg = document.getElementById("error-username");
       const inputUsername = document.getElementById("input-username");
       const labelUsername = document.getElementById("label-username");

       if(target === "" || !validateUsername(target)) {
           msg.style.display = "block";
           msg.style.marginBottom = "15px";
           username.style.marginBottom = "5px";
           inputUsername.style.marginBottom = "0";
           labelUsername.style.top = "45%";
           checkUsername = false;
       } else {
           msg.style.display = "none";
           msg.style.marginBottom = "0";
           username.style.marginBottom = "0";
           inputUsername.style.marginBottom = "15px";
           labelUsername.style.top = "50%";
           checkUsername = true;
       }

    });

    password.addEventListener("focusout", async () => {
        let target = password.value;
        const msg = document.getElementById("error-password");
        const inputPassword = document.getElementById("input-password");
        const labelPassword = document.getElementById("label-password");

        if(target === "" || !validatePassword(target)) {
            msg.style.display = "block";
            msg.style.marginBottom = "15px";
            password.style.marginBottom = "5px";
            inputPassword.style.marginBottom = "0";
            labelPassword.style.top = "45%";
            checkPassword = false;
        } else {
            msg.style.display = "none";
            msg.style.marginBottom = "0";
            password.style.marginBottom = "0";
            inputPassword.style.marginBottom = "15px";
            labelPassword.style.top = "50%";
            checkPassword = true;
        }

    });

    hospital.addEventListener("focusout", checkEmptyFields);
    department.addEventListener("focusout", checkEmptyFields);

    name.addEventListener("focusout", async () => {
        let target = name.value;
        const msg = document.getElementById("error-name");
        const inputName = document.getElementById("input-name");
        const labelName = document.getElementById("label-name");

        if(target === "" || !validateName(target)) {
            msg.style.display = "block";
            msg.style.marginBottom = "15px";
            name.style.marginBottom = "5px";
            inputName.style.marginBottom = "0";
            labelName.style.top = "45%";
            checkName = false;
        } else {
            msg.style.display = "none";
            msg.style.marginBottom = "0";
            name.style.marginBottom = "0";
            inputName.style.marginBottom = "15px";
            labelName.style.top = "50%";
            checkName = true;
        }

    });

    email.addEventListener("focusout", async () => {
        let target = email.value;
        const msg = document.getElementById("error-email");
        const inputEmail = document.getElementById("input-email");
        const btn = document.getElementById("email-verify-btn");
        const labelEmail = document.getElementById("label-email");

        if(target === "" || !validateEmail(target)) {
            msg.style.display = "block";
            msg.style.marginBottom = "15px";
            email.style.marginBottom = "5px";
            btn.style.marginBottom = "5px";
            inputEmail.style.marginBottom = "0";
            labelEmail.style.top = "45%";
            checkEmail = false;
        } else {
            msg.style.display = "none";
            msg.style.marginBottom = "0";
            email.style.marginBottom = "0";
            btn.style.marginBottom = "0";
            inputEmail.style.marginBottom = "15px";
            labelEmail.style.top = "50%";
            checkEmail = true;
        }

    });

    verification.addEventListener("focusout", async () => {
        let target = verification.value;
        const msg = document.getElementById("error-verification");
        const inputVerification = document.getElementById("verification-code-container");
        const labelVerification = document.getElementById("label-verification");

        if(target === "") {
            msg.style.display = "block";
            msg.style.marginBottom = "15px";
            verification.style.marginBottom = "5px";
            inputVerification.style.marginBottom = "0";
            labelVerification.style.top = "45%";
            checkVerification = false;
        } else {
            msg.style.display = "none";
            msg.style.marginBottom = "0";
            verification.style.marginBottom = "0";
            inputVerification.style.marginBottom = "15px";
            labelVerification.style.top = "50%";
            checkVerification = true;
        }
    });

    phone.addEventListener("focusout", async () => {
        let target = phone.value;
        const msg = document.getElementById("error-phone");
        const inputPhone = document.getElementById("input-phone");
        const labelPhone = document.getElementById("label-phone");

        phone.value = formatPhoneString(target);

        if(target === "" || !validatePhone(phone.value)) {
            msg.style.display = "block";
            msg.style.marginBottom = "15px";
            phone.style.marginBottom = "5px";
            inputPhone.style.marginBottom = "0";
            labelPhone.style.top = "45%";
            checkPhone = false;
        } else {
            msg.style.display = "none";
            msg.style.marginBottom = "0";
            phone.style.marginBottom = "0";
            inputPhone.style.marginBottom = "15px";
            labelPhone.style.top = "50%";
            checkPhone = true;
        }

    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if(!checkUsername) {
            const msg = document.getElementById("error-username");
            const inputUsername = document.getElementById("input-username");
            const labelUsername = document.getElementById("label-username");

            msg.style.display = "block";
            msg.style.marginBottom = "15px";
            username.style.marginBottom = "5px";
            inputUsername.style.marginBottom = "0";
            labelUsername.style.top = "45%";
        }

        if(!checkPassword) {
            const msg = document.getElementById("error-password");
            const inputPassword = document.getElementById("input-password");
            const labelPassword = document.getElementById("label-password");

            msg.style.display = "block";
            msg.style.marginBottom = "15px";
            password.style.marginBottom = "5px";
            inputPassword.style.marginBottom = "0";
            labelPassword.style.top = "45%";
        }

        if(!checkHospitalDepartment) {
            const msg = document.getElementById("error-hospital-department");
            const inputHpDp = document.getElementById("input-hospital-department");
            const labelHospital = document.getElementById("label-hospital");
            const labelDepartment = document.getElementById("label-department");

            msg.style.display = "block";
            msg.style.marginBottom = "15px";
            hospital.style.marginBottom = "5px";
            department.style.marginBottom = "5px";
            inputHpDp.style.marginBottom = "0";
            labelHospital.style.top = "45%";
            labelDepartment.style.top = "45%";
        }

        if(!checkName) {
            const msg = document.getElementById("error-name");
            const inputName = document.getElementById("input-name");
            const labelName = document.getElementById("label-name");

            msg.style.display = "block";
            msg.style.marginBottom = "15px";
            name.style.marginBottom = "5px";
            inputName.style.marginBottom = "0";
            labelName.style.top = "45%";
        }

        if(!checkEmail) {
            const msg = document.getElementById("error-email");
            const inputEmail = document.getElementById("input-email");
            const btn = document.getElementById("email-verify-btn");
            const labelEmail = document.getElementById("label-email");

            msg.style.display = "block";
            msg.style.marginBottom = "15px";
            email.style.marginBottom = "5px";
            btn.style.marginBottom = "5px";
            inputEmail.style.marginBottom = "0";
            labelEmail.style.top = "45%";
        }

        if(!checkPhone) {
            const msg = document.getElementById("error-phone");
            const inputPhone = document.getElementById("input-phone");
            const labelPhone = document.getElementById("label-phone");

        if (!privacyPolicyCheckbox.checked) {
            alert("개인정보 수집 및 이용 동의가 필요합니다.");
            return;
        }

        await registAction(username, password, hospital, department, name, email, phone, code);
            msg.style.display = "block";
            msg.style.marginBottom = "15px";
            phone.style.marginBottom = "5px";
            inputPhone.style.marginBottom = "0";
            labelPhone.style.top = "45%";
        }

        else if(checkUsername && checkPassword && checkHospitalDepartment && checkName && checkEmail && !checkVerification && checkPhone){
            alert("이메일 인증을 진행해주세요.");
        } else if(checkUsername && checkPassword && checkHospitalDepartment && checkName && checkEmail && checkVerification && checkPhone){
            await registAction(username.value, password.value, hospital.value, department.value, name.value, email.value, phone.value, verification.value);
        }
    });

    function checkEmptyFields() {
        const msg = document.getElementById("error-hospital-department");
        const inputHpDp = document.getElementById("input-hospital-department");
        const labelHospital = document.getElementById("label-hospital");
        const labelDepartment = document.getElementById("label-department");

        if (!hospital.value.trim() || !department.value.trim()) {
            msg.style.display = "block";
            msg.style.marginBottom = "15px";
            hospital.style.marginBottom = "5px";
            department.style.marginBottom = "5px";
            inputHpDp.style.marginBottom = "0";
            labelHospital.style.top = "45%";
            labelDepartment.style.top = "45%";
            checkHospitalDepartment = false;
        } else {
            msg.style.display = "none";
            msg.style.marginBottom = "0";
            hospital.style.marginBottom = "0";
            department.style.marginBottom = "0";
            inputHpDp.style.marginBottom = "15px";
            labelHospital.style.top = "50%";
            labelDepartment.style.top = "50%";
            checkHospitalDepartment = true;
        }
    }
});

async function sendEmail(email) {
    const response = await fetch("/send-verification", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "email": email
        })
    });
    const json = await response.json();
    return json.isValid;
}

async function registAction(username, password, hospital, department, name, email, phone, code) {
    const response = await fetch("/users/action/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username,
            "password" : password,
            "hospital": hospital,
            "department": department,
            "name": name,
            "email": email,
            "phone": phone,
            "code": code
        })
    });

    if (response.ok) {
        window.location.href = "/users/signin";
        alert("회원가입 성공!");
        return true;
    } else {
        const json = await response.json();
        alert(`오류 : 회원가입 실패`);
        return json.isValid;
    }
}

const modal = document.getElementById("privacy-modal");
const privacyLink = document.getElementById("privacy-link");
const closeBtn = document.getElementsByClassName("close")[0];

privacyLink.addEventListener("click", function (event) {
    event.preventDefault();
    modal.style.display = "block";
});

closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});
