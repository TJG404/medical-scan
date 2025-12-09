import {Enums} from "@cornerstonejs/core";

export function initRendering(state) {
    loadStudyAndSeriesInfo(state);
}

async function loadStudyAndSeriesInfo(state) {
    const urlParts = window.location.pathname.split("/");
    const studykey = urlParts[4];
    const serieskey = urlParts[5];

    document.addEventListener('DOMContentLoaded', async () => {

        state.currentViewport = {id : 'dicomViewerContainer' };
        await assignImageToViewport(state, studykey, serieskey);
    });
}

// RESTController에서 studykey, serieskey를 통해 파일을 찾은 후 base64로 인코딩 한 것을 렌더링
async function assignImageToViewport(state, studykey, serieskey) {
    console.log ("assignImageToViewport 활성화됨!");
    const viewportId = state.currentViewport.id;
    const content = document.getElementById(viewportId);
    let viewport = state.renderingEngine.getViewport(viewportId);
    let element;

    // 뷰포트가 없으면 새로 생성함
    if (!viewport) {
        content.innerHTML = "";

        element = document.createElement('div');
        content.appendChild(element);

        const viewportInput = {
            viewportId,
            element,
            type: Enums.ViewportType.STACK,
        };

        state.renderingEngine.enableElement(viewportInput);
        viewport = state.renderingEngine.getViewport(viewportId);
    } else {
        element = viewport.element;
    }

    try {
        const response = await fetch(
            `/reports/develop/testing/wado?requestType=WADO&studykey=${studykey}&serieskey=${serieskey}`
        );

        if (!response.ok) {
            alert(`HTTP 오류 ${response.status} (이)가 발생하였습니다.`);
            throw new Error(`HTTP 오류 상태 코드 ${response.status} 입니다.`);
        }

        const base64Images = await response.json();
        if (!Array.isArray(base64Images) || base64Images.length === 0) {
            alert(`DICOM 파일이 없거나 불러오는데 실패하였습니다.`);
            console.warn('이미지 파일이 없거나 잘못되었습니다.');
            return;
        }
        console.log("Base64 이미지 값 : " + base64Images);

        const imageIds = base64Images.map(
            base64String =>
                `wadouri:data:application/dicom;base64,${base64String}`
        );
        console.log("imageIds 값 : " + imageIds);
        // const overlayElements = await getOverlayElement(studykey, serieskey);
        // overlayElements.forEach(overlay => element.appendChild(overlay));

        viewport.setStack(imageIds, 0);
        viewport.render();
    } catch (error) {
        alert('DICOM 이미지 로드 중 오류가 발생하였습니다.');
        console.error('DICOM 이미지 로드 중 오류가 발생하였음! ' +
            '오류 내용: ', error);
    }
}

