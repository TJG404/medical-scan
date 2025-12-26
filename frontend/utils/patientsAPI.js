//
// export const getPatients = async() => {
//     const response = await fetch("http://localhost:8080/patients/all", {method: "GET" });
// console.log(response, "---------------------->> getPatients");
//     return response;
// }

export const getPatients = async(pages) => {
    // console.log(pages, "-----pages");
   const response = await fetch("http://172.16.250.23:8080/patients/all", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(pages),
           });
    return response;
}


// export const postLogin = async(formData) => {
//    const response = await fetch("/api/auth/login", {
//                method: "POST",
//                headers: { "Content-Type": "application/json" },
//                body: JSON.stringify(formData),
//            });
//     return response;
// }

// export const postLogout = async() => {
//     const response = await fetch("/api/auth/logout", {method: "GET" });
//     return response;
// }
//
//
// export const postSignup = async(formData) => {
//     const response = await fetch("/api/users/signup", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(formData),
//         });
//     return response;
// }
//
// export const postIdVerify = async(id) => {
//     console.log("id ::", id);
//     const response = await fetch("/api/users/check-id",{
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(id),
//         });
//     return response;
// }
