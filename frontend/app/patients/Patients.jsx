"use client";

import { useState, useEffect } from "react";
import { getPatients } from "@/utils/patientsAPI.js";

import Pagination from 'rc-pagination';
// import 'bootstrap/dist/css/bootstrap.css';
import 'rc-pagination/assets/index.css';

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getPatients({currentPage, pageSize});
            const data = await response.json();
            console.log(data);
            setPatients(data.content);
            setTotalCount(data.totalElements);
        }
        fetchData();
    }, [currentPage, pageSize]);

    return (
        <div id="patient-content-container">
            <h2 id="title-name">환자 목록</h2>
            <table className="patient-table">
                <thead>
                <tr>
                    <th style={{ width: "10%" }}>환자 ID</th>
                    <th style={{ width: "15%" }}>이름</th>
                    <th style={{ width: "5%" }}>성별</th>
                    <th style={{ width: "10%" }}>생년월일</th>
                    <th>진료기록</th>
                    {/* 진료 보기 버튼 클릭 */}
                    <th>판독기록</th>
                </tr>
                </thead>
                <tbody>
                {patients && patients.map((patient) =>
                    <tr key={patient?.pid}>
                        <td>{patient?.pid}</td>
                        <td>{patient?.pname}</td>
                        <td>{patient?.psex}</td>
                        <td>{patient?.pbirthdate}</td>
                        <td>
                            <button className="clinic-btn" data-pid={patient?.pid}>진료보기
                            </button>
                        </td>
                        <td>
                            <button className="report-btn" data-pid={patient?.pid}>판독보기
                            </button>
                        </td>
                    </tr>
                )}

                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={6}>
                        <div className="patients-pagination">
                            <Pagination
                                // className="d-flex justify-content-center"
                                current={currentPage}
                                total={totalCount}
                                pageSize={pageSize}
                                onChange={(page) => setCurrentPage(page)}
                                showTitle={false}
                            />
                        </div>
                        {/* 페이징 처리 출력 컴포넌트 */}
                        {/*<Pagination*/}
                        {/*    className="d-flex justify-content-center"*/}
                        {/*    current = {currentPage}*/}
                        {/*    total = {totalCount}*/}
                        {/*    pageSize = {pageSize}*/}
                        {/*    onChange = {(page) => setCurrentPage(page) }/>*/}
                    </td>
                </tr>
                </tfoot>
            </table>

            {/*<div className="pagination">*/}
            {/*    /!*<c:forEach begin="1" end="${totalPages}" var="pageNum">*!/*/}
            {/*    {pages && pages.map((page) =>*/}
            {/*        <button className="pagination-btn active" data-page="1" key={page}>*/}
            {/*            {page}*/}
            {/*        </button>*/}
            {/*    )}*/}
            {/*    /!*</c:forEach>*!/*/}
            {/*</div>*/}
        </div>
    )
}