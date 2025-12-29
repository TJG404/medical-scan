"use client";

import {useEffect, useState, useMemo, Fragment} from "react";
import {getList, getReport} from "@/utils/patientScanAPI.js";
import ImagingViewerModal from "@/app/patientScan/ImageViewerModal.jsx";
import {useAuthStore} from "@/store/authStore.js";
import 'rc-pagination/assets/index.css';
import Pagination from "rc-pagination";

export default function ListAll() {
    const userId = useAuthStore(s => s.userId);
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(12);
    const [expandedRow, setExpandedRow] = useState({index:null, pid:null});
    const [report, setReport] = useState({});
    const [open, setOpen] = useState(false);
    const [selected, setSelected ] = useState(null);

    /** 최초 데이터 셋 전처리 **/
    const allRecords = async (data) => {
        let allStudies = [];
        console.log(data);
        data.forEach(patientData => {
            var patient = patientData.patient;
            var studyDetails = patientData.studyDetails || [];
            studyDetails.forEach(study => {
                var seriesList = study.series || [];
                seriesList.forEach(series => {
                    allStudies.push({
                        pid: patient.pid,
                        pname: patient.pname,
                        psex: patient.psex,
                        pbirthdate: patient.pbirthdate,
                        modality: series.modality || "N/A",
                        studyinsuid: study.studyinsuid || series.studyinsuid,
                        studydesc: study.study.studydesc || "N/A",
                        studydate: study.study.studydate || "N/A",
                        studykey: study.study.studykey || study.studykey,
                        serieskey: series.serieskey || series.serieskey,
                        accessnum: study.study.accessnum || "N/A",
                        imagecnt: series.imagecnt || 0,
                        bodypart: series.bodypart || "N/A",
                        seriesdesc: series.seriesdesc || "N/A",
                        seriesmodality:series.modality || "N/A",
                        seriesdate: series.seriesdate || "N/A",
                        seriesnum: series.seriesnum || "N/A",
                        seriescnt: study.seriescnt || 0,
                    });

                });
            });
        });
        console.log("Data pre-processing :", allStudies);
        return allStudies;
    }

    const toggleRow = async(index, pid) => {
        setExpandedRow(prev =>
            prev && prev.pid === pid && prev.index === index
                ? null
                : { pid, index }
        );
        //판독 데이터 불러오기
        const response = await getReport(pid);
        const {result} = await response.json();
        setReport(result);
    };

    const viewList = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = currentPage * pageSize;
        return list.slice(start, end);
    }, [list, currentPage, pageSize]);

    /** 의료 목록 가져오기 **/
    useEffect(() => {
        const fetchData = async () => {
            const response = await getList();
            const data = await response.json();
            const preData = await allRecords(data);
            setList(preData);
            setTotalCount(preData.length);
        }
        fetchData();
    }, []);

    /** viewer 모달창 토글 **/
    useEffect(() => {
        if (selected) { setOpen(true);  }
    }, [selected]);

    /** viewer 버튼 클릭 이벤트 **/
    const handleOpenViewer = (item, index) => {  setSelected(item);  }

    return (
        <>
            <div className="search-bar">
                <input type="text" id="searchPname" placeholder="Patient Name"/>
                <input type="text" id="searchPid" placeholder="MRN"/>

                <div className="date-range">
                    <label>Study Date:</label>
                    <input type="date" id="searchStartDate" placeholder="Start Date"/>
                    <input type="date" id="searchEndDate" placeholder="End Date"/>
                </div>

                <input type="text" id="searchDescription" placeholder="Description"/>

                <select id="searchModality">
                    <option value="">All Modalities</option>
                    <option value="CR">CR (Computed Radiography)</option>
                    <option value="CT">CT (Computed Tomography)</option>
                    <option value="DX">DX (Digital Radiography)</option>
                    <option value="MG">MG (Mammography)</option>
                    <option value="MR">MR (Magnetic Resonance Imaging)</option>
                    <option value="NM">NM (Nuclear Medicine)</option>
                    <option value="OT">OT (Other)</option>
                    <option value="PT">PT (Positron Emission Tomography)</option>
                    <option value="US">US (Ultrasound)</option>
                    <option value="XA">XA (X-ray Angiography)</option>
                    <option value="RF">RF (Radio Fluoroscopy)</option>
                </select>

                <input type="text" id="searchAccession" placeholder="Accession #"/>

                {/*<button id="btn-search" onClick="searchPatient()">🔍 Search</button>*/}
                <button id="btn-search" >🔍 Search</button>
            </div>

            <table className="search-results">
                <thead>
                <tr>
                    <th>목록</th>
                    <th>Patient Name ⬍</th>
                    <th>MRN ⬍</th>
                    <th>Study Date ⬍</th>
                    <th style={{width:"30%"}}>Description ⬍</th>
                    <th >Modality ⬍</th>
                    <th >Accession # ⬍</th>
                    <th>Images ⬍</th>
                    <th >Viewer</th>
                </tr>
                </thead>
                <tbody>
                {viewList && viewList.map((item, index) =>
                    <Fragment key={`${item.pid}-${item.studykey}-${item.serieskey}`}>
                    <tr>
                        <td>
                            <button id={`expand-btn-${index}`} className="expand-btn" style={{width:"100px"}}
                                onClick={() => { toggleRow(index, item.pid); }}    >▶
                            </button>
                        </td>
                        <td>{item.pname}</td>
                        <td>{item.pid}</td>
                        <td>{item.studydate}</td>
                        <td>{item.studydesc}</td>
                        <td>{item.modality}</td>
                        <td>{item.accessnum || "N/A"}</td>
                        <td>{item.imagecnt}</td>
                        <td>
                            <button className="btn-analysis" style={{width:"100px"}}
                                    onClick={()=>{handleOpenViewer(item, index)}}>
                                Viewer
                            </button>
                        </td>
                    </tr>
                    {expandedRow &&
                        expandedRow.index === index &&
                        expandedRow.pid === item.pid && (
                        report ?
                        <tr>
                            <td colSpan="9" style={{backgroundColor:"#333"}}>
                                <div className={`details-content ${report.severity_level}`}>
                                    <p><strong>중증도 레벨:</strong> {report.severity_level}</p>
                                    <p><strong>보고서 상태:</strong> {report.report_status || "없음"}</p>
                                    <p><strong>판독 내용:</strong> 내용 없음</p>
                                    <button className={`btn-report ${report.severity_level}`}>
                                        판독 상세목록
                                    </button>
                                </div>
                            </td>
                        </tr> : <tr><td colSpan="9" style={{backgroundColor:"#333"}}>판독 데이터 없음</td></tr>
                        )}
                    </Fragment>
                )}

                <tr>
                    <td colSpan={9}>
                        <div className="patients-pagination">
                            <Pagination
                                current={currentPage}
                                total={totalCount}
                                pageSize={pageSize}
                                onChange={(page) => setCurrentPage(page)}
                                showTitle={false}
                            />
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
            <div id="pagination"></div>

            {open && (
                // <ImagingViewerModal
                //     open={open}
                //     onClose={() => setOpen(false)}
                //     initialData={selected}
                // />

                <ImagingViewerModal
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    item={selected}
                    userId={userId}
                />
            )}
        </>
    )


}