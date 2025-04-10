import React from 'react'
/* bootstrap */
import { Card, Collapse } from "react-bootstrap";
/* modules */
import {
    DataGitCommandsHighlight,
    DataGitCommandsDesc,
    DataGitCommandsUsed,
    DataGitCommandsLearn,
    DataGitCommitUsed,
} from './DataDocs';
/* components */
import DisplayText from "components/layout/DisplayText";

function index() {

    /* state */
    const [openCodeInfoCollapse, setOpenCodeInfoCollapse] = React.useState(true);
    const [openCodeInfoCommit, setOpenCodeInfoCommit] = React.useState(true)

    return (
        <Card className="mb-2 animate__animated animate__fadeIn">
            <Card.Body className="p-2">
                <div className="card  bg-opacity-25 mb-0">
                    <div className="card-header bg-opacity-50 p-2">
                        <div className="row">
                            <div className="col-10">
                                <p className="mb-0 fw-bold">รายละเอียด Git Advanced</p>
                            </div>
                            <div className="col-2 text-end">
                                <a onClick={() => setOpenCodeInfoCommit(!openCodeInfoCommit)} className="btn btn-blue btn-sm px-2 py-0" title="ย่อ/ขยาย">
                                    <span className="me-1">อ่านรายละเอียด</span>
                                    {!openCodeInfoCommit && <i className="fa-solid fa-circle-chevron-left"></i>}
                                    {openCodeInfoCommit && <i className="fa-solid fa-circle-chevron-down"></i>}
                                </a>
                            </div>
                        </div>
                    </div>
                    <Collapse in={openCodeInfoCommit}>
                        <div className="card-body p-2">
                            {/* <p className="mb-1">
                                <DisplayText
                                    isLinkify={true}
                                    isHighlight={true}
                                    highlightClassName="text-code bg-transparent"
                                    searchWords={DataGitCommandsHighlight.word}
                                    text={DataGitCommitDesc.text}
                                />
                            </p> */}
                            <p className="mb-0 fw-bold"> Git Advanced </p>
                            {DataGitCommitUsed.map((value, index) => (
                                <p key={index} className="mb-1">
                                    <DisplayText
                                        isLinkify={true}
                                        isHighlight={true}
                                        caseSensitive={true}
                                        highlightClassName="text-code bg-transparent"
                                        searchWords={DataGitCommandsHighlight.word}
                                        text={value.text}
                                    />
                                </p>
                            ))}
                            <hr className="my-2" />
                            <p className="mb-0 fw-bold">เรียนรู้เพิ่มเติม </p>
                            {DataGitCommandsLearn.map((value, index) => (
                                <p key={index} className="mb-0">
                                    <DisplayText isLinkify={true} text={value.text} />
                                </p>
                            ))}
                        </div>
                    </Collapse>
                </div>
            </Card.Body>
        </Card>
    )
}

export default index