"use client";
import { useEffect, useRef } from "react";

export default function DicomViewer({ imageId }) {
    const elRef = useRef(null);
    const enabledRef = useRef(false);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            if (!imageId) {
                console.warn("DicomViewer: imageId is empty -> skip load", imageId);
                return;
            }

            if (!elRef.current) return;

            const cornerstoneModule = await import("cornerstone-core");
            const cornerstone = cornerstoneModule.default || cornerstoneModule;

            const dicomParserModule = await import("dicom-parser");
            const dicomParser = dicomParserModule.default || dicomParserModule;

            const wadoModule = await import("cornerstone-wado-image-loader");
            const wado = wadoModule.default || wadoModule;

            // external 연결
            wado.external.cornerstone = cornerstone;
            wado.external.dicomParser = dicomParser;

            const wadouriLoadImage = wado?.wadouri?.loadImage || wado?.loadImage;
            if (!wadouriLoadImage) {
                console.error("wadouri loadImage function not found", wado);
                return;
            }

            cornerstone.registerImageLoader("wadouri", wadouriLoadImage);
            cornerstone.registerImageLoader("dicomfile", wadouriLoadImage);

            if (!enabledRef.current) {
                cornerstone.enable(elRef.current);
                enabledRef.current = true;
            }

            try {
                console.log("imageId:", imageId);

                const image = await cornerstone.loadImage(imageId);
                if (cancelled) return;

                cornerstone.displayImage(elRef.current, image);
                cornerstone.fitToWindow(elRef.current);
            } catch (err) {
                console.error("viewer init/show error:", err, { imageId });
            }
        };

        run();

        return () => {
            cancelled = true;
            // imageId 변경마다 disable까지 하면 깜빡임이 있을 수 있어서 "언마운트 때만" 권장
            // (페이지/모달 닫힐 때)
            (async () => {
                try {
                    const cornerstoneModule = await import("cornerstone-core");
                    const cornerstone = cornerstoneModule.default || cornerstoneModule;
                    if (elRef.current && enabledRef.current) {
                        cornerstone.disable(elRef.current);
                        enabledRef.current = false;
                    }
                } catch {}
            })();
        };
    }, [imageId]);

    return (
        <div
            ref={elRef}
            style={{ width: 700, height: 700, background: "#111" }}
        />
    );
}

