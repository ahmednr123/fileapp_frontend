import Controller from '@ember/controller';
import axios from 'axios';

export default Controller.extend({
    isLoaded: false,
    isRoot: true,
    display_path: "/",
    
    directory_stack: [],
    path_stack: [],

    fileList: [],

    imageViewer: {active:false, name:"", src:""},

    init: function () {
        this._super(...arguments);
        loadDirectory(this);
    },

    actions: {
        fileClick: function (fileInfo) {
            if (fileInfo.isDirectory)
                changeDirectory(this, fileInfo);
            else 
                openViewer(this, fileInfo);
        },

        parentDirectory: function () {
            let d_stack = this.get("directory_stack");
            let p_stack = this.get("path_stack");
            p_stack.pop();

            let path = p_stack[p_stack.length-1];
            loadDirectory(this, path);
            
            d_stack.pop();
            this.set("display_path", "/" + d_stack.join("/"));

            if (d_stack.length == 0) {
                this.set("isRoot", true);
            }

            this.set("directory_stack", d_stack);
            this.set("path_stack", p_stack);
        },

        closeViewer: function () {
            this.set("imageViewer.active", false);
        },

        downloadFile: function (fileInfo) {
            console.log("Downloading: " + fileInfo.path);
            window.open(
                'http://localhost:8080/FileApp/download?path='+encodeURIComponent(fileInfo.path)+"&filename="+encodeURIComponent(fileInfo.name),
                '_blank'
            );
        },

        factoryReset: function () {
            let _this = this;
            axios.post("http://localhost:8080/FileApp/reset", "")
                .then(function () {
                    _this.transitionToRoute("encrypt");
                })
        }
    }
});

function openViewer (_this, fileInfo) {
    let ext = fileInfo.name.split('.');
    ext = ext[ext.length-1];

    console.log(`Filename: ${fileInfo.name}, Extension: ${ext}`);
    let isImage = _global.image_exts.includes(ext);
    
    if (isImage) {
        let imageSrc = "http://localhost:8080/FileApp/view?path="+encodeURIComponent(fileInfo.path);

        _this.set("imageViewer.name", fileInfo.name);
        _this.set("imageViewer.src", imageSrc);
        _this.set("imageViewer.active", true);
    }
}

function changeDirectory (_this, fileInfo) {
    _this.set("isRoot", false);
    _this.set("isLoaded", false);

    loadDirectory(_this, fileInfo.path);

    let d_stack = _this.get("directory_stack");
    let p_stack = _this.get("path_stack");
    d_stack.push(fileInfo.name);
    p_stack.push(fileInfo.path);

    _this.set("display_path", "/" + d_stack.join("/"));
    _this.set("directory_stack", d_stack);
    _this.set("path_stack", p_stack);
}

function loadDirectory (_this, path) {
    let path_uri = "";
    if (path) {
        path_uri = encodeURIComponent(path)
    }

    _this.set("isLoaded", false);
    axios.get("http://localhost:8080/FileApp/load?path="+path_uri, {withCredentials: true})
        .then((res) => {
            console.log(res.data);
            let json = res.data;
            if (json.reply != false) {
                _this.set("isLoaded", true);
                _this.set("fileList", json);
            } else if (json.error == "NO_SESSION") {
                _this.transitionToRoute("set-key");
            } else if (json.error == "NOT_INITIALIZED") {
                _this.transitionToRoute("encrypt");
            } else if (json.error == "DIRECTORY_NOT_LOADED") {
                setTimeout(() => {
                    loadDirectory(_this);
                }, 1000)
            }
        })
}