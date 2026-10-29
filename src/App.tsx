import Pack from "@web-atoms/core/dist/Pack.js";
import BaseApp from "./core/base/BaseApp.js";
import AppCommands from "./commands/AppCommands.js";
import AppDrawer from "./drawer/AppDrawer.js";
import PageNavigator from "@web-atoms/web-controls/dist/PageNavigator.js";
import HomePage from "./pages/home/HomePage.js";
import LoginPage from "./pages/user/LoginPage.js";

@Pack
export default class App extends BaseApp {
    commands = AppCommands;
    appDrawer = AppDrawer;

    protected openLoginPage() {
        PageNavigator.openPage(LoginPage);
    }

    protected openDefaultPage() {
        PageNavigator.openPage(HomePage);
    }


}