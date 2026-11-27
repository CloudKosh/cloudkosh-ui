import XNode from "@web-atoms/core/dist/core/XNode.js";
import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp.js";
import AtomRepeater from "@web-atoms/web-controls/dist/basic/AtomRepeater.js";
import { AccessToken, IAccessToken } from "../../../model/model.js";
import InfiniteRepeater from "../../../core/controls/repeater/InfiniteRepeater.js";
import { Inject } from "@web-atoms/core/dist/di/Inject.js";
import EntityService from "../../../core/EntityService.js";
import { Sql } from "../../../core/Sql.js";
import Bind from "@web-atoms/core/dist/core/Bind.js";
import { AddIconTextButton } from "../../../core/controls/buttons/IconButton.js";
import Action from "@web-atoms/core/dist/view-model/Action.js";
import PageNavigator from "@web-atoms/web-controls/dist/PageNavigator.js";
import AccessTokenEditorPage from "./AccessTokenEditorPage.js";

export default class AccessTokenListPage extends ContentPage {

    items: IAccessToken[] = [];

    search = "";

    version = 1;

    @Inject private entityService: EntityService;
    
    async init() {
        
        this.title = "Access Tokens";

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
                        this.loadItems({
                            start,
                            search: this.search,
                            cancelToken,
                            _v: this.version
                        })
                    )}
                itemRenderer={(item: IAccessToken) => <div>
                    <label text={item.tokenID}/>
                    <label text={item.title}/>
                    <label text={item.description}/>
                    <label text={item.dateCreated}/>
                    <label text={item.lastUsed}/>
                </div>}
                />
        </div>;

        this.footerRenderer = () => <footer>
            <AddIconTextButton
                text="Add New Access Token"
                data-click-event="add-item"
                />
        </footer>
    }

    loadItems({
        start,
        search,
        cancelToken,
        _v,
    }) {
        let q = this.entityService.query(AccessToken);
        if(search) {
            search = search + "%";
            q = q.where({ search}, (p) => (x) => Sql.text.like(x.description, p.search) );
        }
        return q.toPage({ start, size: 25, cancelToken});
    }

    @Action({ onEvent: "add-item"})
    async addItem() {
        await PageNavigator.pushPageForResult(AccessTokenEditorPage);
        this.version++;
    }
}