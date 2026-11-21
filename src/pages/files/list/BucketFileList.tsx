import XNode from "@web-atoms/core/dist/core/XNode.js";
import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp.js";
import AtomRepeater from "@web-atoms/web-controls/dist/basic/AtomRepeater.js";
import { Bucket, IBucket, IBucketFile } from "../../../model/model.js";
import InfiniteRepeater from "../../../core/controls/repeater/InfiniteRepeater.js";
import { Inject } from "@web-atoms/core/dist/di/Inject.js";
import EntityService from "../../../core/EntityService.js";
import { Sql } from "../../../core/Sql.js";
import Bind from "@web-atoms/core/dist/core/Bind.js";
import { CacheTTL } from "../../../core/CacheTTL.js";

const cacheSeconds = CacheTTL.seconds.oneDay;
const cacheVersion = "c1";

export default class ObjectListPage extends ContentPage<{ bucketID }> {

    bucket: IBucket;

    items: IBucketFile[] = [];

    search = "";

    @Inject private entityService: EntityService;
    
    async init() {

        this.bucket = await this.loadBucket();

        this.title = this.bucket.namespace.name + "/" + this.bucket.name;

        this.headerRenderer = () => <div>
            <div>
                <span>{this.bucket.namespace.name}/{this.bucket.name} ({this.bucket.bucketID})</span>
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
                itemRenderer={(item: IBucketFile) => <div>
                    <label text={item.bucketFileID}/>
                    <label text={item.path}/>
                    <label text={item.size}/>
                </div>}
                />
        </div>;
    }

    loadBucket() {
        return this.entityService.query(Bucket)
            .where({ bucketID: this.parameters.bucketID }, (p) => (x) => x.bucketID === p.bucketID)
            .firstOrDefault({
                cacheSeconds,
                cacheVersion
            });
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