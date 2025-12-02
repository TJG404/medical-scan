import {
    WindowLevelTool,
    ZoomTool,
    addTool,
    PanTool,
    LengthTool,
    RectangleROITool,
    StackScrollTool,
    LabelTool,
    ArrowAnnotateTool,
    EllipticalROITool,
} from '@cornerstonejs/tools';
import * as csToolsEnums from "@cornerstonejs/tools/enums";

const toolConfig = {
    zoom: {
        tool: ZoomTool,
        toolName: ZoomTool.toolName
    },
    pan: {
        tool: PanTool,
        toolName: PanTool.toolName
    },
    stackScroll: {
        tool: StackScrollTool,
        toolName: StackScrollTool.toolName
    },

    // 주석 도구
    annotation: {
        tool: ArrowAnnotateTool,
        toolName: ArrowAnnotateTool.toolName
    },
    length: {
        tool: LengthTool,
        toolName: LengthTool.toolName
    },
    circle: {
        tool: EllipticalROITool,
        toolName: EllipticalROITool.toolName
    },
    rectangle: {
        tool: RectangleROITool,
        toolName: RectangleROITool.toolName
    },
    label: {
        tool: LabelTool,
        toolName: LabelTool.toolName
    },
    windowLevel: {
        tool: WindowLevelTool,
        toolName: WindowLevelTool.toolName
    }
};

const selectToolIds = ['zoom', 'pan', 'stackScroll','annotation', 'length', 'circle', 'rectangle', 'label', 'windowLevel'];
const setMainTools = {
    // 기본 도구로 활성화
    zoom: {
        toolName: toolConfig.zoom.toolName,
        binding: {mouseButton: csToolsEnums.MouseBindings.Primary}
    },
    pan: {
        toolName: toolConfig.pan.toolName,
        binding: {mouseButton: csToolsEnums.MouseBindings.Secondary}
    },
    stackScroll: {
        toolName: toolConfig.stackScroll.toolName,
        binding: {mouseButton: csToolsEnums.MouseBindings.Wheel}
    }
};

// 기능 활성화
export function initializeTools(state) {
    addTools();
    addToolsToGroup(state.toolGroup);
    setFixedToolsActive(state.toolGroup, setMainTools);
    setSelectToolActive(state, 'zoom');
    setToolButtonListeners(state);
    addViewports(state);
}

function addTools() {
    for (const key in toolConfig) {
        addTool(toolConfig[key].tool);
    }
}

function addToolsToGroup(toolGroup) {
    for (const key in toolConfig) {
        toolGroup.addTool(toolConfig[key].toolName);
    }
}

// 기본 펜, 줌, 휠을 활성화
function setFixedToolsActive(toolGroup, setMainTools) {
    for (const toolKey in setMainTools) {
        const toolName = setMainTools[toolKey].toolName;
        const binding = setMainTools[toolKey].binding;
        toolGroup.setToolActive(toolName, {bindings: [binding]});
    }
}

function setSelectToolActive(state, toolId) {
    const toolName = toolConfig[toolId].toolName;
    state.toolGroup.setToolActive(toolName, {
        bindings: [{mouseButton: csToolsEnums.MouseBindings.Primary}]
    });

    state.bindingTool = toolId;

    const toolButton = document.getElementById(toolId);

    if (toolButton) {
        toolButton.classList.add('active');
    }
}

// 도구 버튼에 EventListener 를 설정
function setToolButtonListeners(state) {
    const tools = document.querySelectorAll('.tool');
    tools.forEach(tool => {
        tool.addEventListener('click', () => {
            const viewport = state.renderingEngine.getViewport(state.currentViewport.id);

            if (!viewport) {
                return;
            }

            const toolId = tool.id;

            if (selectToolIds.includes(toolId)) {
                setActiveTool(state, toolId);
            } else if (toolId === "reset") {
                reset(state);
            }
        });
    });
}

function setActiveTool(state, toolId) {
    if (toolId === state.bindingTool) {
        return;
    }

    const prevToolName = toolConfig[state.bindingTool].toolName;
    state.toolGroup.setToolDisabled(prevToolName);

    const newToolName = toolConfig[toolId].toolName;
    state.toolGroup.setToolActive(newToolName, {
        bindings: [{mouseButton: csToolsEnums.MouseBindings.Primary}]
    });

    const prevToolButton = document.getElementById(state.bindingTool);
    if (prevToolButton) {
        prevToolButton.classList.remove('active');
    }
    const newToolButton = document.getElementById(toolId);
    if (newToolButton) {
        newToolButton.classList.add('active');
    }

    state.bindingTool = toolId;
}

function addViewports(state) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        state.toolGroup.addViewport(screen.id);
    });
}

function reset(state) {
    const viewport = state.renderingEngine.getViewport(state.currentViewport.id);
    viewport.resetCamera();
    // 속성 초기화
    viewport.setProperties({invert: false, hflip: false, vflip: false});
    viewport.render();
}