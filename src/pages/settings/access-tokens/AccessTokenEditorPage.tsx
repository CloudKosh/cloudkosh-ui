import XNode from "@web-atoms/core/dist/core/XNode.js";
import Form from "@web-atoms/web-controls/dist/basic/Form.js";
import FormField from "@web-atoms/web-controls/dist/basic/FormField.js";
import { PopupWindowPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp.js";
import { AccessToken } from "../../../model/model.js";
import Bind from "@web-atoms/core/dist/core/Bind.js";
import { AddIconTextButton } from "../../../core/controls/buttons/IconButton.js";

export default class AccessTokenEditorPage extends PopupWindowPage {

    model = AccessToken.create({});

    async init() {
        this.renderer = <div>
            <Form>
                <FormField label="Title">
                    <input
                        placeholder="Searchable title"
                        value={Bind.twoWaysImmediate(() => this.model.title)}/>
                </FormField>
                <FormField label="Description">
                    <textarea
                        rows={3}
                        value={Bind.twoWaysImmediate(() => this.model.title)}/>
                </FormField>
                <FormField label="">
                    <AddIconTextButton
                        data-click-event="add-model"
                        text="Add"
                        />
                </FormField>
            </Form>
        </div>;
    }

}