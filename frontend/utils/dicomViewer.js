// utils/dicomViewer.js
import { init, RenderingEngine, Enums, setUseCPURendering } from "@cornerstonejs/core";
import { init as loaderInit } from "@cornerstonejs/dicom-image-loader";

const renderingEngineId = "engine";
const viewportId = "dicomViewerContainer";

let initialized = false;
let engine = null;
let ro = null; // ✅ ResizeObserver

// let viewportId = null;

let initPromise = null;
let currentEl = null;


// ✅ core/loader init은 딱 1번만 (StrictMode에도 안전)
async function ensureInitOnce() {
    // if (!initPromise) {
    //     initPromise = (async () => {
    //         // ✅ 핵심: init() 호출 전에 CPU 렌더링 강제
    //         setUseCPURendering(true);
    //
    //         await init();
    //         await loaderInit();
    //     })();
    // }
    // await initPromise;
    if (initialized) return;

    // setUseCPURendering(true);

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

    // const engine = new RenderingEngine(
    //     `engine-${Date.now()}` // ❗ 매번 새 ID
    // );
    //
    // engine.enableElement({
    //     viewportId: "viewport",
    //     type: Enums.ViewportType.STACK,
    //     element: el,
    // });
    //
    // return { renderingEngine: engine, viewportId: "viewport" };



    await ensureInitOnce();
    const eng = getOrCreateEngine();

    // ✅ 매번 새로운 viewportId
    // viewportId = `viewport_${Date.now()}`;
    currentEl = el;

    // eng.enableElement({
    //     viewportId,
    //     element: el,
    //     type: Enums.ViewportType.STACK,
    // });
    //
    // eng.resize(true, true);

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
 * ✅ 중요: viewport를 인자로 받지 말고, 항상 최신 viewport를 다시 꺼내서 사용
 * -> destroyed viewport 에러 방지
 */

export async function showDicom(imageIds, index = 0) {
    // const eng = getOrCreateEngine();
    // const viewport = eng.getViewport(viewportId);
    // if (!viewport) throw new Error("viewport not found");

    await new Promise((r) => requestAnimationFrame(r));
    eng.resize(true, true);

    const img = viewport.getImageData();
    // console.log("cols:", img.dimensions[0], "rows:", img.dimensions[1]);

    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    console.log("MAX_TEXTURE_SIZE =", gl?.getParameter(gl.MAX_TEXTURE_SIZE));


    // stack
    await viewport.setStack(imageIds, index);
    await viewport.render();

    // ✅ 첫 이미지 렌더 1회 대기
    // const el = viewport.element;
    // await new Promise((resolve) => {
    //     const handler = () => resolve();
    //     el.addEventListener(Enums.Events.IMAGE_RENDERED, handler, { once: true });
    // });

    // ✅ “전체가 보이도록” 기본 카메라로 강제
    // eng.resize(true, true);

    // 4) ✅ 여기서부터 "전체 fit" 강제
    // const el = viewport.element;
    // const w = el.clientWidth;
    // const h = el.clientHeight;
    // const aspect = w / h;
    //
    // const imageData = viewport.getImageData?.();
    // // imageData 없으면(아직 로드전) 그냥 render만
    // if (!imageData) {
    //     viewport.render();
    //     return;
    // }
    //
    // const [cols, rows] = imageData.dimensions;     // 보통 [width, height]
    // // const [rows, cols] = imageData.dimensions;
    // const [sx, sy] = imageData.spacing || [1, 1];  // 픽셀 스페이싱
    //
    // const imgW = cols * sx;
    // const imgH = rows * sy;
    //
    // // vtk/Cornerstone parallelScale = 화면 "반 높이" (world unit)
    // // 전체가 보이려면: halfHeight >= imgH/2 AND halfHeight >= (imgW/2)/aspect
    // const fitParallelScale = Math.max(imgH / 2, (imgW / 2) / aspect);
    // // const fitParallelScale = Math.max(700, 700);
    //
    // const cam = viewport.getCamera?.() || {};
    // viewport.setCamera?.({
    //     ...cam,
    //     parallelScale: fitParallelScale,
    // });
    //
    // // eng.resize(true, true);          // ✅ setStack 이후도 한 번 더
    // // viewport.resetCamera();          // ✅ 전체 보이게
    // // viewport.resetProperties?.();    // ✅ 남은 상태 제거
    // // viewport.render();

    viewport.render();

    // const def = viewport.getDefaultCamera?.();
    //
    // console.log("camera:", viewport.getCamera?.());
    // console.log("default:", def);
    // if (def) {
    //     viewport.setCamera(def);
    // } else {
    //     viewport.resetCamera(); // fallback
    // }
    //
    // viewport.render();


    //
    // // 레이아웃 확정
    // await new Promise((r) => requestAnimationFrame(r));
    // eng.resize(true, true);
    //
    // // setStack
    // await viewport.setStack(imageIds, index);
    //
    // // ✅ "첫 렌더 후" fit을 위해 IMAGE_RENDERED 1회 기다리기
    // const el = viewport.element;
    // const waitFirstRender = () =>
    //     new Promise((resolve) => {
    //         const handler = () => {
    //             el.removeEventListener(Enums.Events.IMAGE_RENDERED, handler);
    //             resolve();
    //         };
    //         el.addEventListener(Enums.Events.IMAGE_RENDERED, handler, { once: true });
    //     });
    //
    // viewport.render();
    // await waitFirstRender();
    //
    // // ✅ 여기서 fit(전체 보이게)
    // eng.resize(true, true);
    // viewport.resetCamera();
    // viewport.render()

    // // 1) 레이아웃 확정 + 엔진 리사이즈
    // await new Promise((r) => requestAnimationFrame(r));
    // eng.resize(true, true);
    //
    // // 2) 스택 세팅
    // await viewport.setStack(imageIds, index);
    //
    // console.log("stack size:", viewport.getImageIds()?.length);
    //
    // // 3) 일단 1번 렌더
    // viewport.render();
    //
    // // 4) ✅ "첫 렌더 이후"에 fit 다시 (여기가 핵심)
    // await new Promise((r) => requestAnimationFrame(r));
    // eng.resize(true, true);
    // viewport.resetCamera();
    // viewport.render();
    //
    // // 1️⃣ 모달 레이아웃 안정화
    // await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    //
    // eng.resize(true, true);
    //
    // // 2️⃣ 스택 설정
    // await viewport.setStack(imageIds, index);
    // // await viewport.setStack(imageIds, 0);
    //
    // console.log("stack size:", viewport.getImageIds()?.length);
    // console.log("current image:", viewport.getCurrentImageId?.());
    //
    //
    // // 3️⃣ 🔥🔥🔥 핵심: fitToWindow (resetCamera ❌)
    // if (viewport.fitToWindow) {
    //     viewport.fitToWindow();
    // } else {
    //     // fallback (버전 차이 대응)
    //     const cam = viewport.getCamera();
    //     const imageData = viewport.getImageData();
    //     const { rows, columns } = imageData.dimensions;
    //
    //     const el = viewport.element;
    //     const scaleX = columns / el.clientWidth;
    //     const scaleY = rows / el.clientHeight;
    //
    //     viewport.setCamera({
    //         ...cam,
    //         parallelScale: Math.max(scaleX, scaleY),
    //     });
    // }
    //
    // // 4️⃣ render
    // eng.resize(true, true);
    // viewport.render();
}


export function clearStack() {
    try { ro?.disconnect?.(); } catch {}
    ro = null;
}


// export async function showDicom(imageIds) {
//     if (!imageIds?.length) throw new Error("showDicom: imageIds is empty");
//
//     const engine = getOrCreateEngine();
//     const viewport = engine.getViewport(viewportId);
//     if (!viewport) throw new Error("showDicom: viewport not found (did you call initViewer?)");
//
//     await viewport.setStack(imageIds, 0);
//
//     // requestAnimationFrame(() => {
//     //     try {
//     //         engine.resize(true, true);   // 또는 viewport.resize()가 있으면 그걸 써도 됨
//     //         viewport.render();
//     //     } catch {}
//     // });
//
//     viewport.render();
// }

/**
 * 모달 닫힐 때: destroy 하지 말고 연결만 끊기(간단/안전)
 * - destroyEngine을 안 하므로 재오픈이 빨라지고, destroyed 이슈도 줄어듦
 */
// export function detachViewer() {
//     if (!renderingEngine) return;
//     try {
//         renderingEngine.disableElement(viewportId);
//     } catch {
//         // ignore
//     }
// }

/**
 * (선택) 화면만 비우기
 */
// export function clearStack() {
//     try { ro?.disconnect?.(); } catch {}
//     ro = null;
// }
