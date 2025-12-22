"use client";

import {useEffect, useState, useMemo, Fragment} from "react";
import {getList, getReport} from "@/utils/patientScanAPI.js";
import ImagingViewerModal from "@/app/patientScan/ImageViewerModal.jsx";
import 'rc-pagination/assets/index.css';
import Pagination from "rc-pagination";

export default function ListAll() {
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [expandedRow, setExpandedRow] = useState({index:null, pid:null});
    const [report, setReport] = useState({});
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null); // 모달에 넘길 데이터

    /** 최초 데이터 셋 전처리 **/
    const allRecords = async (data) => {
        let allStudies = [];
        console.log("Data pre-processing :", data);
        data.forEach(patientData => {
            var patient = patientData.patient;
            var studyDetails = patientData.studyDetails || [];

            studyDetails.forEach(study => {
                var seriesList = study.series || [];
                seriesList.forEach(series => {
                    allStudies.push({
                        pname: patient.pname,
                        pid: patient.pid,
                        modality: series.modality || "N/A",
                        studydesc: study.study.studydesc || "N/A",
                        studydate: study.study.studydate || "N/A",
                        studykey: study.study.studykey || study.studykey,
                        serieskey: series.serieskey || series.serieskey,
                        accessnum: study.study.accessnum || "N/A",
                        imagecnt: series.imagecnt || 0
                    });
                });
            });
        });
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

    /** Viewer **/
    const handleOpenViewer = (item, index) => {

        console.log(item, index);
        //
        // accessnum
        //     :
        //     "2101150067"
        // imagecnt
        //     :
        //     1
        // modality
        //     :
        //     "CR"
        // pid
        //     :
        //     "MS0001"
        // pname
        //     :
        //     "Anonymous"
        // serieskey
        //     :
        //     1
        // studydate
        //     :
        //     "20210310"
        // studydesc
        //     :
        //     "Chest PA"
        // studykey
        //     :
        //     1
        //
        // setSelected({
        //     rowKey: `${item.pid}-${index}`,
        //     pid: item.pid,
        //     pname: item.pname,
        //     psex: item.psex,
        //     pbirthdate: item.pbirthdate,
        //     studyDesc: item.studydesc,
        //     modality: item.modality,
        //     bodyPart: item.bodypart,
        //     accessNum: item.accessnum,
        //     studyDate: item.studydate,
        //     seriesCnt: item.seriescnt,
        //     imageCnt: item.imagecnt,
        //     // 아래는 있으면 넣고, 없으면 null
        //     studyKey: item.studykey ?? null,
        //     seriesKey: item.serieskey ?? null,
        //     seriesDesc: item.seriesdesc ?? null,
        //     seriesModality: item.seriesmodality ?? null,
        //     seriesDate: item.seriesdate ?? null,
        //     seriesNum: item.seriesnum ?? null,
        // });

        setOpen(true);
    }



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
                    <th>Description ⬍</th>
                    <th>Modality ⬍</th>
                    <th>Accession # ⬍</th>
                    <th>Images ⬍</th>
                    <th>Viewer</th>
                </tr>
                </thead>
                <tbody>
                {viewList && viewList.map((item, index) =>
                    <Fragment key={`${item.pid}-${item.studykey}-${item.serieskey}`}>
                    <tr>
                        <td>
                            <button id={`expand-btn-${index}`} className="expand-btn"
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
                            <button className="btn-analysis"
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
                            <td colSpan="9">
                                <div className={`details-content ${report.severity_level}`}>
                                    <p><strong>중증도 레벨:</strong> {report.severity_level}</p>
                                    <p><strong>보고서 상태:</strong> {report.report_status || "없음"}</p>
                                    <p><strong>판독 내용:</strong> 내용 없음</p>
                                    <button className={`btn-report ${report.severity_level}`}>
                                        판독 상세목록
                                    </button>
                                </div>
                            </td>
                        </tr> : <tr><td colSpan="9">판독 데이터 없음</td></tr>
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
                <ImagingViewerModal
                    open={open}
                    onClose={() => setOpen(false)}
                    initialData={selected}
                />
            )}
        </>
    )


}