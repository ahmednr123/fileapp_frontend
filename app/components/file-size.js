import Component from '@ember/component';

export default Component.extend({
    size_string: "",
    tagName: "span",

    didReceiveAttrs: function () {
        let size = this.get("size");
        this.set("size_string", this.getSizeString(size));
    },

    getSizeString: (size) => {
        if (size == undefined || size < 0) return "";

        let sizes = ["B","KB","MB","GB","TB"];
        let index = 0;

        while ((size/1024) >= 1) {
            size = size/1024;
            index++;
        }

        let decimals = (size * 100)%100;
        let size_float = (decimals < 1)?parseInt(size):size.toFixed(2);
        let size_str = size_float + " " + sizes[index];

        return size_str;
    }
});
