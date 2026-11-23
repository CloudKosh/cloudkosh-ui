import XNode from "@web-atoms/core/dist/core/XNode.js";
import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp.js";
import { IImportTask, ImportTask } from "../../../model/model.js";
import AtomRepeater from "@web-atoms/web-controls/dist/basic/AtomRepeater.js";
import { AddIconTextButton } from "../../../core/controls/buttons/IconButton.js";
import Action from "@web-atoms/core/dist/view-model/Action.js";
import PageNavigator from "@web-atoms/web-controls/dist/PageNavigator.js";
import ImportPage from "../editor/ImportPage.js";
import InfiniteRepeater from "../../../core/controls/repeater/InfiniteRepeater.js";
import { Inject } from "@web-atoms/core/dist/di/Inject.js";
import EntityService from "../../../core/EntityService.js";
import { Sql } from "../../../core/Sql.js";

export default class ImportListPage extends ContentPage {

    items: IImportTask[] = [];

    version = 1;

    search = "";

    @Inject
    private entityService: EntityService;

    async init() {

        this.renderer = <div>
            <AtomRepeater
                items={this.items}
                { ... InfiniteRepeater.pagedItems((start) =>
                    (c, e, cancelToken) =>
                        this.loadItems({
                            start,
                            search: this.search,
                            _v: this.version,
                            cancelToken
                        })
                )}
                itemRenderer={(item: IImportTask) => <div>
                    <label text={item.namespace?.name ?? item.bucket.namespace?.name}/>
                    <label text={item.bucket?.name}/>
                    <label text={item.status}/>
                </div>}
                />
        </div>;

        this.footerRenderer = () => <footer>
            <AddIconTextButton
                data-click-event="add-item"
                />
        </footer>;
        
    }

    loadItems({ start, search, cancelToken, _v }) {
        let q = this.entityService.query(ImportTask);
        if(search) {
            search = search + "%";
            q = q.where({ search }, (p) =>
                (x) =>
                    Sql.text.iLike(x.namespace.name, p.search)
                    || Sql.text.iLike(x.bucket.name, p.search)
            )
        }
        return q
            .include((x) => [x.namespace, x.bucket.namespace])
            .toPage({
                start,
                size: 50,
                cancelToken
            })
    }

    @Action({ onEvent: "add-item"})
    async addItem() {
        const r = await PageNavigator.pushPageForResult(ImportPage, {});
        this.items.add(r);
    }

}