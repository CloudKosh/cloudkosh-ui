/* eslint-disable no-console */
import XNode from "@web-atoms/core/dist/core/XNode.js";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import PopupService from "@web-atoms/core/dist/web/services/PopupService.js";

document.body.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const text = target.dataset.copyIcon?.trim();
    if (!text) {
        return;
    }
    navigator.clipboard.writeText(text).then((x) => {

        return PopupService.notify(<div>
            <p text={text}/>
            <p>Copied to clipboard successfully</p>
        </div>);
    }).catch((error) => console.error(error));
});

export default function CopyIcon({ text }) {
    return <i
        class="fa-solid fa-paste"
        data-cursor="pointer"
        data-padding="auto"
        data-copy-icon={text}
        title={`Copy ${text}`}/>;
}