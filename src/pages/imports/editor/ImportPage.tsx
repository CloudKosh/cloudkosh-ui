import XNode from "@web-atoms/core/dist/core/XNode.js";
import { PopupWindowPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp.js";
import AppForm from "../../../core/controls/app-form/AppForm.js";
import FormField from "@web-atoms/web-controls/dist/basic/FormField.js";
import NamespaceDropDown from "../../../core/controls/dropdowns/NamespaceDropDown.js";
import Bind from "@web-atoms/core/dist/core/Bind.js";
import BucketDropDown from "../../../core/controls/dropdowns/BucketDropDown.js";
import Select from "@web-atoms/web-controls/dist/basic/Select.js";
import { ImportTask, ImportTaskSourceTypeArray } from "../../../model/model.js";
import { SaveIconTextButton } from "../../../core/controls/buttons/IconButton.js";
import Action from "@web-atoms/core/dist/view-model/Action.js";
import { Inject } from "@web-atoms/core/dist/di/Inject.js";
import EntityService from "../../../core/EntityService.js";

export default class ImportPage extends PopupWindowPage {

    model = ImportTask.create({
        destBucketID: null,
        destNamespaceID: null
    });

    @Inject
    private entityService: EntityService;

    async init() {
        this.renderer = <div>
            <AppForm>
                <FormField label="Namespace">
                    <NamespaceDropDown
                        value={Bind.twoWaysImmediate(() => this.model.destNamespaceID)}
                        />
                </FormField>
                <FormField label="Bucket (Leave Empty if you want to import entire namespace)">
                    <BucketDropDown
                        namespaceID={Bind.oneWay(() => this.model.destNamespaceID)}
                        value={Bind.twoWaysImmediate(() => this.model.destBucketID)}
                        />
                </FormField>
                <FormField label="Source">
                    <Select
                        items={ImportTaskSourceTypeArray}
                        value={Bind.twoWaysImmediate(() => this.model.sourceType)}
                        />
                </FormField>
                <FormField
                    style-display={Bind.oneWay(() =>
                        this.model.sourceType === "azure-blob"
                        || this.model.sourceType === "cloud-kosh-ns"
                        || this.model.sourceType === "cloud-kosh-bucket"
                    )}
                    label="Connection String">
                    <input
                        value={Bind.twoWaysImmediate(() => this.model.connectionString)}
                        />
                </FormField>
                <FormField
                    style-display={Bind.oneWay(() =>
                        this.model.sourceType === "azure-blob"
                        || this.model.sourceType === "cloud-kosh-ns"
                        || this.model.sourceType === "cloud-kosh-bucket"
                    )}
                    label="Container/Namespace">
                    <input
                        value={Bind.twoWaysImmediate(() => this.model.container)}
                        />
                </FormField>
                <FormField
                    style-display={Bind.oneWay(() =>
                        this.model.sourceType === "s3"
                    )}
                    label="Region">
                    <input
                        value={Bind.twoWaysImmediate(() => this.model.region)}
                        />
                </FormField>
                <FormField
                    style-display={Bind.oneWay(() =>
                        this.model.sourceType === "s3"
                    )}
                    label="Endpoint">
                    <input
                        value={Bind.twoWaysImmediate(() => this.model.endpoint)}
                        />
                </FormField>
                <FormField
                    style-display={Bind.oneWay(() =>
                        this.model.sourceType === "s3"
                    )}
                    label="Access Key ID">
                    <input
                        value={Bind.twoWaysImmediate(() => this.model.accessKeyID)}
                        />
                </FormField>
                <FormField
                    style-display={Bind.oneWay(() =>
                        this.model.sourceType === "s3"
                    )}
                    label="Secret Access Key">
                    <input
                        value={Bind.twoWaysImmediate(() => this.model.secretAccessKey)}
                        />
                </FormField>
                <FormField
                    style-display={Bind.oneWay(() =>
                        this.model.sourceType === "s3"
                    )}
                    label="Bucket">
                    <input
                        value={Bind.twoWaysImmediate(() => this.model.bucket)}
                        />
                </FormField>
                <FormField label="">
                    <SaveIconTextButton
                        data-submit-event="save-item"
                        />
                </FormField>
            </AppForm>
        </div>
    }

    @Action({ onEvent: "save-item", close: true })
    async saveItem() {
        await this.entityService.save(this.model);
        return this.model;
    }
}