import XNode from "@web-atoms/core/dist/core/XNode.js";
import { Drawer } from "@web-atoms/web-controls/dist/mobile-app/MobileApp.js";

export default class AppDrawer extends Drawer {

    async init() {

        this.renderer = <div></div>;
        
    }
}