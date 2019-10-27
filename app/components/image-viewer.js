import Component from '@ember/component';
import Axios from 'axios';

export default Component.extend({
    isLoaded: false,
    error: "",

    didRender: function () {
        this._super(...arguments);

        if (!this.get("isLoaded")) {
            let src = this.get("src");
            let _this = this;

            Axios.get(src, {withCredentials: true, responseType:"blob"})
                .then((res) => {
                    let error = res.headers.error;
                    if (error) {
                        if (error == "NO_SESSION") {
                            alert("You have been logged out");
                            location.reload();
                        } else if (error == "FILE_TOO_BIG") {
                            _this.set("isLoaded", true);
                            _this.set("error", "Image size too big");
                        }
                        return;
                    }

                    console.log(res.data);
                    var reader = new window.FileReader();
                    reader.readAsDataURL(res.data); 
                    reader.onload = function () {
                        $("#picture-frame").src = reader.result;
                    }

                    $("#picture-frame").style.display = "none";
                    $("#picture-frame").onload = function () {
                        $("#picture-frame").style.display = "block";

                        $("#picture-frame").style.maxWidth = "581px";
                        $("#picture-frame").style.height = "auto";
                        $("#picture-frame").style.margin = "0 auto";
                        $("#picture-frame").style.border = "1px solid lightgray";
                        _this.set("isLoaded", true);
                    }

                    $("#picture-frame").onerror = function () {
                        _this.set("isLoaded", true);
                        _this.set("error", "Image format not supported");
                    }
                })
        }
    }
});