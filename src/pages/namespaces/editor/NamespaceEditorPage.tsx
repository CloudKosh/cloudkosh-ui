import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp.js";
import { INamespace, INamespaceStorage, INamespaceUser, Namespace, NamespaceStorageTypeArray } from "../../../model/model.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import FormField from "@web-atoms/web-controls/dist/basic/FormField.js";
import Bind from "@web-atoms/core/dist/core/Bind.js";
import { SaveIconTextButton } from "../../../core/controls/buttons/IconButton.js";
import Action from "@web-atoms/core/dist/view-model/Action.js";
import { Inject } from "@web-atoms/core/dist/di/Inject.js";
import EntityService from "../../../core/EntityService.js";
import CollectionEditorEx from "../../../core/controls/collection-editor/CollectionEditorEx.js";
import Form from "@web-atoms/web-controls/dist/basic/Form.js";
import AppForm from "../../../core/controls/app-form/AppForm.js";
import Select from "@web-atoms/web-controls/dist/basic/Select.js";

export default class NamespaceEditorPage extends ContentPage<INamespace> {

    model: INamespace;

    @Inject private entityService: EntityService;

    async init() {

        this.model = this.parameters?.id ? { ... this.parameters } : Namespace.create({});

        this.renderer = <div>
            <Form>
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
                
                <CollectionEditorEx
                    label="Users"
                    model={this.model}
                    field={(x) => x.namespaceUsers}
                    itemRenderer={(x: INamespaceUser) => <div>
                        <label text={x.user.displayName}/>
                        <label text={x.user.emailAddress}/>
                    </div>}
                    />

                <CollectionEditorEx
                    label="Storages"
                    model={this.model}
                    field={(x) => x.storages}
                    itemRenderer={(x: INamespaceStorage) => <div>
                        <label text={x.name}/>
                        <label text={x.type}/>
                        <label text={x.bucket}/>
                        <label text={x.endpoint || x.region}/>
                        <label text={x.accessKeyID}/>
                    </div>}
                    inlineAddRenderer={(item) => <AppForm>
                        <FormField label="Type">
                            <Select
                                items={NamespaceStorageTypeArray}
                                value={Bind.sourceTwoWays(item, (x) => x.source.type)}
                                />
                        </FormField>
                        <FormField label="Name">
                            <input value={Bind.sourceTwoWays(item, (x) => x.source.name)}/>
                        </FormField>
                        <FormField label="Bucket">
                            <input value={Bind.sourceTwoWays(item, (x) => x.source.bucket)}/>
                        </FormField>
                        <FormField label="Root">
                            <input value={Bind.sourceTwoWays(item, (x) => x.source.root)}/>
                        </FormField>
                        <FormField label="Region">
                            <input placeholder="us-east-1" value={Bind.sourceTwoWays(item, (x) => x.source.region)}/>
                        </FormField>
                        <FormField label="Endpoint">
                            <input placeholder="for non aws storage only" value={Bind.sourceTwoWays(item, (x) => x.source.endpoint)}/>
                        </FormField>
                        <FormField label="Access Key ID">
                            <input value={Bind.sourceTwoWays(item, (x) => x.source.accessKeyID)}/>
                        </FormField>
                        <FormField label="Secret Access Key">
                            <input value={Bind.sourceTwoWays(item, (x) => x.source.secretAccessKey)}/>
                        </FormField>
                    </AppForm>}
                    />

                <FormField label="">
                    <SaveIconTextButton data-submit-event="save-model"/>
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