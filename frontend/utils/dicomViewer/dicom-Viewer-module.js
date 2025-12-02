import {init as coreInit, RenderingEngine} from '@cornerstonejs/core';
import {init as dicomImageLoaderInit} from '@cornerstonejs/dicom-image-loader';
import {init as cornerstoneToolsInit, ToolGroupManager} from '@cornerstonejs/tools';
// import dicomParser from 'dicom-parser';
import {initRendering} from "./dicom-viewer";
import {initializeTools} from "./dicom-Viewer-tools";

// import cornerstoneWADOImageLoader from '@cornerstonejs/dicom-image-loader';
// cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

const state = {
    currentViewport: null,      // 현재 선택한 Viewport
    renderingEngine: null,      // Cornerstone 렌더링 엔진
    toolGroup: null,            // Cornerstone.js 툴 그룹
    bindingTool: 'zoom'
};

export async function initViewerModule() {
    await initializeCornerstone();
    initializeTools(state);
    initRendering(state);
}

async function initializeCornerstone() {
    await coreInit();
    await dicomImageLoaderInit();
    await cornerstoneToolsInit();
    state.renderingEngine = new RenderingEngine('drscan');
    state.toolGroup = ToolGroupManager.createToolGroup('toolGroup');
}


