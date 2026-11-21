import XNode from "@web-atoms/core/dist/core/XNode.js";
import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp.js";
import AtomRepeater from "@web-atoms/web-controls/dist/basic/AtomRepeater.js";
import { Bucket, IBucket, INamespace, Namespace } from "../../../model/model.js";
import InfiniteRepeater from "../../../core/controls/repeater/InfiniteRepeater.js";
import { Inject } from "@web-atoms/core/dist/di/Inject.js";
import EntityService from "../../../core/EntityService.js";
import { Sql } from "../../../core/Sql.js";
import Bind from "@web-atoms/core/dist/core/Bind.js";

export default class BucketListPage extends ContentPage<{ ns }> {

    ns: INamespace;

    items: IBucket[] = [];

    search = "";

    @Inject private entityService: EntityService;
    
    async init() {

        this.ns = await this.loadNamespace();

        this.headerRenderer = () => <div>
            <div>
                <span>{this.ns.name} ({this.ns.id})</span>
            </div>
            <div>
                <input
                    type="search"
                    placeholder="Search"
                    value={Bind.twoWaysImmediate(() => this.search)}/>
            </div>
        </div>;

        this.renderer = <div>
            <AtomRepeater
                items={this.items}
                data-layout="data-grid"
                { ... InfiniteRepeater.pagedItems((start) =>
                    (c, e, cancelToken) =>
                        this.loadItems({ start, search: this.search, cancelToken })
                    )}
                itemRenderer={(item: IBucket) => <div>
                    <label text={item.bucketID}/>
                    <label text={item.name}/>
                    <label text={item.size}/>
                </div>}
                />
        </div>;
    }

    loadNamespace() {
        return this.entityService.query(Namespace)
            .where({ ns: this.parameters.ns }, (p) => (x) => x.id === p.ns)
            .firstOrDefault();
    }

    loadItems({
        start,
        search,
        cancelToken
    }) {
        let q = this.entityService.query(Bucket);
        if(search) {
            search = search + "%";
            q = q.where({ search}, (p) => (x) => Sql.text.like(x.name, p.search) );
        }
        return q.toPage({ start, size: 25, cancelToken});
    }

}