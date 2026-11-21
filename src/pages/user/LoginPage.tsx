import XNode from "@web-atoms/core/dist/core/XNode.js";
import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp.js";
import AppForm from "../../core/controls/app-form/AppForm.js";
import FormField from "@web-atoms/web-controls/dist/basic/FormField.js";
import Bind from "@web-atoms/core/dist/core/Bind.js";
import Action from "@web-atoms/core/dist/view-model/Action.js";
import FetchBuilder from "@web-atoms/core/dist/services/FetchBuilder.js";
export default class LoginPage extends ContentPage {

    model = {
        emailAddress: "",
        userID: void 0,
        sessionID: void 0,
        code: ""
    };

    async init() {
        this.renderer = <div>
            <AppForm>
                <FormField
                    label="Email Address"
                    required={true}
                    error={Bind.oneWay(() => /\@/i.test(this.model.emailAddress) ? "" : "Email is required")}>
                    <input type="email" value={Bind.twoWaysImmediate(() => this.model.emailAddress)}/>
                </FormField>
                <FormField label="">
                    <button data-submit-event="do-login">Request Login Code</button>
                </FormField>
            </AppForm>
        </div>;
    }

    @Action({ onEvent: "do-login"})
    async doLogin() {
        const r = await FetchBuilder.post("/api/user")
            .jsonBody(this.model)
            .asJson();

        if(r.userID) {
            // login successful
            location.reload();
            return;
        }

        if(r.sessionID) {
            this.model.sessionID = r.sessionID;
            this.showCodeForm();
            return;
        }
    }

    showCodeForm() {
        this.renderer = <div>
            <p>
                We have sent verification code to your email address, please enter below to login.
                <br/>
                Please check spam folder before requesting code again.
            </p>

            <AppForm>
                <FormField
                    label="Email Address">
                    <span text={this.model.emailAddress}/>
                </FormField>
                <FormField
                    label="Verification Code"
                    required={true}
                    error={Bind.oneWay(() => this.model.code ? "" : "Code is required")}>
                    <input type="tel" value={Bind.twoWaysImmediate(() => this.model.code)}/>
                </FormField>
                <FormField label="">
                    <button data-submit-event="do-login">Login</button>
                </FormField>
            </AppForm>

            <hr style="height:1px"/>

            <p>
                If you haven't received email, resend email again.
            </p>

            <AppForm>
                <FormField label="">
                    <button data-submit-event="do-login">Resend</button>
                </FormField>
            </AppForm>
        </div>;
    }
}