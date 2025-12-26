"use client";

import {useEffect, useState, useMemo, Fragment} from "react";
import 'rc-pagination/assets/index.css';
import Pagination from "rc-pagination";

export default function ThumbList({list, total, click}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const viewThumbList = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = currentPage * pageSize;
        return list.slice(start, end);
    }, [list, currentPage, pageSize]);

    const handleImageChange = (path, fname) => {
        click(path, fname);
    }

    return (
        <>
        <div  className="series-card" style={{border:"1px solid #fff"}}>
            {viewThumbList && viewThumbList.map(thumb => (
                <img key={thumb.fname} src={`/dicom-thumb/${thumb.path}${thumb.fname}`}
                     width="60" height="50" style={{paddingTop:"10px"}}
                    onClick={()=> handleImageChange(thumb.path, thumb.fname)}/>
            ))}
            <div className="patients-pagination-thumb">
                <Pagination style={{fontSize:"9px"}}
                    current={currentPage}
                    total={total}
                    pageSize={pageSize}
                    onChange={(page) => setCurrentPage(page)}
                    showTitle={false}
                />
            </div>
        </div>
        </>
    )
}