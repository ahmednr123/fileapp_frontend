import Controller from '@ember/controller';
import axios from 'axios';

export default Controller.extend({
    isLoaded: false,
    isRoot: true,
    display_path: "/",
    
    directory_stack: [],
    path_stack: [],

    fileList: [],
    selected: false,

    up_directory: {name:"[Parent directory]", path:"..", isDirectory: true},

    prompt: false,

    viewer: false,
    imageViewer: {type:"imageViewer", name:"", src:""},
    textViewer: {type:"textViewer", name:"", src:""},
    customViewer: {},

    init: function () {
        this._super(...arguments);
        this.loadDirectory();
    },

    reInitialize: function () {
        this.set("isLoaded", false);
        this.set("isRoot", true);
        this.set("selected", true);
        this.set("fileList", []);
        this.set("viewer", false);
        this.set("prompt", false);
        this.set("directory_stack", []);
        this.set("path_stack", []);
        this.set("display_path", "/");
    },

    loadDirectory: function (path) {
        let path_uri = "";
        if (path) {
            path_uri = encodeURIComponent(path)
        }
    
        this.set("selected", false);
    
        this.set("isLoaded", false);
        axios.get("http://localhost:8080/FileApp/load?path="+path_uri, {withCredentials: true})
            .then((res) => {
                console.log("HEADERS: ") 
                console.dir(res.headers)
                let json = res.data;
                console.dir(json)
                if (json.reply != false) {
                    this.set("fileList", json);
                    this.set("isLoaded", true);
                } else if (json.error == "NO_SESSION") {
                    this.transitionToRoute("set-key");
                } else if (json.error == "NOT_INITIALIZED") {
                    this.transitionToRoute("encrypt");
                } else if (json.error == "DIRECTORY_NOT_LOADED") {
                    setTimeout(() => {
                        this.loadDirectory();
                    }, 1000)
                }
            })
    },

    actions: {
        parentDirectory: function () {
            let d_stack = this.get("directory_stack");
            let p_stack = this.get("path_stack");
            p_stack.pop();

            let path = p_stack[p_stack.length-1];
            this.loadDirectory(path);
            
            d_stack.pop();
            this.set("display_path", "/" + d_stack.join("/"));

            if (d_stack.length == 0) {
                this.set("isRoot", true);
            }

            this.set("directory_stack", d_stack);
            this.set("path_stack", p_stack);
        },

        closeViewer: function () {
            this.set("viewer", false);
        },

        closePrompt: function () {
            this.set("prompt", false);
        },

        downloadFile: function (fileInfo) {
            console.log("Downloading: " + fileInfo.path);
            window.open(
                'http://localhost:8080/FileApp/download?path='+encodeURIComponent(fileInfo.path)+"&filename="+encodeURIComponent(fileInfo.name),
                '_blank'
            );
        },

        factoryReset: function () {
            if (confirm("Are you sure? All data will be erased!")) {
                this.set("fileList", []);

                let _this = this;
                axios.post("http://localhost:8080/FileApp/reset", "", {withCredentials: true})
                    .then(function () {
                        _this.transitionToRoute("encrypt");
                    })
            }
        },

        selectFile: function (fileInfo) {
            this.set("selected", fileInfo);
        },

        open: function (fileInfo) {
            if (fileInfo.isDirectory)
                changeDirectory(this, fileInfo);
            else 
                openViewer(this, fileInfo);
        },

        useImageViewer: function () {
            this.set("prompt", false);
            let customViewer = this.get("customViewer");
            openImageViewer(this, customViewer.name, customViewer.path);
        }, 

        useTextViewer: function () {
            this.set("prompt", false);
            let customViewer = this.get("customViewer");
            openTextViewer(this, customViewer.name, customViewer.path);
        }
    }
});

function openViewer (_this, fileInfo) {
    let ext = fileInfo.name.split('.');
    ext = ext[ext.length-1];

    console.log(`Filename: ${fileInfo.name}, Extension: ${ext}`);
    let isImage = _global.image_exts.includes(ext);
    let isText = _global.text_exts.includes(ext);
    
    if (isImage) {
        openImageViewer(_this, fileInfo.name, fileInfo.path);
    } else if (isText) {
        openTextViewer(_this, fileInfo.name, fileInfo.path);
    } else {
        _this.set("customViewer", {name:fileInfo.name, path:fileInfo.path});
        _this.set("prompt", "openFile");
    }
}

function openImageViewer (_this, name, path) {
    let imageSrc = "http://localhost:8080/FileApp/view?path="+encodeURIComponent(path);

    _this.set("imageViewer.name", name);
    _this.set("imageViewer.src", imageSrc);

    _this.set("viewer", _this.get("imageViewer"));
}

function openTextViewer (_this, name, path) {

    let src = "http://localhost:8080/FileApp/view?path="+encodeURIComponent(path);

    _this.set("textViewer.name", name);
    _this.set("textViewer.src", src);
    
    _this.set("viewer", _this.get("textViewer"));
}

function changeDirectory (_this, fileInfo) {
    _this.set("isRoot", false);
    _this.set("isLoaded", false);

    _this.loadDirectory(fileInfo.path);

    let d_stack = _this.get("directory_stack");
    let p_stack = _this.get("path_stack");
    d_stack.push(fileInfo.name);
    p_stack.push(fileInfo.path);

    _this.set("display_path", "/" + d_stack.join("/"));
    _this.set("directory_stack", d_stack);
    _this.set("path_stack", p_stack);
}