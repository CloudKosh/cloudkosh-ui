import { Inject } from "@web-atoms/core/dist/di/Inject.js";
import MobileDesktopApp from "@web-atoms/web-controls/dist/desktop-app/MobileDesktopApp.js";
import Command, { Commands } from "@web-atoms/core/dist/core/Command.js";
import { Drawer } from "@web-atoms/web-controls/dist/mobile-app/MobileApp.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import Route from "@web-atoms/core/dist/core/Route.js";

import BusyProgress from "./busy/BusyProgress.js";
import { ModuleInfo } from "../controls/ModuleInfo.js";
import LoginService from "../../services/user/LoginService.js";
import { AppLocation } from "../AppLocation.js";


(Symbol as any).asyncDispose ??= Symbol("asyncDispose");
(Symbol as any).dispose ??= Symbol("dispose");

export default abstract class BaseApp extends MobileDesktopApp {

    protected abstract commands: typeof Commands;

    protected abstract appDrawer: typeof Drawer;

    @Inject
    private userService: LoginService;

    constructor(app, e) {
        super(app, e);
        BusyProgress.install(this.app);
    }

    async init() {

        // PageNavigator.openPage(SplashScreenPage);

        this.commands.install(this);

        // attach upload events..
        // this.resolve(LocalFileService);

        // check if we are logged in...
        const currentUser = await this.userService.getUser();
        if (!currentUser) {
            this.openLoginPage();
            return;
        }

        this.drawerMenu = this.appDrawer;

        if(!Command.invokeRoute()) {

            // check if we are configured...
            this.openDefaultPage();
        }

        if (this.desktopApp) {
            this.desktopApp.statusBarRenderer = () => <div data-layout="row">
                { currentUser.roles?.find((x) => /^admin/i.test(x)) && <a href="/admin" target="_blank">Admin Tools</a> }
                <div title={currentUser.emailAddress} data-layout="row">
                    <i class="fas fa-user fa-xs"/>
                    {currentUser.displayName}
                </div>
                <div data-footer-bar="host" data-flex="stretch-full"/>
                { ... ModuleInfo }
            </div>;
        }

        // await this.resolve(WebPushService).register();
    }

    protected abstract openLoginPage();

    protected abstract openDefaultPage();

}

Route.encodeUrl = (url) => {
    if (url.startsWith("#")) {
        return url;
    }
    if (AppLocation.isLocalTesting) {
        return "#!" + url;
    }
    return url;
};
