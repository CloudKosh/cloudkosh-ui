import { App } from "@web-atoms/core/dist/App.js";

import "./BusyProgress.local.css";

let container: HTMLDivElement;

let stack = 0;

export default class BusyProgress {

    static install(app: App) {
        app.createBusyIndicator = () => {
            return this.create();
        };
    }

    public static create() {

        if(!container) {
            container = document.createElement("div");
            container.className = "busy-progress-control";
            const progressBar = document.createElement("div");
            progressBar.className = "progress-bar";
            container.appendChild(progressBar);
            const progressBarValue = document.createElement("div");
            progressBarValue.className = "progress-bar-value";
            progressBar.appendChild(progressBarValue);

            document.body.appendChild(container);
        }

        stack++;
        if (stack === 1) {
            container.setAttribute("data-show", "true");
        }
        return {
            [Symbol.dispose]() {
                stack--;
                if (stack <= 0) {
                    container.removeAttribute("data-show");
                }
            }
        };
    }

}
