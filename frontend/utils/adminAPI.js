/**
 * 회원 정보
 */
export const postMembers = async() => {
    const response = await fetch("/api/admin/members", {
        method: "GET",
    });
    return response;
}