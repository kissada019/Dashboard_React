import { useParams } from "react-router-dom";

function Edit() {
    let { id } = useParams();
    return <div>Edit Page for ID: {id}</div>;
}

export default Edit;