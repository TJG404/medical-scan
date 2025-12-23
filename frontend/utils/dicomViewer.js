
// utils/dicomViewer.js
import { init, RenderingEngine, Enums } from "@cornerstonejs/core";
import { init as loaderInit } from "@cornerstonejs/dicom-image-loader";

const renderingEngineId = "engine";
const viewportId = "viewport";

let initialized = false;
let renderingEngine = null;

async function ensureInitOnce() {
    if (initialized) return;
    await init();
    await loaderInit();
    initialized = true;
}

// ✅ RenderingEngine은 단 1번만 생성
function getOrCreateEngine() {
    if (!renderingEngine) {
        renderingEngine = new RenderingEngine(renderingEngineId);
    }
    return renderingEngine;
}

export async function initViewer(element) {
    if (!element) throw new Error("initViewer: element is required");

    await ensureInitOnce();

    const engine = getOrCreateEngine();

    // 이미 viewport가 있으면 제거 후 재연결
    try {
        engine.disableElement(viewportId);
    } catch {}

    engine.enableElement({
        viewportId,
        type: Enums.ViewportType.STACK,
        element,
    });

    const viewport = engine.getViewport(viewportId);
    if (!viewport) throw new Error("viewport 생성 실패");

    return { viewport };
}

export async function showDicom(viewport, imageIds) {
    if (!viewport) throw new Error("showDicom: viewport is required");
    await viewport.setStack(imageIds, 0);
    viewport.render();
}

// ❌ destroyEngine 제거
// RenderingEngine은 앱 종료 시까지 유지



// // utils/dicomViewer.js
// import { init, RenderingEngine, Enums } from "@cornerstonejs/core";
// import { init as loaderInit } from "@cornerstonejs/dicom-image-loader";
//
// let renderingEngine;
// const renderingEngineId = "engine";
// const viewportId = "viewport";
// let initialized = false;
//
// // export async function initViewer(element) {
// //     if (initialized) return;
// //
// //     await init();
// //     await loaderInit();
// //
// //     initialized = true;
// //     renderingEngine = new RenderingEngine(renderingEngineId);
// //
// //     renderingEngine.enableElement({
// //         viewportId,
// //         type: Enums.ViewportType.STACK,
// //         element,
// //     });
// //
// //     return viewportId;
// // }
//
// export async function initViewer(element) {
//     if (!element) throw new Error("initViewer: element is required");
//
//     // ✅ core/loader는 1회만
//     if (!initialized) {
//         await init();
//         await loaderInit();
//         initialized = true;
//     }
//
//     // ✅ 엔진은 모달마다 새로 만들거나(권장) 재사용 전략을 쓰면 되는데,
//     // 지금은 "모달 열 때 생성, 닫을 때 destroy" 패턴이므로 새로 생성이 안전합니다.
//     renderingEngine = new RenderingEngine(renderingEngineId);
//
//     renderingEngine.enableElement({
//         viewportId,
//         type: Enums.ViewportType.STACK,
//         element,
//     });
//
//     const viewport = renderingEngine.getViewport(viewportId);
//     if (!viewport) throw new Error("initViewer: viewport 생성 실패");
//
//     // ✅ 모달에서 destructuring 가능하게 객체로 리턴
//     return { renderingEngine, viewportId, viewport };
// }
//
// // export async function showDicom(imageIds) {
// //     const viewport = renderingEngine.getViewport(viewportId);
// //     await viewport.setStack(imageIds);
// //     viewport.render();
// // }
// export async function showDicom(viewport, imageIds) {
//     if (!viewport) throw new Error("showDicom: viewport is required");
//     if (!imageIds?.length) throw new Error("showDicom: imageIds is empty");
//
//     await viewport.setStack(imageIds, 0);
//     viewport.render();
// }
//
// // ✅ destroy도 renderingEngine 인스턴스를 직접 받는다
// export function destroyViewer(renderingEngine, viewportId = "viewport") {
//     try {
//         renderingEngine?.disableElement?.(viewportId);
//         renderingEngine?.destroy?.();
//     } catch (e) {
//         // ignore
//     }
// }
//
//
//
// // // utils/dicomViewer.js
// // import { init as coreInit, RenderingEngine, Enums } from "@cornerstonejs/core";
// // import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader";
// //
// // // ✅ tools init + addTool 필요
// // import {
// //     init as toolsInit,
// //     addTool,
// //     ToolGroupManager,
// //     ZoomTool,
// //     PanTool,
// //     StackScrollTool,
// //     LengthTool,
// //     AngleTool,
// //     BidirectionalTool,
// // } from "@cornerstonejs/tools";
// //
// // let renderingEngineId = "ctRenderingEngine";
// // let renderingEngine;
// // let toolGroupId = "ctToolGroup";
// // let viewportId = "ctViewport";
// //
// // export async function initViewer({ element }) {
// //     if (!element) throw new Error("element is required");
// //
// //     // 1) core / loader init
// //     await coreInit();
// //     await dicomImageLoaderInit();
// //
// //     // 2) ✅ tools init
// //     await toolsInit();
// //
// //     // 3) ✅ tool 등록 (등록 안 하면 addTool이 꼬이거나 toolGroup 동작이 이상해짐)
// //     addTool(ZoomTool);
// //     addTool(PanTool);
// //     addTool(StackScrollTool);
// //     addTool(LengthTool);
// //     addTool(AngleTool);
// //     addTool(BidirectionalTool);
// //
// //     // 4) RenderingEngine
// //     renderingEngine = new RenderingEngine(renderingEngineId);
// //
// //     renderingEngine.enableElement({
// //         viewportId,
// //         type: Enums.ViewportType.STACK,
// //         element,
// //     });
// //
// //     // 5) ✅ ToolGroup 생성 (이미 있으면 가져오기)
// //     const existing = ToolGroupManager.getToolGroup(toolGroupId);
// //     const toolGroup = existing ?? ToolGroupManager.createToolGroup(toolGroupId);
// //
// //     if (!toolGroup) {
// //         // createToolGroup가 undefined면 보통 "이미 존재" or "초기화 문제"
// //         throw new Error("ToolGroup 생성 실패: 기존 그룹/초기화 상태를 확인하세요.");
// //     }
// //
// //     toolGroup.addTool(PanTool.toolName);
// //     toolGroup.addTool(ZoomTool.toolName);
// //     toolGroup.addTool(StackScrollTool.toolName);
// //     toolGroup.addTool(LengthTool.toolName);
// //     toolGroup.addTool(AngleTool.toolName);
// //     toolGroup.addTool(BidirectionalTool.toolName);
// //
// //     toolGroup.setToolActive(StackScrollTool.toolName, { bindings: [] });
// //     toolGroup.addViewport(viewportId, renderingEngineId);
// //
// //     return { toolGroup, renderingEngine, viewportId };
// // }
// //
// // export function destroyViewer() {
// //     try {
// //         // ✅ ToolGroupManager에서 제거 (중요!)
// //         ToolGroupManager.destroyToolGroup(toolGroupId);
// //     } catch (e) {}
// //
// //     try {
// //         renderingEngine?.destroy?.();
// //     } catch (e) {}
// //
// //     renderingEngine = null;
// // }
