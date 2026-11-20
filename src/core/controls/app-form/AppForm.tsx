import XNode from "@web-atoms/core/dist/core/XNode.js";
import Form from "@web-atoms/web-controls/dist/basic/Form.js";

import "./AppForm.global.css";

export default function AppForm(a, ... nodes: XNode[]) {
    return <Form
        data-app-form="app-form"
        { ... a}>
        { ... nodes}
    </Form>;
}