import XNode from "@web-atoms/core/dist/core/XNode.js";
import { Drawer } from "@web-atoms/web-controls/dist/mobile-app/MobileApp.js";
import { ExpanderMenu } from "@web-atoms/web-controls/dist/basic/Expander.js";
import MenuItem from "../core/controls/menu/MenuItem.js";
import AppCommands from "../commands/AppCommands.js";

import "./AppDrawer.global.css";

export default class AppDrawer extends Drawer {

    constructor(app, e = document.createElement("drawer-menu")) {
        super(app, e);
    }

    async init() {

        this.renderer = <div>
            <header>CloudKosh</header>
            <section>
                <ExpanderMenu isExpanded={true}>
                    <MenuItem
                        label="Namespaces"
                        />
                    <MenuItem
                        label="List"
                        commandLink={AppCommands.namespaces.displayRoute({})}
                        />
                </ExpanderMenu>
            </section>
        </div>;
        
    }
}