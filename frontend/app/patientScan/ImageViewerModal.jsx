"use client";

import { useEffect, useMemo, useState } from "react";

export default function ImagingViewerModal({ open, onClose, initialData }) {
    // 모달 열릴 때 초기화
    useEffect(() => {
        if (!open) return;
        setPatient(initialData ?? null);
        setAutoSaveStatus("");
        setReportText("");
        setSeverityLevel("3");
        setReportStatus("Draft");
    }, [open, initialData]);




  return (
      <div id="container" className="modal-backdrop">
          <div id="viewerContainer" className="modal">
              <div id="toolBar" className="modal-header">
                  <button id="zoom" className="tool">Zoom</button>
                  <button id="pan" className="tool">Pan</button>
                  <button id="annotation" className="tool">Annotation</button>
                  <button id="length" className="tool">Length</button>
                  <button id="circle" className="tool">Circle</button>
                  <button id="rectangle" className="tool">Rectangle</button>
                  <button id="label" className="tool">Label</button>
                  <button id="windowLevel" className="tool">Window/Level</button>
                  <button id="reset" className="tool">Reset</button>
              </div>

              <div id="dicomViewerContainer" className="screen"></div>
              {/*<script src="${pageContext.request.contextPath}/dist/bundle.js"></script>*/}
          </div>

          <div id="info" >
              <div className="info-container">
                  <h3 className="title">환자 정보</h3>
                  <p> ID : <span id="patientId">-</span></p>
                  <p> 이름 : <span id="patientName">-</span></p>
                  <p> 성별 : <span id="patientSex">-</span></p>
                  <p> 생년월일 : <span id="patientBirth">-</span></p>
              </div>

              <div className="info-container">
                  <h3>Study 정보</h3>
                  <p><strong> 검사명 : </strong> <span id="studyDesc">-</span></p>
                  <p><strong> 모달리티(검사 장비):</strong> <span id="modality">-</span></p>
                  <p><strong> 검사 부위:</strong> <span id="bodyPart">-</span></p>
                  <p><strong> 접수번호:</strong> <span id="accessNum">-</span></p>
                  <p><strong> 검사 날짜:</strong> <span id="studyDate">-</span></p>
                  <p><strong> 시리즈 개수:</strong> <span id="seriesCnt">-</span></p>
              </div>

              <div className="info-container">
                  <h3>Series 정보</h3>
                  <p><strong> 시리즈명:</strong> <span id="seriesDesc">-</span></p>
                  <p><strong> 모달리티:</strong> <span id="seriesModality">-</span></p>
                  <p><strong> 시리즈 날짜:</strong> <span id="seriesDate">-</span></p>
                  <p><strong> 이미지 개수:</strong> <span id="imageCnt">-</span></p>
                  <p><strong> 시리즈 번호:</strong> <span id="seriesNum">-</span></p>
              </div>

              <div className="info-container">
                  <h3>판독 결과</h3>
                  <p>판독 의사 : <span id="userCode">-</span></p>
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

              <p id="autoSaveStatus"></p>
          </div>
      </div>
  )
};
