import Component from '@ember/component';

export default Component.extend({
    extension: "",
    classNames: ["file-extension"],

    didReceiveAttrs: function () {
        let filename = this.get("filename");
        let ext = filename.split(".");
        ext = ext[ext.length - 1].toUpperCase();

        this.set("extension", ext);
    }
});
