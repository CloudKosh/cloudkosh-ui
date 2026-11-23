import { Inject } from "@web-atoms/core/dist/di/Inject.js";
import DropDown from "@web-atoms/web-controls/dist/basic/DropDown.js";
import EntityService from "../../EntityService.js";
import { INamespace, Namespace } from "../../../model/model.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import Bind from "@web-atoms/core/dist/core/Bind.js";
import sleep from "../../sleep.js";
import { CacheTTL } from "../../CacheTTL.js";
import { CancelToken } from "@web-atoms/core/dist/core/types.js";
import { Sql } from "../../Sql.js";

const cacheSeconds = CacheTTL.seconds.oneDay;
const cacheVersion = "v1";

export default class NamespaceDropDown extends DropDown {

    @Inject
    private entityService: EntityService;

    constructor(app, e) {
        super(app, e);
        this.pushInit();
        this.valuePath = (x: INamespace) => x.id;
        this.itemRenderer = (x: INamespace) => <div>{x.name}</div>;
    }

    async init() {
        this.search = "";
        this.prompt = "Namespace";
        this.render(<div items={
            Bind.oneWayAsync((s, e, cancelToken) =>
                this.searchNamespaces(this.search, this.value, cancelToken))}></div>);

        await sleep(10);

        const value = this.value ?? 0;

                let item = null;
        if (value) {
            item = await this.entityService.query(Namespace)
                .where({ value}, (p) => (x) => x.id === p.value)
                .firstOrDefault({ cacheSeconds, cacheVersion });
        }

        if (!item) {
            item = await this.entityService.query(Namespace)
                .orderByDescending((x) => x.id)
                .firstOrDefault();
        }
        this.items = [item];
        this.selectedItem = item;
    }

    async searchNamespaces(search: string, value: any, cancelToken: CancelToken) {
        let q = this.entityService.query(Namespace);
        if(search) {
            search = search + "%";
            q = q.where({ search, value },
                (p) =>
                    (x) =>
                        Sql.text.iLike(x.name, p.search)
                        || Sql.text.iLike(x.description, p.search)
                        || x.id === p.value
            );
        } else {
            q = q.where({ value },
                (p) =>
                    (x) =>
                        x.id === p.value
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