import { createSession } from "./admin.js";

window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("signin-form");
    const verifyBtn = document.getElementById("email-verify-btn");
    const username = document.getElementById("username")
    const password = document.getElementById("password")
    const verification = document.getElementById("verification-code")

    let checkUsername = false;
    let checkPassword = false;
    let checkVerification = false;

    verifyBtn.addEventListener("click", async () => {
        const username = document.getElementById("username").value;

        if(username){
            alert("인증코드 발송 완료!");
            document.getElementById("verification-code-container").style.display = "block";
            await sendEmailByUsername(username);
        } else if (!username) {
            alert("아이디를 입력 해주세요.");
        }
    });

    username.addEventListener("focusout", async () => {
        let target = username.value;
        const msg = document.getElementById("error-username");
        const btn = document.getElementById("email-verify-btn");
        const inputUsername = document.getElementById("input-username");
        const labelUsername = document.getElementById("label-username");

        if(target === "") {
            msg.style.display = "block";
            msg.style.marginBottom = "15px";
            username.style.marginBottom = "5px";
            btn.style.marginBottom = "5px";
            inputUsername.style.marginBottom = "0";
            labelUsername.style.top = "45%";
            checkUsername = false;
        } else {
            msg.style.display = "none";
            msg.style.marginBottom = "0";
            username.style.marginBottom = "0";
            btn.style.marginBottom = "0";
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

        if(target === "") {
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

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if(!checkUsername) {
            const msg = document.getElementById("error-username");
            const btn = document.getElementById("email-verify-btn");
            const inputUsername = document.getElementById("input-username");
            const labelUsername = document.getElementById("label-username");

            msg.style.display = "block";
            msg.style.marginBottom = "15px";
            btn.style.marginBottom = "5px";
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

        else if(checkUsername && checkPassword && !checkVerification) {
            alert("이메일 인증을 진행해주세요.");
        } else if (checkUsername && checkPassword && checkVerification) {
            await loginAction(username.value, password.value, verification.value);
            if(username.value === "administrator") {
                await createSession();
            }
        }
    });
})

async function sendEmailByUsername(username) {
    const response = await fetch("/send-verification", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username
        })
    });
    const json = await response.json();
    return json.isValid;
}

async function loginAction(username, password, code) {
    const response = await fetch("/users/action/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username,
            "password" : password,
            "code" : code
        })
    });

    if (response.ok) {
        window.location.href = "/";
        alert("로그인 성공!");
        return true;
    } else {
        const json = await response.json();
        alert(`${json.message}`);
        return json.isValid;
    }
}