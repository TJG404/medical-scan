
export const postLogin = async(formData) => {
   const response = await fetch("/api/auth/login", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(formData),
           });
    return response;
}

export const postLogout = async() => {
    const response = await fetch("/api/auth/logout", {method: "POST" });
    return response;
}


export const postSignup = async(formData) => {
    const response = await fetch("/api/users/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
    return response;
}

export const postIdVerify = async(id) => {
    console.log("id ::", id);
    const response = await fetch("/api/users/check-id",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(id),
        });
    return response;
}
