import XNode from "@web-atoms/core/dist/core/XNode.js";
import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp.js";
import AtomRepeater from "@web-atoms/web-controls/dist/basic/AtomRepeater.js";
import { AccessToken, IAccessToken } from "../../../model/model.js";
import InfiniteRepeater from "../../../core/controls/repeater/InfiniteRepeater.js";
import { Inject } from "@web-atoms/core/dist/di/Inject.js";
import EntityService from "../../../core/EntityService.js";
import { Sql } from "../../../core/Sql.js";
import Bind from "@web-atoms/core/dist/core/Bind.js";

export default class AccessTokenListPage extends ContentPage {

    items: IAccessToken[] = [];

    search = "";

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
                        this.loadItems({ start, search: this.search, cancelToken })
                    )}
                itemRenderer={(item: IAccessToken) => <div>
                    <label text={item.tokenID}/>
                    <label text={item.description}/>
                    <label text={item.dateCreated}/>
                    <label text={item.lastUsed}/>
                </div>}
                />
        </div>;
    }

    loadItems({
        start,
        search,
        cancelToken
    }) {
        let q = this.entityService.query(AccessToken);
        if(search) {
            search = search + "%";
            q = q.where({ search}, (p) => (x) => Sql.text.like(x.description, p.search) );
        }
        return q.toPage({ start, size: 25, cancelToken});
    }

}