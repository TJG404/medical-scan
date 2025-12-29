//
// export const getPatients = async() => {
//     const response = await fetch("http://localhost:8080/patients/all", {method: "GET" });
// console.log(response, "---------------------->> getPatients");
//     return response;
// }

export const getPatients = async(pages) => {
   const response = await fetch("http://172.16.250.23:8080/patients/all", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(pages),
           });
    return response;
}

