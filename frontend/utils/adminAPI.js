/**
 * 회원 정보 조회
 */
export const postMembers = async() => {
    let response = await fetch("/api/admin/members", {
        method: "POST",
    });

    // access 토큰 만료 등으로 401 응답
    if (response.status === 401) {

        // 1) refresh 토큰으로 새 access 발급 요청
        const refreshRes = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include", // refresh 쿠키도 같이 전송
        });

        // refresh도 실패하면(로그인 필요)
        if (!refreshRes.ok) {
            console.log("❌ refresh 실패", refreshRes.status);
            // 여기서 로그아웃 처리나 로그인 페이지 이동 등을 해도 됨
            throw new Error("인증이 만료되었습니다. 다시 로그인 해주세요.");
        }


        // 2) 새 access 토큰이 쿠키로 세팅된 상태에서 다시 원래 요청
        response = await fetch("/api/admin/members", {
            method: "POST",
            credentials: "include",
        });
    }

    // 여기까지 오면 200 or 403 등 실제 응답
    if (!response.ok) {
        // 필요하면 상태에 따라 에러 메시지 다르게 처리 가능
        throw new Error(`요청 실패: status = ${response.status}`);
    }

    return response;
}

/**
 * 회원 정보 수정
 */
export const putMembers = async(member) => {
    let response = await fetch("/api/admin/members", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(member),
    });

    // access 토큰 만료 등으로 401 응답
    if (response.status === 401) {
        console.log("🎯 401 발생 -----------→ refresh 시도");

        // 1) refresh 토큰으로 새 access 발급 요청
        const refreshRes = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include", // refresh 쿠키도 같이 전송
        });

        // refresh도 실패하면(로그인 필요)
        if (!refreshRes.ok) {
            console.log("❌ refresh 실패", refreshRes.status);
            // 여기서 로그아웃 처리나 로그인 페이지 이동 등을 해도 됨
            throw new Error("인증이 만료되었습니다. 다시 로그인 해주세요.");
        }

        console.log("⭕ refresh 성공 → access 재발급 완료, 원래 요청 재시도");

        // 2) 새 access 토큰이 쿠키로 세팅된 상태에서 다시 원래 요청
        response = await fetch("/api/admin/members", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(member),
        });
    }

    // 여기까지 오면 200 or 403 등 실제 응답
    if (!response.ok) {
        // 필요하면 상태에 따라 에러 메시지 다르게 처리 가능
        throw new Error(`요청 실패: status = ${response.status}`);
    }

    return response;
}