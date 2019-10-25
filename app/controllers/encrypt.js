import Controller from '@ember/controller';
import axios from 'axios';

export default Controller.extend({
    path: "C:\\Users\\inc-611\\Documents\\cloud-test",
    key: "",

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
                        this.transitionToRoute("index");
                    }
                });
        }
    }
});