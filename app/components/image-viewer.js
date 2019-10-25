import Component from '@ember/component';

export default Component.extend({
    isLoaded: false,

    didRender: function () {
        this._super(...arguments);

        if (!this.get("isLoaded")) {
            let _this = this;
            $("#picture-frame").style.display = "none";
            $("#picture-frame").onload = function () {
                $("#picture-frame").style.display = "block";

                $("#picture-frame").style.maxWidth = "580px";
                $("#picture-frame").style.height = "auto";
                $("#picture-frame").style.margin = "0 auto";
                $("#picture-frame").style.border = "1px solid lightgray";
                $("#picture-frame").style.padding = "10px";
                _this.set("isLoaded", true);
            }

            $("#picture-frame").onerror = function () {
                console.log("error loading image");
                alert("Error loading image");
                location.reload();
            }
        }
    }
});