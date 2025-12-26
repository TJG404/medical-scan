"use client";

import "@/styles/viewer.css";
import {useEffect, useMemo, useRef, useState} from "react";
import { getSeriesList } from "@/utils/patientScanAPI";
import DicomViewer from "@/components/DicomViewer.jsx";
import ThumbList from "@/app/patientScan/ThumbList.jsx";

export default function ImagingViewerModal({ isOpen, onClose, item, userId }) {
    const viewerRef = useRef(null);
    const [thumbList, setThumbList] = useState([]);
    const [seriesList, setSeriesList] = useState([]);
    const [imageIds, setImageIds] = useState([]);
    const [fname, setFname] = useState("");
    const [selected, setSelected] = useState(null); // { path, fname }

    useEffect(() => {
        if (!isOpen) {
            clearViewer();
            return;
        }

        let canceled = false;

        (async () => {
            const response = await getSeriesList(item.pid, item.studykey, item.serieskey);
            const seriesList = await response.json();

            if (canceled) return;
            if (!Array.isArray(seriesList) || seriesList.length === 0) return;

            // dicom-image 생성
            const imageIds = seriesList.map((s) => {
                const fileName = `medical-data\\${s.path}${s.fname}`;
                return `wadouri:/api/dicom-file?p=${encodeURIComponent(fileName)}`;
            });
            setImageIds(imageIds);

            const newThumbList = seriesList.map(file => ({
                ...file,
                fname: file.fname.replace(/\.[^/.]+$/, ".png")
            }));
            setThumbList(newThumbList);
            setSeriesList(seriesList);           // (지금 선언은 해놓고 set 안 하고 있음)
            setSelected(seriesList[0]);          // ✅ 첫 이미지 자동 선택
        })().catch((e) => {
            if (!canceled) console.error("viewer init/show error:", e);
        });

        return () => {
            canceled = true;
        };
    }, [isOpen, item?.pid, item?.studykey, item?.serieskey]);

    const imageId = useMemo(() => {
        if (!selected?.path || !selected?.fname) return null;
        console.log("imageId  ::: fname ==> ", selected.path, selected.fname);
        const fileName = `medical-data\\${selected.path}${selected.fname}`;
        return `wadouri:/api/dicom-file?p=${encodeURIComponent(fileName)}`;
    }, [selected?.path, selected?.fname]);


    const handleImageIdChange = (path, fname) => {
        console.log("modal  ::: fname ==> ", path, fname);
        setSelected({ path: path, fname: fname.replace(/\.[^/.]+$/, ".dcm") });
    }


    return (
        <div className="modal-backdrop" onClick={onClose} style={{backgroundColor:"#333"}}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div id="container">
                    <div id="viewerContainer" >
                        <div id="toolBar">
                            {/* toolbar 버튼들 그대로 */}
                            <button id="zoom" className="viewer-tool" title="Zoom">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                            <button id="pen" className="viewer-tool" title="Pen">
                                <i className="fa-solid fa-pen"></i>
                            </button>
                            <button id="length" className="viewer-tool" title="Length">
                                <i className="fa-solid fa-ruler"></i>
                            </button>
                            <button id="circle" className="viewer-tool" title="Circle ROI">
                                <i className="fa-regular fa-circle"></i>
                            </button>
                            <button id="rectangle" className="viewer-tool" title="Rectangle ROI">
                                <i className="fa-regular fa-square"></i>
                            </button>
                            <button id="label" className="viewer-tool" title="Label">
                                <i className="fa-solid fa-tag"></i>
                            </button>
                            <button id="windowLevel" className="viewer-tool" title="Window / Level">
                                <i className="fa-solid fa-sun"></i>
                            </button>
                            <button id="reset" className="viewer-tool" title="Reset">
                                <i className="fa-solid fa-rotate-left"></i>
                            </button>
                        </div>

                        {/* dicom-image 출력 컴포넌트 */}
                        <DicomViewer imageId = {imageId} />

                        {/* Thumb list 출력 컴포넌트    */}
                        <ThumbList list={thumbList}
                                   total={thumbList.length}
                                   click={handleImageIdChange}/>
                    </div>

                    {/* 오른쪽 info 그대로 */}
                    <div id="info">
                        {/* ...생략 (기존 코드 유지) ... */}
                        <div className="info-container">
                            <h3 className="title">환자 정보</h3>
                            <p>ID : <span id="patientId">{item.pid}</span></p>
                            <p>이름 : <span id="patientName">{item.pname}</span></p>
                            <p>성별 : <span id="patientSex">{item.psex}</span></p>
                            <p>생년월일 : <span id="patientBirth">{item.pbirthdate}</span></p>
                        </div>

                        <div className="info-container">
                            <h3>Study 정보</h3>
                            <p><strong> 검사명 : </strong> <span id="studyDesc">{item.studydesc}</span></p>
                            <p><strong> 모달리티(검사 장비):</strong> <span id="modality">{item.modality}</span></p>
                            <p><strong> 검사 부위:</strong> <span id="bodyPart">{item.bodypart}</span></p>
                            <p><strong> 접수번호:</strong> <span id="accessNum">{item.accessnum}</span></p>
                            <p><strong> 검사 날짜:</strong> <span id="studyDate">{item.studydate}</span></p>
                            <p><strong> 시리즈 개수:</strong> <span id="seriesCnt">{item.seriescnt}</span></p>
                        </div>

                        <div className="info-container">
                            <h3>Series 정보</h3>
                            <p><strong> 시리즈명:</strong> <span id="seriesDesc">{item.seriesdesc}</span></p>
                            <p><strong> 모달리티:</strong> <span id="seriesModality">{item.modality}</span></p>
                            <p><strong> 시리즈 날짜:</strong> <span id="seriesDate">{item.seriesdate}</span></p>
                            <p><strong> 이미지 개수:</strong> <span id="imageCnt">{item.imagecnt}</span></p>
                            <p><strong> 시리즈 번호:</strong> <span id="seriesNum">{item.seriesnum}</span></p>
                        </div>

                        <div className="info-container">
                            <h3>판독 결과</h3>
                            <p>판독 의사 : <span id="userCode">{userId}</span></p>
                            <p>승인 의사 : <span id="approveUserCode">1000</span></p>
                            <p>판독 승인 날짜 : <span id="approveStudyDate">20250305</span></p>

                            <p><strong>중증도 레벨:</strong></p>
                            <select id="severityLevel">
                                <option value="1">1 - Critical (위급)</option>
                                <option value="2">2 - Urgent (긴급)</option>
                                <option value="3">3 - High (높음)</option>
                                <option value="4">4 - Moderate (보통)</option>
                                <option value="5">5 - Low (낮음)</option>
                            </select>

                            <p><strong>보고서 상태:</strong></p>
                            <select id="reportStatus">
                                <option value="Draft">Draft</option>
                                <option value="Finalized">Finalized</option>
                                <option value="Needs Revision">Needs Revision</option>
                            </select>

                            <p><strong>판독 내용:</strong></p>
                            <textarea id="reportText" rows="4"></textarea>

                            <div className="button-group">
                                <button id="saveReportBtn">저장</button>
                                <button id="editReportBtn">판독 목록</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

