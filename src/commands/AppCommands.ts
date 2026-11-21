import Command, { Commands } from "@web-atoms/core/dist/core/Command.js";

export default class AppCommands extends Commands {

    static openHome = Command.create({
        route: "/",
        routeOrder: 200,
        openPage: () => import("../pages/home/HomePage.js")
    });

    static buckets = Command.create({
        route: "/ns/{ns}",
        openPage: () => import("../pages/buckets/list/BucketList.js")
    });


    static namespaces = Command.create({
        route: "/namespaces",
        openPage: () => import("../pages/namespaces/list/NamespaceListPage.js")
    });
}