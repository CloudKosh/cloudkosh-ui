import XNode from "@web-atoms/core/dist/core/XNode.js";
import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp.js";
import AtomRepeater from "@web-atoms/web-controls/dist/basic/AtomRepeater.js";
import { INamespace, Namespace } from "../../../model/model.js";
import InfiniteRepeater from "../../../core/controls/repeater/InfiniteRepeater.js";
import { Inject } from "@web-atoms/core/dist/di/Inject.js";
import EntityService from "../../../core/EntityService.js";
import { Sql } from "../../../core/Sql.js";
import Bind from "@web-atoms/core/dist/core/Bind.js";
import AppCommands from "../../../commands/AppCommands.js";
import { AddIconTextButton } from "../../../core/controls/buttons/IconButton.js";
import Action from "@web-atoms/core/dist/view-model/Action.js";
import PageNavigator from "@web-atoms/web-controls/dist/PageNavigator.js";
import NamespaceEditorPage from "../editor/NamespaceEditorPage.js";

export default class NamespaceListPage extends ContentPage {

    items: INamespace[] = [];

    search = "";

    @Inject private entityService: EntityService;
    
    async init() {
        
        this.title = "Namespaces";

        this.headerRenderer = () => <div>
            <input
                type="search"
                placeholder="Search"
                value={Bind.twoWaysImmediate(() => this.search)}/>
        </div>;

        this.renderer = <div>
            <AtomRepeater
                items={this.items}
                data-layout="data-grid"
                { ... InfiniteRepeater.pagedItems((start) =>
                    (c, e, cancelToken) =>
                        this.loadItems({ start, search: this.search, cancelToken })
                    )}
                itemRenderer={(item: INamespace) => <div>
                    <a
                        data-click-event="route"
                        text={item.id}
                        href={AppCommands.buckets.displayRoute({ ns: item.id})}
                        />
                    <label text={item.name}/>
                    <label
                        style-color={item.isReady ? "" : "red"}
                        text={item.isReady ? "Ready" : "Not Ready"}/>
                    <label text={item.size}/>
                </div>}
                />
        </div>;

        this.footerRenderer = () => <footer>
            <AddIconTextButton data-click-event="add-item" />
        </footer>;
    }

    loadItems({
        start,
        search,
        cancelToken
    }) {
        let q = this.entityService.query(Namespace);
        if(search) {
            search = search + "%";
            q = q.where({ search}, (p) => (x) => Sql.text.like(x.name, p.search) );
        }
        return q.toPage({ start, size: 25, cancelToken});
    }

    @Action({ onEvent: "add-item"})
    async addItem() {
        const result = await PageNavigator.pushPageForResult(NamespaceEditorPage, {});
        this.items.insert(0, result);
    }
}