import XNode from "@web-atoms/core/dist/core/XNode.js";
import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp.js";

export default class HomePage extends ContentPage {

    async init() {
        this.renderer = <div>
            Cloud Kosh Home Page
        </div>;
    }
}