import DISingleton from "@web-atoms/core/dist/di/DISingleton.js";
import BaseEntityService from "@web-atoms/entity/dist/services/BaseEntityService.js";
import { QueryProcessor } from "@web-atoms/entity/dist/services/QueryProcessor.js";
import BusyProgress from "./base/busy/BusyProgress.js";


@DISingleton()
export default class EntityService extends BaseEntityService {

    public queryProcessor: QueryProcessor = "JavaScript";

    public url: string = "/api/entity/";

    postPageReady() {
        setTimeout(() =>
            this.runAfterEnd(
                () => (window as any).pageReady = true
            ),
        100);
    }

    protected createBusyIndicator(hideActivityIndicator) {
        if (hideActivityIndicator) {
            return {
                [Symbol.dispose]() {
                    // do nothing
                }
            };
        }
        return BusyProgress.create();
    }

}
