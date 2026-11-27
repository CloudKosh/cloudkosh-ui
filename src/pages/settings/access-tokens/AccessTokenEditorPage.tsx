import XNode from "@web-atoms/core/dist/core/XNode.js";
import Form from "@web-atoms/web-controls/dist/basic/Form.js";
import FormField from "@web-atoms/web-controls/dist/basic/FormField.js";
import { PopupWindowPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp.js";
import { AccessToken } from "../../../model/model.js";
import Bind from "@web-atoms/core/dist/core/Bind.js";
import { AddIconTextButton } from "../../../core/controls/buttons/IconButton.js";
import Action from "@web-atoms/core/dist/view-model/Action.js";
import { Inject } from "@web-atoms/core/dist/di/Inject.js";
import EntityService from "../../../core/EntityService.js";
import CopyIcon from "../../../core/controls/buttons/CopyIcon.js";

export default class AccessTokenEditorPage extends PopupWindowPage {

    model = AccessToken.create({});

    @Inject
    private entityService: EntityService;

    async init() {

        this.title = "Create new Access Token";

        this.renderer = <div>
            <Form>
                <FormField label="Title">
                    <input
                        autofocus={true}
                        placeholder="Searchable title (must be unique)"
                        value={Bind.twoWaysImmediate(() => this.model.title)}/>
                </FormField>
                <FormField label="Description">
                    <textarea
                        rows={3}
                        value={Bind.twoWaysImmediate(() => this.model.description)}/>
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

    @Action({ onEvent: "add-model"})
    async addModel() {
        this.model = await this.entityService.save(this.model);

        this.renderer = <div>
            <Form>
                <div>
                    Please copy following information, this will
                    never be displayed again.
                </div>
                <FormField
                label="Access Key ID"
                >
                    <flex-row>
                        <input
                            readOnly={true}
                            value={this.model.tokenID}/>
                        <CopyIcon
                            text={this.model.tokenID.toString()}
                            />
                    </flex-row>
                </FormField>
                <FormField
                label="Access Key ID"
                >
                    <flex-row>
                        <input
                            readOnly={true}
                            value={this.model.displaySecret}/>
                        <CopyIcon
                            text={this.model.displaySecret.toString()}
                            />
                    </flex-row>
                </FormField>
            </Form>
        </div>
    }

}