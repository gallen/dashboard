const camera = function () {
    let width = 0;
    let height = 0;
    
    const createObjects = function (vdID) {
        const video = document.getElementById(vdID);
        video.id = vdID;
        video.width = width;
        video.width = height;
        video.autoplay = true;
    }
    
    
    return {
        video: null,
        context: null,
    
        startCamera: function (w = 680, h = 480, vdID = 'video') {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                width = w;
                height = h;
    
                createObjects(vdID);
                this.video = document.getElementById(vdID);
                (function (video) {
                    navigator.mediaDevices.getUserMedia({video: true}).then(function (stream) {
                        video.srcObject = stream;
                        video.play();
                    });
                })(this.video)
    
            }
        },
    
    
        takeSnapshot: function () {
            this.context.drawImage(this.video, 0, 0, width, height);
        }
    
    }
    }();
    
    export default camera;