import XNode from "@web-atoms/core/dist/core/XNode.js";

import "./MenuItem.global.css";

export default function MenuItem ({
    label,
    icon = void 0 as string,
    click = undefined,
    title = label,
    description = void 0 as string,
    href = "",
    commandLink = "",
    target = undefined as string,
    bell = void 0,
    bellTitle = void 0,
    bellClick = void 0,
    ... a
}) {

    return href || commandLink
    ? <a data-layout="menu-item"
        data-text-decoration="none"
        title={title}
        data-click-event={ commandLink ? "route" : void 0}
        href={href || commandLink}
        target={target}
        draggable={false}
        event-click={click}
        { ... a}>
        { icon && <i class={icon}/> }
        <span text={label}/>
        { description && <small text={description}/>}
        { bell !== void 0 && <i
            data-element="badge"
            title={bellTitle}
            class={bell ? "fad fa-bell" : "fad fa-bell-slash"}
            { ...  typeof bellClick === "string" ? {
                "data-click-event": bellClick
            } : {
                "data-click-event" : "none",
                "event-click": bellClick
            }}
            />}
    </a>
    : <div
        title={title}
        data-layout="menu-item"
        event-click={click}
        { ... a}>
        { icon && <i class={icon}/> }
        <span text={label}/>
        { description && <small text={description}/>}
        { bell !== void 0 && <i data-click-event={bellClick}
            data-element="badge"
            title={bellTitle}
            class={bell ? "fad fa-bell" : "fad fa-bell-slash"}/>}
    </div>;
}