import XNode from "@web-atoms/core/dist/core/XNode.js";
import AtomRepeater from "@web-atoms/web-controls/dist/basic/AtomRepeater.js";
import * as ExpressionParser from "@web-atoms/core/dist/core/ExpressionParser.js";
import { AddIconTextButton, DeleteIconButton, EditIconButton } from "../buttons/IconButton.js";
import PageNavigator from "@web-atoms/web-controls/dist/PageNavigator.js";
import Bind from "@web-atoms/core/dist/core/Bind.js";
import { modelEntitySchemas } from "../../../model/model.js";
import { IModel, IRelation } from "@web-atoms/entity/dist/services/BaseEntityService.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import Action from "@web-atoms/core/dist/view-model/Action.js";

import "./CollectionEditorEx.global.css";
import PopupService from "@web-atoms/core/dist/web/services/PopupService.js";
import EntityService from "../../EntityService.js";

const hasKeys = (model, schema: IModel<any>) => {
    for (const iterator of schema.schema.keys) {
        if(!model[iterator.name]) {
            return false;
        }
    }
    return true;
};

export class ValidationContext<T> {
    errors = [] as (string | XNode)[];

    constructor(public readonly item: T) {

    }

    addError(test, error) {
        if (test) {
            if (typeof error === "function") {
                error = error();
            }
            this.errors.push(error);
        }
        return this;
    }
}

export default class CollectionEditorEx<T = any, TR = any> extends AtomControl {


    label: string = "";
    model: T = null;
    public field: (x: T) => TR[] = null;
    pageResultToItem?: (item: TR) => TR = null;
    itemFactory?: () => TR = null;
    itemRenderer: (item: TR) => XNode = null;
    inlineAddRenderer: (item: TR) => XNode = null;
    inlineAutoAddOnTrue: (item: TR) => boolean;
    inlineAdd: boolean = false;
    addPage?: any = null;
    editPage?: any = null;
    autoFocus: boolean = false;
    saveAfterAdd: boolean = true;

    validateItem: (vc: ValidationContext<TR>) => Promise<void> | void = null;

    layout: "data-grid" | "flex-wrap" = "data-grid";

    footer?: () => XNode = null;

    ["event-item-deleted"]: (ce: CustomEvent<TR>) => any;

    /** This event will be fired before deleting the item */
    ["event-delete-collection-item"]: (ce: CustomEvent<TR>) => any;

    addItemDefaults?: NoInfer<Partial<TR>> = null;

    private schema: IModel<any> = null;
    private items: any[] = [];
    private fieldName: string = null;
    private relation: IRelation = null;
    private repeater: AtomRepeater;


    constructor(app, e = document.createElement("details")) {
        super(app,e);
        this.element.setAttribute("data-collection-editor-ex", "collection-editor-ex");
        this.runAfterInit(() => this.app.runAsync(() => this.init()));
        this.bindEvent(document.body, "deleteCollectionItem", (ce: CustomEvent) => !ce.defaultPrevented && ( ce.preventDefault(), this.deleteItem(ce.detail)));
    }

    async init() {

        const fieldName = ExpressionParser.parsePath(this.field)[0][0];
        this.fieldName = fieldName;

        if (this.model) {
            this.model[this.fieldName] ??= [];
        }

        this.inlineAdd ||= !!this.inlineAddRenderer;

        const fx = () =>
            this.model[this.fieldName] ??= [];
        const exp = `() => this.model`;
        fx.toString = () => exp;

        // const inlineAutoAddOnTrue = this.inlineAutoAddOnTrue ?? (() => false);

        this.renderer = <details
            data-border="frame"
            open={true}
            items={Bind.oneWay(fx)}
            schema={Bind.oneWay(() => modelEntitySchemas[(this.model as any).$type])}
            relation={Bind.oneWay(() => this.schema.schema.relations.find((x) => x.name === this.fieldName))}>
            <summary text={Bind.oneWay(() => this.label)}>
            </summary>
            <div>
                <AtomRepeater
                    presenter={Bind.presenter((c) => this.repeater = c)}
                    data-layout={this.layout as any}
                    items={Bind.oneWay(() => this.items)}
                    footer={Bind.oneWay(() => this.inlineAdd ? "show-button" : void 0)}
                    footerRenderer={(newItem) => {

                        switch(newItem) {
                            case "show-button":
                                return <button event-click={() => this.repeater.footer = "show-form"}>Add New</button>
                        }

                        newItem = this.relation.relatedModel.create({ ... this.addItemDefaults ?? {}});

                        const node = this.inlineAddRenderer
                            ? this.inlineAddRenderer(newItem)
                            : this.itemRenderer(newItem);
                        const na = node.attributes ??= {};

                        const addNewItem = async () => {
                            if(!await this.addNewItemInList(newItem)) {
                                return;
                            }
                            this.repeater.footer = "show-button";
                        };

                        na["data-margin"] = "default";
                        // na["event-focusout"] = () => inlineAutoAddOnTrue(newItem) || addNewItem().catch(console.error);
                        node.children.push(<div><button
                            event-click={addNewItem}
                            text="Save"/></div>);
                        // for (const iterator of node.children) {
                        //     const a = iterator.attributes ??= {};
                        //     a["data-margin"] = "default";
                        // }

                        if(na["data-form"] === "form") {
                            // we need to embed this...
                            return <div>{node}</div>;
                        }

                        return node;

                    }}
                    itemRenderer={
                        (item: TR) => {
                            const node = this.itemRenderer(item);
                            if (!node) {
                                return <div/>;
                            }
                            const na = node.attributes ??= {};
                            na["data-margin"] = "default";
                            if (this.editPage) {
                                node.children.push(<span>
                                    <EditIconButton
                                        data-click-event="edit-collection-item"
                                        />
                                </span>);
                            }
                            node.children.push(<span><DeleteIconButton
                                data-click-event="delete-collection-item"
                                /></span>);
                            for (const iterator of node.children) {
                                if (iterator === false || iterator === null) {
                                    continue;
                                }
                                const a = iterator.attributes ??= {};
                                a["data-margin"] = "default";
                            }
                            return node;
                        }
                    }
                    />
                { this.footer
                    ? this.footer()
                    : (!this.inlineAdd && <div>
                        <AddIconTextButton
                            event-click={() => this.onAddItem()}
                            text="Add New"/>
                    </div>)}
            </div>
        </details>;
    }

    @Action({
        confirm: "Are you sure you want to delete this?",
        confirmTitle: "Confirm Delete"
    })
    async deleteItem(item: any) {
        const { items, repeater } = this;
        if (typeof item.$deleted === "undefined") {
            items.remove(item);
            return;
        }
        item.$deleted = true;
        const es = repeater.app.resolve(EntityService);
        const copy = es.cloner(item).copy;
        await es.save(copy as any);
        items.remove(item);
    }

    @Action({ onEvent: "edit-collection-item"})
    async editItem(item) {
        const { editPage } = this;
        const edited = await PageNavigator.pushPageForResult(editPage, { ... item }) as any;
        if (!edited) {
            return;
        }
        for (const key in edited) {
            if (Object.prototype.hasOwnProperty.call(edited, key)) {
                const element = edited[key];
                item[key] = element;
            }
        }
    }

    @Action({})
    async onAddItem() {
        const {
            addPage,
            addItemDefaults,
            pageResultToItem,
            itemFactory
        } = this;
        let newItem;
        if (addPage) {
            const result = await PageNavigator.pushPageForResult(addPage, { ... addItemDefaults ?? {} }) as any;
            newItem = pageResultToItem ? pageResultToItem(result) : result;
        } else {
            newItem = itemFactory?.() ?? this.relation.relatedModel.create({ ... addItemDefaults ?? {} });
        }

        if (!newItem) {
            return;
        }
        if (newItem?.then) {
            newItem = await newItem;
        }

        await this.addNewItemInList(newItem);
    }

    private async addNewItemInList(newItem: any) {
        const {
            repeater,
            model,
            schema
        } = this;

        const vi = this.validateItem;
        if (vi) {
            const vc = new ValidationContext(newItem);
            const r = vi.call(this, vc) as any;
            if (r?.then) {
                await r;
            }

            if (vc.errors.length) {
                await PopupService.alert({
                    message: <div data-layout="vertical-flex">{ ... vc.errors.map((x) => x instanceof XNode ? x : <p>{x}</p>)}</div>
                });
                return;
            }
        }

        if (hasKeys(model, schema) && this.saveAfterAdd) {
            const es = this.resolve(EntityService);
            const draft = { ...model, [this.fieldName]: [newItem] };
            let clone = es.cloner(draft);
            clone = clone.include((x) => x[this.fieldName]);
            await es.save(clone.copy as any);
        }
        repeater.items.add(newItem);

        return newItem;
    }
}