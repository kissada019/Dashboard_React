import React from "react";
import { useParams, Link } from "react-router-dom";

const TreeDetail = () => {
    const { id } = useParams();

    return (
        <div>
            <h2>รายละเอียดต้นไม้</h2>
            <p>Tree ID: {id}</p>

            {/* Link back to the main tree page */}
            <Link to="/admin/tree">กลับไปหน้ารายการต้นไม้</Link>
        </div>
    );
};

export default TreeDetail;