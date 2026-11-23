import { PopupWindowPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp.js";
import { Namespace } from "../../../model/model.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import AppForm from "../../../core/controls/app-form/AppForm.js";
import FormField from "@web-atoms/web-controls/dist/basic/FormField.js";
import Bind from "@web-atoms/core/dist/core/Bind.js";
import { SaveIconTextButton } from "../../../core/controls/buttons/IconButton.js";
import Action from "@web-atoms/core/dist/view-model/Action.js";
import { Inject } from "@web-atoms/core/dist/di/Inject.js";
import EntityService from "../../../core/EntityService.js";

export default class NamespaceEditorPage extends PopupWindowPage {

    model = Namespace.create({})

    @Inject private entityService: EntityService;

    async init() {

        this.renderer = <div>
            <AppForm>
                <FormField
                    label="Name"
                    required={true}
                    error={Bind.oneWay(() => /[a-zA-Z0-9\-]{3,200}/i.test(this.model.name) ) ? "" : "Invalid name"}>
                    <input
                        autofocus={true}
                        placeholder="product-name"
                        value={Bind.twoWaysImmediate(() => this.model.name)}/>
                </FormField>
                <div>(Alpha numeric and with dash only)</div>
                <FormField label="Description">
                    <input value={Bind.twoWaysImmediate(() => this.model.description)}/>
                </FormField>
                <FormField label="">
                    <SaveIconTextButton data-submit-event="save-model"/>
                </FormField>
            </AppForm>
        </div>;
    }

    @Action({ onEvent: "save-model", close: true })
    async saveModel() {
        await this.entityService.save(this.model);
        return this.model;
    }
}