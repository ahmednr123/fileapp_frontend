import Controller from '@ember/controller';
import axios from 'axios';

export default Controller.extend({
    isLoaded: false,

    path: "C:\\Users\\inc-611\\Documents\\cloud-test",
    key: "",

    indexController: Ember.inject.controller('index'),

    init: function () {
        this._super(...arguments);
        
        let _this = this;
        axios.get("http://localhost:8080/FileApp/session", {withCredentials: true})
            .then((res) => {
                let json = res.data;
                console.log(json);
                if (json.reply == true) {
                    _this.transitionToRoute("index");
                } else {
                    _this.set("isLoaded", true);
                }
            })
    },

    actions: {
        encrypt: function () {
            let path = this.get("path");
            let key = this.get("key");
            console.log("key: " + key)

            const params = new URLSearchParams();
            params.append('path', path);
            params.append('key', key);
            axios.post("http://localhost:8080/FileApp/initialize", params, {withCredentials: true})
                .then((res) => {
                    console.log(res.data);
                    let json = res.data;
                    if (json.reply != false) {
                        this.indexController.loadDirectory();
                        this.transitionToRoute("index");
                    }
                });
        }
    }
});