import { Inject } from "@web-atoms/core/dist/di/Inject.js";
import DropDown from "@web-atoms/web-controls/dist/basic/DropDown.js";
import EntityService from "../../EntityService.js";
import { Bucket, IBucket } from "../../../model/model.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import Bind from "@web-atoms/core/dist/core/Bind.js";
import sleep from "../../sleep.js";
import { CacheTTL } from "../../CacheTTL.js";
import { CancelToken } from "@web-atoms/core/dist/core/types.js";
import { Sql } from "../../Sql.js";

const cacheSeconds = CacheTTL.seconds.oneDay;
const cacheVersion = "v1";

export default class BucketDropDown extends DropDown {

    @Inject
    private entityService: EntityService;

    namespaceID: any;

    selectFirst = false;

    constructor(app, e) {
        super(app, e);
        this.namespaceID = null;
        this.pushInit();
        this.valuePath = (x: IBucket) => x.bucketID;
        this.itemRenderer = (x: IBucket) => <div>{x.name}</div>;
    }

    async init() {
        this.search = "";
        this.prompt = "Bucket";
        this.render(<div items={
            Bind.oneWayAsync((s, e, cancelToken) =>
                this.searchBuckets(this.search, this.value, cancelToken))}></div>);

        await sleep(10);

        const value = this.value ?? 0;

                let item = null;
        if (value) {
            item = await this.entityService.query(Bucket)
                .where({ value}, (p) => (x) => x.bucketID === p.value)
                .firstOrDefault({ cacheSeconds, cacheVersion });
        }

        if (!item) {
            item = await this.entityService.query(Bucket)
                .orderByDescending((x) => x.bucketID)
                .firstOrDefault();
        }
        this.items = [item];
        if(this.selectFirst) {
            this.selectedItem = item;
        } else {
            this.selectedItem = null;
        }
    }

    async searchBuckets(search: string, value: any, cancelToken: CancelToken) {
        let q = this.entityService.query(Bucket);
        if(search) {
            search = search + "%";
            q = q.where({ search, value },
                (p) =>
                    (x) =>
                        Sql.text.iLike(x.name, p.search)
                        || x.bucketID === p.value
            );
        } else {
            q = q.where({ value },
                (p) =>
                    (x) =>
                        x.bucketID === p.value
            );
        }

        const items = await q.orderByDescending((x) => x.dateCreated)
            .toPage({
                size: 20,
                more: false,
                cacheSeconds,
                cacheVersion,
                cancelToken
            });

        return items.items;
    }
    
}