import { init as coreInit, RenderingEngine, Enums } from '@cornerstonejs/core';
import { init as dicomImageLoaderInit } from '@cornerstonejs/dicom-image-loader';
import { ZoomTool, PanTool, ToolGroupManager, StackScrollTool, LengthTool, AngleTool, BidirectionalTool, ProbeTool} from '@cornerstonejs/tools';

window.onload = function () {
    initializeCornerstone();
    setupSelectToolGroups();
};

// Cornerstone.js 초기화
async function initializeCornerstone() {
    await coreInit();
    await dicomImageLoaderInit();

    // 영상 로딩 및 렌더링 함수 호출
    loadDicomImages();
}

// 기능 활성화
function setupSelectToolGroups(){
    const toolGroupId = 'ctToolGroup';
    const ctToolGroup = ToolGroupManager.createToolGroup(toolGroupId);

    // 영상 탐색 도구
    ctToolGroup.addTool(PanTool.toolName); // 영상을 상하좌우로 이동시키는 도구
    ctToolGroup.addTool(ZoomTool.toolName); // 영상 확대 및 축소 도구
    ctToolGroup.addTool(StackScrollTool.toolName); // 마우스 휠로 영상 움직임

    // 기본 활성화
    ctToolGroup.setToolActive(StackScrollTool.toolName, {
        bindings: []
    });

    document.getElementById("zoomBtn").addEventListener('click', () => {
        ctToolGroup.setToolActive(ZoomTool.toolName, {bindings : []});
        console.log("줌 도구 활성화됨");
    });

    document.getElementById("panBtn").addEventListener('click', () => {
        ctToolGroup.setToolActive(PanTool.toolName, {bindings : []});
        console.log("화면 이동 활성화됨");
    });

    document.getElementById("stackScrollBtn").addEventListener('click', () => {
        ctToolGroup.setToolActive(StackScrollTool.toolName, { bindings: [] });
        console.log("StackScrollTool 활성화됨");
    });

    // 측정 도구
    ctToolGroup.addTool(LengthTool.toolName); // 두 점 사이의 거리를 측정
    ctToolGroup.addTool(AngleTool.toolName); // 각도 측정
    ctToolGroup.addTool(BidirectionalTool.toolName); // 두 방향의 선을 이용해 거리를 측정

}