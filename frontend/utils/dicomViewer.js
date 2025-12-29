// utils/dicomViewer.js
import { init, RenderingEngine, Enums, setUseCPURendering } from "@cornerstonejs/core";
import { init as loaderInit } from "@cornerstonejs/dicom-image-loader";

const renderingEngineId = "engine";
const viewportId = "dicomViewerContainer";

let initialized = false;
let engine = null;
let ro = null; // ✅ ResizeObserver

let initPromise = null;
let currentEl = null;


// ✅ core/loader init은 딱 1번만 (StrictMode에도 안전)
async function ensureInitOnce() {
    if (initialized) return;

    await init();
    await loaderInit();
    initialized = true;
}

// ✅ RenderingEngine은 단 1번만 생성
function getOrCreateEngine() {
    if (!engine) {
        engine = new RenderingEngine(renderingEngineId);
    }
    return engine;
}

/**
 * 뷰어 초기화 (모달 open 시 element가 생겼을 때 호출)
 * - element가 바뀔 수 있으므로 enableElement는 매번 호출 가능하게 유지
 */
export async function initViewer(el) {
    if (!el) throw new Error("initViewer: element is required");

    await ensureInitOnce();
    const eng = getOrCreateEngine();
    currentEl = el;

    const viewportInput = {
        viewportId,
        element: el,
        type: Enums.ViewportType.STACK,
    };

    eng.enableElement(viewportInput);
    const viewport = eng.getViewport(viewportId);

    return { eng, viewportId, viewport };
 }

function getEngine() {
    if (!engine) engine = new RenderingEngine(renderingEngineId);
    return engine;
}

// ✅ el이 바뀌면 무조건 재연결
export async function bindViewer(el) {
    if (!el) throw new Error("bindViewer: el is required");
    await ensureInitOnce();

    const eng = getEngine();

    // 이미 같은 el에 붙어 있으면 재사용
    if (currentEl === el) {
        const vp = eng.getViewport(viewportId);
        if (vp) return { renderingEngine: eng, viewportId };
    }

    // el이 달라졌거나 viewport가 없으면 재-enable
    try { eng.disableElement(viewportId); } catch {}

    eng.enableElement({
        viewportId,
        type: Enums.ViewportType.STACK,
        element: el,
    });

    currentEl = el;

    // 레이아웃 반영
    eng.resize(true, true);

    return { renderingEngine: eng, viewportId };
}

/**
 * 스택 표시
 */
export async function showDicom(imageIds, index = 0) {
    await new Promise((r) => requestAnimationFrame(r));
    eng.resize(true, true);

    const img = viewport.getImageData();

    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    console.log("MAX_TEXTURE_SIZE =", gl?.getParameter(gl.MAX_TEXTURE_SIZE));

    await viewport.setStack(imageIds, index);
    await viewport.render();
}


export function clearStack() {
    try { ro?.disconnect?.(); } catch {}
    ro = null;
}


