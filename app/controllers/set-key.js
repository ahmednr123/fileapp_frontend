import Controller from '@ember/controller';
import axios from 'axios';

export default Controller.extend({
    key: "",

    actions: {
        setKey: function () {
            let key = this.get("key");
            console.log("key: " + key)

            const params = new URLSearchParams();
            params.append('key', key);
            axios.post("http://localhost:8080/FileApp/load", params, {withCredentials: true})
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
