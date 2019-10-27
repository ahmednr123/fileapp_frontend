import Component from '@ember/component';
import axios from 'axios';

export default Component.extend({
    isLoaded: false,
    data: "",
    error: "",

    didReceiveAttrs: function () {
        let src = this.get("src");
        let _this = this;
        axios.get(src, {withCredentials: true, responseType:"stream", transformResponse: res => res})
            .then((res) => {
                let error = res.headers.error;
                
                _this.set("isLoaded", true);
                
                if (error) {
                    if (error == "NO_SESSION") {
                        alert("You have been logged out");
                        location.reload();
                    } else if (error == "FILE_TOO_BIG") {
                        _this.set("error", "File size too big");
                    }
                    return;
                }

                _this.set("data", res.data);
            })
    }
});
