"use client";

import "@/styles/viewer.css";
import {useEffect, useRef, useState} from "react";
import { getSeriesList } from "@/utils/patientScanAPI";
import { initViewer, showDicom, clearStack , detachViewer , bindViewer} from "@/utils/dicomViewer";
import {Enums} from "@cornerstonejs/core";

export default function ImagingViewerModal({ isOpen, onClose, item, userId }) {
    const viewerRef = useRef(null);
    const [thumbList, setThumbList] = useState([]);

    useEffect(() => {
        if (!isOpen) {
            // ✅ 닫힐 때 화면만 비우거나(detach) 연결만 끊기
            // 둘 중 하나만 써도 됩니다.
            clearViewer();
            // detachViewer();
            return;
        }

        let canceled = false;

        (async () => {
            // 1) element 확보
            const el = viewerRef.current;
            // const viewportId = viewerRef.current.id;

            if (!el) return;

            // 2) seriesList 가져오기
            const response = await getSeriesList(item.pid, item.studykey, item.serieskey);
            const seriesList = await response.json();
            setThumbList(seriesList);

            console.log("serieslist :: data ------>>", seriesList);

            if (canceled) return;
            if (!Array.isArray(seriesList) || seriesList.length === 0) return;

            // 3) imageIds 생성 (전체 이미지)
            // const imageIds = seriesList.map((s) => {
            //     const fileName = `medical-data\\${s.path}${s.fname}`;
            //     return `wadouri:/api/dicom-file?p=${encodeURIComponent(fileName)}`;
            // });

            const imageIds = seriesList.map((s) => {
                const normalizedPath = (s.path ?? "").replaceAll("\\", "/"); // 핵심
                const fileName = `medical-data/${normalizedPath}${s.fname}`; // 슬래시로 결합
                return `wadouri:/api/dicom-file?p=${encodeURIComponent(fileName)}`;
            });

            console.log(imageIds[0]);

            // 4) ✅ viewer 초기화 (enableElement가 먼저!)
            const { eng, viewportId, viewport } = await initViewer(el);
            if (canceled) return;

            // await bindViewer(el);
            // if (canceled) return;

            // 5) ✅ 레이아웃 반영 1프레임 기다리고 resize
            await new Promise((r) => requestAnimationFrame(r));
            eng.resize(true, true);

            viewport.setStack(imageIds, 0);
            viewport.render();


            //
            // // 6) ✅ 스택 표시 (setStack 후 resetCamera로 "전체 fit")
            // await showDicom(imageIds, 0);

            // viewport.setStack(imageIds, 0).then(() => {
            //     console.log("imageData:", viewport.getImageData());
            // });

            // 7) ✅ 한 번 더 resize + render (모달/스크롤/폰트 로딩 등 레이아웃 변동 대응)
            requestAnimationFrame(() => {
                try {
                    renderingEngine.resize(true, true);
                    viewport.resetCamera();
                    viewport.render();
                } catch {}
            });

            // 8) (옵션) 이제 canvas 로그는 여기서 찍어야 정상
            const canvas = el.querySelector("canvas");
            console.log("el:", el.clientWidth, el.clientHeight);
            console.log("canvas:", canvas?.width, canvas?.height, canvas?.style.width, canvas?.style.height);
            console.log("dpr:", window.devicePixelRatio);

        })().catch((e) => {
            if (!canceled) console.error("viewer init/show error:", e);
        });

        console.log("transform:", getComputedStyle(viewerRef.current).transform);


        // (async () => {
        //     // 1) element 확보 (모달 DOM 생성 후)
        //     const el = viewerRef.current;
        //     if (!el) return;
        //
        //     const canvas = el.querySelector("canvas");
        //     console.log("el:", el.clientWidth, el.clientHeight);
        //     console.log("canvas:", canvas?.width, canvas?.height, canvas?.style.width, canvas?.style.height);
        //     console.log("dpr:", window.devicePixelRatio);
        //
        //     // const el = viewport.element;
        //     // console.log("viewer size", el.clientWidth, el.clientHeight, el.getBoundingClientRect());
        //
        //     // 2) seriesList 가져오기
        //     const response = await getSeriesList(item.pid, item.studykey, item.serieskey);
        //     const seriesList = await response.json();
        //     setThumbList(seriesList);
        //
        //     console.log("serieslist :: data ------>>", seriesList);
        //
        //     if (canceled) return;
        //     if (!Array.isArray(seriesList) || seriesList.length === 0) return;
        //
        //     // 3) imageIds 생성 (여러 장이면 map으로!)
        //     const imageIds = seriesList.map((s) => {
        //         const fileName = `medical-data\\${s.path}${s.fname}`;
        //         return `wadouri:/api/dicom-file?p=${encodeURIComponent(fileName)}`;
        //     });
        //
        //     // 4) viewer 초기화 + 스택 표시
        //     await initViewer(el);
        //     if (canceled) return;
        //
        //     await showDicom(imageIds);
        //
        // })().catch((e) => {
        //     if (!canceled) console.error("viewer init/show error:", e);
        // });

        return () => {
            canceled = true;
            // ✅ 모달 닫힐 때 destroy는 하지 말고 detach/clear만 (간단하고 안정적)
            // detachViewer();
            // clearViewer();
        };
    }, [isOpen, item?.pid, item?.studykey, item?.serieskey]);

    // 모달이 닫혀도 DOM 유지하고 싶으면 return null 대신 display none 추천
    // if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onClose} style={{backgroundColor:"#333"}}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div id="container">
                    <div id="viewerContainer" style={{border:"1px solid red"}}>
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

                        {/* ✅ Cornerstone 붙일 element */}
                        <div ref={viewerRef}
                             id="dicomViewerContainer"
                             className="screen"
                             style={{border:"1px solid red"}}/>

                        {/*{thumbList && thumbList.map(thumb => (*/}
                        {/*     <div key={thumb.serieskey} className="series-card">*/}
                        {/*        <img src={`/dicom-thumb/${thumb.pid}/${thumb.modality}.${thumb.studyinsuid}.png`}*/}
                        {/*        width="100" height="100"/>*/}
                        {/*     </div>*/}
                        {/*))}*/}

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












// "use client";
//
// import "@/styles/viewer.css";
//
// import {useRef} from "react";
// import { ZoomTool, PanTool, StackScrollTool, LengthTool } from "@cornerstonejs/tools";
// import { useEffect, useMemo, useState } from "react";
// import {getSeriesList} from "@/utils/patientScanAPI";
// import { initViewerOnce, showStack, clearStack } from "@/utils/dicomViewer.js";
//
// export default function ImagingViewerModal({ isOpen, onClose, item, userId}) {
//     // if (!isOpen) return null;
//     const viewerRef = useRef(null);
//     const initedRef = useRef(false);
//     // const [seriesList, setSeriesList] = useState([]);
//
//     useEffect(() => {
//         if (!isOpen) {
//             clearStack();
//             return;
//         }
//         let disposed = false;
//         let canceled = false;
//         // let engine = null;
//         // let vpId = null;
//
//         const fetchData = async (pid, studyKey, seriesKey) => {
//             const response = await getSeriesList(pid, studyKey, seriesKey);
//             const data = await response.json();
//             // setSeriesList(data);
//             const seriesList = data;
// console.log("serieslist :: data ------>>", data)
//
//             // // ✅ 1) viewer 준비 (모달 DOM이 만들어진 뒤)
//             // const m = await import("@/utils/dicomViewer");
//             // // const viewportId = await m.initViewer(viewerRef.current);
//
//             const m = await import("@/utils/dicomViewer");
//
//             // ✅ el 선언 (가장 중요)
//             const el = viewerRef.current;
//             if (!el) return;
//
//
//             const { renderingEngine, viewportId } = await m.initViewer(el);
//             // engine = renderingEngine;
//             // vpId = viewportId;
//             const viewport = renderingEngine.getViewport(viewportId); // ✅ 항상 최신 인스턴스
//             viewport.setStack(imageIds);
//
//
//             // ✅ 2) DICOM 위치 (예시)
//             // const imageIds = [
//             //     "wadouri:/api/dicom-file?p=MS0001/MR.1.2.392.200036.9116.4.1.6116.40033.5.3001.1.1152393810.dcm",
//             // ];
//             const fileName = `medical-data\\${seriesList[0].path}${seriesList[0].fname}`;
//             console.log("fileName :: data ------>>", fileName);
//             // console.log("seriesList[0].path--", seriesList[0].path); //202103\10\MS0001\CR\1\
//             const imageIds = [
//                 `wadouri:/api/dicom-file?p=${encodeURIComponent(fileName)}`
//             ];
//
//             // ✅ 3) 닫혔으면 중단
//             // if (disposed) return;
//
//             // ✅ 4) 화면에 표시
//             // await m.showDicom(viewport, imageIds);
//             // const preData = await allRecords(data);
//             // setList(preData);
//             // setTotalCount(preData.length);
//
//             // const el = document.getElementById("dicom-viewer");
//             // if (!el) return;
//
//             initViewerOnce(el);    // ✅ 최초 1번만 enable
//             showStack(imageIds, 0);   // ✅ 스택만 교체
//
//
//
//             // ✅ 5) cleanup: 닫힐 때 반드시 해제 (WebGL 컨텍스트 누수 방지)
//             // return () => {
//             //     // disposed = true;
//             //     canceled = true;
//             //     // destroyViewer(viewportId);
//             //     try {
//             //         // disposed = true;
//             //         // import("@/utils/dicomViewer").then((m) => m.destroyViewer(engine, vpId));
//             //     } catch (e) {
//             //         console.warn("destroyViewer error:", e);
//             //     }
//             // };
//         }
//         fetchData(item.pid, item.studykey, item.serieskey);
//
//
// /*
//         (async () => {
//             try {
//                 // // ✅ 1) viewer 준비 (모달 DOM이 만들어진 뒤)
//                 // const m = await import("@/utils/dicomViewer");
//                 // // const viewportId = await m.initViewer(viewerRef.current);
//
//                 const m = await import("@/utils/dicomViewer");
//
//                 // ✅ el 선언 (가장 중요)
//                 const el = viewerRef.current;
//                 if (!el) return;
//
//
//                 const { renderingEngine, viewportId, viewport } = await m.initViewer(el);
//                 // engine = renderingEngine;
//                 // vpId = viewportId;
//
//
//                 // ✅ 2) DICOM 위치 (예시)
//                 // const imageIds = [
//                 //     "wadouri:/api/dicom-file?p=MS0001/MR.1.2.392.200036.9116.4.1.6116.40033.5.3001.1.1152393810.dcm",
//                 // ];
//                 // const fileName = `${seriesList[0].path}${item.modality}.${seriesList[0].fname}`;
// console.log("serieslist :: data ------>>", seriesList)
// console.log("seriesList[0].path--", seriesList[0].path);
//                 const imageIds = [
//                     `wadouri:/api/dicom-file?p=${encodeURIComponent(fileName)}`
//                 ];
//
//                 // ✅ 3) 닫혔으면 중단
//                 if (disposed) return;
//
//                 // ✅ 4) 화면에 표시
//                 // await m.showDicom(viewport, imageIds);
//             } catch (e) {
//                 if (!disposed) console.error("viewer init/show error:", e);
//             }
//         })();
//
//         // ✅ 5) cleanup: 닫힐 때 반드시 해제 (WebGL 컨텍스트 누수 방지)
//         return () => {
//             disposed = true;
//             try {
//                 // disposed = true;
//                 // import("@/utils/dicomViewer").then((m) => m.destroyViewer(engine, vpId));
//             } catch (e) {
//                 console.warn("destroyViewer error:", e);
//             }
//         };*/
//     }, [isOpen]);
//
//     // useEffect(() => {
//     //     if (!isOpen) return;
//     //     let disposed = false;
//     //
//     //     let mounted = true;
//     //     (async () => {
//     //         if (!open) return;
//     //
//     //         // 1️⃣ viewer 준비
//     //         const viewportId = await initViewer(viewerRef.current);
//     //
//     //         // 2️⃣ DICOM 위치 (예시)
//     //         const imageIds = [
//     //             // "wadors:/dicom-web/studies/STUDY_UID/series/SERIES_UID/instances/INSTANCE_UID/frames/1",
//     //             "wadouri:/api/dicom-file?p=MS0001/MR.1.2.392.200036.9116.4.1.6116.40033.5.3001.1.1152393810.dcm",
//     //             // "wadouri:/api/dicom-file?p=study1/0002.dcm",
//     //             // "wadouri:/api/dicom-file?p=study1/0003.dcm",
//     //         ];
//     //
//     //         // 3️⃣ 화면에 표시
//     //         await showDicom(imageIds);
//     //     })();
//     //     }, [isOpen]);
//
//         console.log("isOpen:", isOpen, item, userId);
//         return (
//             <div className="modal-backdrop" onClick={onClose}>
//                 <div className="modal-content">
//                     <div id="container">
//                         <div id="viewerContainer">
//                             <div id="toolBar">
//                                 {/*<button className="tool" onClick={() => setActiveTool(ZoomTool.toolName)}>Zoom</button>*/}
//                                 {/*<button className="tool" onClick={() => setActiveTool(PanTool.toolName)}>Pan</button>*/}
//                                 {/*<button className="tool"*/}
//                                 {/*        onClick={() => setActiveTool(StackScrollTool.toolName)}>Scroll*/}
//                                 {/*</button>*/}
//                                 {/*<button className="tool" onClick={() => setActiveTool(LengthTool.toolName)}>Length*/}
//                                 {/*</button>*/}
//                                 {/*<button id="zoom" className="tool">Zoom</button>*/}
//                                 {/*<button id="pan" className="tool">Pan</button>*/}
//                                 {/*<button id="annotation" className="tool">Annotation</button>*/}
//                                 {/*<button id="length" className="tool">Length</button>*/}
//                                 {/*<button id="circle" className="tool">Circle</button>*/}
//                                 {/*<button id="rectangle" className="tool">Rectangle</button>*/}
//                                 {/*<button id="label" className="tool">Label</button>*/}
//                                 {/*<button id="windowLevel" className="tool">Window/Level</button>*/}
//                                 {/*<button id="reset" className="tool">Reset</button>*/}
//                                 <button id="zoom" className="viewer-tool" title="Zoom" >
//                                     <i className="fa-solid fa-magnifying-glass"></i>
//                                 </button>
//
//                                 <button id="pen" className="viewer-tool" title="Pen" >
//                                     <i className="fa-solid fa-pen"></i>
//                                 </button>
//
//                                 <button id="length" className="viewer-tool" title="Length">
//                                     <i className="fa-solid fa-ruler"></i>
//                                 </button>
//
//                                 <button id="circle" className="viewer-tool" title="Circle ROI">
//                                     <i className="fa-regular fa-circle"></i>
//                                 </button>
//
//                                 <button id="rectangle" className="viewer-tool" title="Rectangle ROI">
//                                     <i className="fa-regular fa-square"></i>
//                                 </button>
//
//                                 <button id="label" className="viewer-tool" title="Label">
//                                     <i className="fa-solid fa-tag"></i>
//                                 </button>
//
//                                 <button id="windowLevel" className="viewer-tool" title="Window / Level">
//                                     <i className="fa-solid fa-sun"></i>
//                                 </button>
//
//                                 <button id="reset" className="viewer-tool" title="Reset">
//                                     <i className="fa-solid fa-rotate-left"></i>
//                                 </button>
//
//                             </div>
//
//                             {/*<div id="dicomViewerContainer" className="screen"></div>*/}
//                             {/*<script src="${pageContext.request.contextPath}/dist/bundle.js"></script>*/}
//                             {/* ✅ Cornerstone이 붙을 컨테이너 */}
//                             <div ref={viewerRef} id="dicomViewerContainer" className="screen" />
//                             {/*    {seriesList && seriesList.map(series => (*/}
//                             {/*        <div key={seriesList.serieskey} className="series-card">*/}
//                             {/*            <img src={`/dicom-thumb/${item.pid}/${item.modality}.${item.studyinsuid}.png`}*/}
//                             {/*                width="100" height="100"/>*/}
//                             {/*        </div>*/}
//                             {/*    ))}*/}
//                              {/*</div>*/}
//
//                         </div>
//                     <div id="info">
//                             <div className="info-container">
//                                 <h3 className="title">환자 정보</h3>
//                                 {/*<div style={{textAlign:"left", "marginLeft":"10px"}}>*/}
//                                 <p> ID : <span id="patientId">{item.pid}</span></p>
//                                 <p> 이름 : <span id="patientName">{item.pname}</span></p>
//                                 <p> 성별 : <span id="patientSex">{item.psex}</span></p>
//                                 <p> 생년월일 : <span id="patientBirth">{item.pbirthdate}</span></p>
//                                 {/*</div>*/}
//                             </div>
//
//                             <div className="info-container">
//                                 <h3>Study 정보</h3>
//                                 <p><strong> 검사명 : </strong> <span id="studyDesc">{item.studydesc}</span></p>
//                                 <p><strong> 모달리티(검사 장비):</strong> <span id="modality">{item.modality}</span></p>
//                                 <p><strong> 검사 부위:</strong> <span id="bodyPart">{item.bodypart}</span></p>
//                                 <p><strong> 접수번호:</strong> <span id="accessNum">{item.accessnum}</span></p>
//                                 <p><strong> 검사 날짜:</strong> <span id="studyDate">{item.studydate}</span></p>
//                                 <p><strong> 시리즈 개수:</strong> <span id="seriesCnt">{item.seriescnt}</span></p>
//                             </div>
//
//                             <div className="info-container">
//                                 <h3>Series 정보</h3>
//                                 <p><strong> 시리즈명:</strong> <span id="seriesDesc">{item.seriesdesc}</span></p>
//                                 <p><strong> 모달리티:</strong> <span id="seriesModality">{item.modality}</span></p>
//                                 <p><strong> 시리즈 날짜:</strong> <span id="seriesDate">{item.seriesdate}</span></p>
//                                 <p><strong> 이미지 개수:</strong> <span id="imageCnt">{item.imagecnt}</span></p>
//                                 <p><strong> 시리즈 번호:</strong> <span id="seriesNum">{item.seriesnum}</span></p>
//                             </div>
//
//                             <div className="info-container">
//                                 <h3>판독 결과</h3>
//                                 <p>판독 의사 : <span id="userCode">{userId}</span></p>
//                                 <p>승인 의사 : <span id="approveUserCode">1000</span></p>
//                                 <p>판독 승인 날짜 : <span id="approveStudyDate">20250305</span></p>
//
//                                 <p><strong>중증도 레벨:</strong></p>
//                                 <select id="severityLevel">
//                                     <option value="1">1 - Critical (위급)</option>
//                                     <option value="2">2 - Urgent (긴급)</option>
//                                     <option value="3">3 - High (높음)</option>
//                                     <option value="4">4 - Moderate (보통)</option>
//                                     <option value="5">5 - Low (낮음)</option>
//                                 </select>
//
//                                 <p><strong>보고서 상태:</strong></p>
//                                 <select id="reportStatus">
//                                     <option value="Draft">Draft</option>
//                                     <option value="Finalized">Finalized</option>
//                                     <option value="Needs Revision">Needs Revision</option>
//                                 </select>
//
//
//                                 <p><strong>판독 내용:</strong></p>
//                                 <textarea id="reportText" rows="4"></textarea>
//
//                                 <div className="button-group">
//                                     <button id="saveReportBtn">저장</button>
//                                     <button id="editReportBtn">판독 목록</button>
//                                 </div>
//                             </div>
// //                         </div>
//                     </div>
//                 </div>
//             </div>
//         )
// };
