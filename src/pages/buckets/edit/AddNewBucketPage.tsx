import { PopupWindowPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp.js";
import { Bucket, IBucket } from "../../../model/model.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import Form from "@web-atoms/web-controls/dist/basic/Form.js";
import FormField from "@web-atoms/web-controls/dist/basic/FormField.js";
import Bind from "@web-atoms/core/dist/core/Bind.js";
import NamespaceDropDown from "../../../core/controls/dropdowns/NamespaceDropDown.js";
import { SaveIconTextButton } from "../../../core/controls/buttons/IconButton.js";
import Action from "@web-atoms/core/dist/view-model/Action.js";
import { Inject } from "@web-atoms/core/dist/di/Inject.js";
import EntityService from "../../../core/EntityService.js";

export default class AddNewBucketPage extends PopupWindowPage<IBucket> {

    model: IBucket;

    @Inject
    private entityService: EntityService;

    async init() {

        this.model = Bucket.create({ ... this.parameters ?? {}});

        this.renderer = <div>
            <Form>
                <FormField label="Namespace">
                    <NamespaceDropDown
                        value={Bind.twoWaysImmediate(() => this.model.namespaceID )}
                        />
                </FormField>
                <FormField label="Name">
                    <input value={Bind.twoWaysImmediate(() => this.model.name)}/>
                </FormField>
                <FormField label="">
                    <div>
                        <SaveIconTextButton
                            data-submit-event="save-model"
                            />
                    </div>
                </FormField>
            </Form>
        </div>;
        
    }

    @Action({ onEvent: "save-model", close: true })
    async saveModel() {
        await this.entityService.save(this.model);
        return this.model;
    }

}