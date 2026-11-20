import XNode from "@web-atoms/core/dist/core/XNode.js";
import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp.js";
import AppForm from "../../core/controls/app-form/AppForm.js";
import FormField from "@web-atoms/web-controls/dist/basic/FormField.js";

export default class LoginPage extends ContentPage {

    model = {
        emailAddress: ""
    };

    async init() {
        this.renderer = <div>
            <AppForm>
                <FormField label="Email Address">
                    <input type="email" value={}/>
                </FormField>
            </AppForm>
        </div>;
    }
}