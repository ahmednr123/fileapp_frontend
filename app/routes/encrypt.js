import Route from '@ember/routing/route';
import axios from 'axios';

export default Route.extend({
    init: function () {
        axios.get("http://localhost:8080/FileApp/session")
            .then((res) => {
                let json = res.data;
                if (json.reply == true) {
                    this.transitionToRoute("index");
                }
            })
    }
});