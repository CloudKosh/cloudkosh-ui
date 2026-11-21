/* eslint-disable no-console */
import Bind from "@web-atoms/core/dist/core/Bind.js";
import { CancelToken } from "@web-atoms/core/dist/core/types.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import AtomRepeater from "@web-atoms/web-controls/dist/basic/AtomRepeater.js";

const loadMoreSet = Symbol("loadMoreSet");

import "./InfiniteRepeater.global.css";

export interface IAnyPagedItems {
    items: any[];
    total: number;
}

export interface IInfiniteRepeater extends AtomRepeater {
    pagedItems: IAnyPagedItems;
    [loadMoreSet]: CancelToken;
    start: number;
}

const pagedItemsSetter = AtomControl.registerProperty("paged-items", "paged-items",
(control: IInfiniteRepeater, element, value) => {
    if (value && value.items) {
        let cancelToken = control[loadMoreSet];
        control.footerRenderer ??= () => <div data-load-more="load-more" data-click-event="load-more-items"><span text="Load more ... "/></div>;
        control.headerRenderer ??= () => <div class="scroll-header" style-height="1px" style-width="100%"/>;
        if (!cancelToken) {
            control[loadMoreSet] = cancelToken = new CancelToken();
            control.bindEvent(control.element, "loadMoreItems", (e: any) => {
                const ce = new CustomEvent("moreItems", {
                    detail: {
                        pagedItems: control.pagedItems,
                        cancelToken
                    },
                    bubbles: false
                });
                control.element.dispatchEvent(ce);
            });
        } else {
            cancelToken.cancel();
            control[loadMoreSet] = cancelToken = new CancelToken();
        }
        const items = control.items;
        if (items && Array.isArray(items)) {
            items.clear();
            items.addAll(value.items);
        } else {
            control.items = value.items;
        }

        const autoScroll = control.element.getAttribute("data-auto-scroll") !== "false";

        if (autoScroll) {
            setTimeout(() => {
                const ce = control.element?.firstElementChild as HTMLElement;
                const scrollX = window.scrollX;
                const scrollY = window.scrollY;
                ce?.scrollIntoView();
                setTimeout(() => {
                    window.scrollTo(scrollX, scrollY);
                }, 100);
            }, 100);
        }

        control.footer = value.more || (value.total && value.items && value.items.length < value.total);
        (control as any).pagedItems = value;
    }
});

export type RepeaterLoader = (start: number) => (control: AtomRepeater, element: HTMLElement, cancelToken: CancelToken) => any;

export default class InfiniteRepeater {

    public static pagedItems = (start: RepeaterLoader) => {
        const setter = start(0);
        const setters = pagedItemsSetter(Bind.oneWayAsync(setter)) as any;
        setters["event-more-items"] = Bind.event(async (s: AtomRepeater, e) => {
            const st = s.items?.length ?? 0;
            if (!st) {
                return;
            }
            const cancelToken = s[loadMoreSet];
            const loader = start(st);
            const results = await loader(s, e.target as any, cancelToken);
            const beforeAdd = new CustomEvent("beforeAdd", { detail: results.items, bubbles: true, cancelable: true });
            s.element.dispatchEvent(beforeAdd);
            s.footer = (results.more || results.total) && results.items.length > 0;
            if(beforeAdd.defaultPrevented) {
                return;
            }
            s.items.addAll(results.items);
            const afterAdd = new CustomEvent("afterAdd", { detail: results.items, bubbles: true });
            s.element.dispatchEvent(afterAdd);
        });
        // setters["event-items-updated"] = scrollToBottom;
        return setters;
    };

}
