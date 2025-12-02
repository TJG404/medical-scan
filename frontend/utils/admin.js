import { validateUsername, validateEmail } from "./validation.js";

document.addEventListener('DOMContentLoaded', async function () {
    await createSession();
    initializeDropdowns();

    let checkUsername = false;
    let checkEmail = false;

    const showDropdownButton = document.getElementById('showDropdown');
    if (showDropdownButton) {
        showDropdownButton.addEventListener('click', function () {
            toggleDropdown(this);
        });
    }

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => openTab(index));
        let max = document.getElementById("max-length").value;
        let maxList = document.getElementById(`member-${max}`);
        maxList.style.marginBottom = '0';
    });

    document.querySelectorAll("input[id^='username-tab1-']").forEach(input => {
        input.addEventListener("focusout", async function () {
            await checkDupl(this, "username");
        });
    });

    document.querySelectorAll("input[id^='email-tab1-']").forEach(input => {
        input.addEventListener("focusout", async function () {
            await checkDupl(this, "email");
        });
    });

    const forms = document.querySelectorAll("form[data-id]");
    forms.forEach(form => {
        form.addEventListener("submit", async event => {
            event.preventDefault();

            const index = form.getAttribute('data-id');
            const activeTab = document.querySelector(".tab-content.active").id;

            if (activeTab === "tab1") {
                const code = document.getElementById(`userCode-tab1-${index}`).value;
                const username = document.getElementById(`username-tab1-${index}`);
                const email = document.getElementById(`email-tab1-${index}`);
                const status = document.getElementById(`status-tab1-${index}`).value;
                const accountType = document.getElementById(`accountType-tab1-${index}`).value;

                if(!checkUsername) {
                    await checkDupl(username, "username");
                }

                if(!checkEmail) {
                    await checkDupl(email, "email");
                }

                if(checkUsername && checkEmail) {
                    await requestEdit(code, username.value, email.value, status, accountType);
                }

            } else if (activeTab === "tab2") {
                const code = document.getElementById(`userCode-tab2-${index}`).value;
                await requestTemporaryApprove(code);

            } else if (activeTab === "tab3") {
                const code = document.getElementById(`userCode-tab3-${index}`).value;
                await requestDeleteApprove(code);

            }
        });
    });

    async function checkDupl(inputElement, type) {
        const value = inputElement.value.trim();
        if (value === "") return;
        else if(type === "username" && !validateUsername(value)) return;
        else if(type === "email" && !validateEmail(value)) return;

        const index = inputElement.id.match(/\d+$/)[0];
        const messageId = `error-message-${type}-${index}`;

        let msg = document.getElementById(messageId);

        const userCode = document.getElementById(`userCode-tab1-${index}`).value;
        const isDuplicate = await check(userCode, type, value);

        const username = document.getElementById(`username-tab1-${index}`)
        const errUsername = document.getElementById(`error-message-username-${index}`)
        const email = document.getElementById(`email-tab1-${index}`)
        const errEmail = document.getElementById(`error-message-email-${index}`)

        if (type === "username" && isDuplicate) {
            msg.style.display = "block";
            username.style.marginBottom = "5px";
            errUsername.style.marginBottom = "15px";
            checkUsername = false;
        } else if(type === "username" && !isDuplicate) {
            msg.style.display = "none";
            username.style.marginBottom = "15px";
            errUsername.style.marginBottom = "0";
            checkUsername = true;
        } else if(type === "email" && isDuplicate) {
            msg.style.display = "block";
            email.style.marginBottom = "5px";
            errEmail.style.marginBottom = "15px";
            checkEmail = false;
        } else if(type === "email" && !isDuplicate) {
            msg.style.display = "none";
            email.style.marginBottom = "15px";
            errEmail.style.marginBottom = "0";
            checkEmail = true;
        }
    }
});

function openTab(tabIndex) {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach((tab, index) => {
        tab.classList.remove('active');
        tabContents[index].classList.remove('active');
    });

    tabs[tabIndex].classList.add('active');
    tabContents[tabIndex].classList.add('active');

    initializeDropdowns();
}

function initializeDropdowns() {
    const buttons = document.querySelectorAll('.showDropdown');
    const spans = document.querySelectorAll('.showDropdown-span');

    buttons.forEach(button => {
        button.removeEventListener('click', dropdownClickHandler);
        button.addEventListener('click', dropdownClickHandler);
    });

    spans.forEach(span => {
        span.removeEventListener('click', spanClickHandler);
        span.addEventListener('click', spanClickHandler);
    });
}

function dropdownClickHandler(event) {
    toggleDropdown(event.target);
}

function spanClickHandler(event) {
    const span = event.target;
    const button = span.closest('.showDropdown');

    button.click();
    const index = button.getAttribute('data-id');
    const dropdown = document.getElementById(`dropdownMenu-${index}`);

    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
}

function toggleDropdown(button) {
    const index = button.getAttribute('data-id');
    const dropdown = document.getElementById(`dropdownMenu-${index}`);

    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
}

export async function createSession() {
    try {
        const response = await fetch('/admin/session', { method: 'GET' });
        const json = await response.json();
        return json.isValid;
    } catch (error) {
        console.error('세션 생성 실패:', error);
        return false;
    }
}

async function requestEdit(code, username, email, status, accountType) {
    const response = await fetch("/admin/edit", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "code": code,
            "username" : username,
            "email": email,
            "status": status,
            "accountType": accountType
        })
    });
    if (response.ok) {
        alert("사용자 수정 완료!");
        await createSession();
        window.location.reload()
        return true;
    } else {
        const json = await response.json();
        alert(`오류 : ${json.message}`);
        return json.isValid;
    }
}

async function requestTemporaryApprove(code) {
    const response = await fetch("/admin/approve", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "code": code,
        })
    });
    if (response.ok) {
        alert("가입 승인 완료!");
        await createSession();
        window.location.reload()
        return true;
    } else {
        const json = await response.json();
        alert(`오류 : ${json.message}`);
        return json.isValid;
    }
}

async function requestDeleteApprove(code) {
    const response = await fetch("/admin/withdraw", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "code": code,
        })
    });
    if (response.ok) {
        alert("탈퇴 승인 완료!");
        await createSession();
        window.location.reload()
        return true;
    } else {
        const json = await response.json();
        alert(`오류 : 탈퇴승인 실패`);
        return json.isValid;
    }
}

async function check(userCode, type, value) {
    const response = await fetch("/admin/check", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "code": userCode,
            "type" : type,
            "value": value,
        })
    });
    return !response.ok;
}