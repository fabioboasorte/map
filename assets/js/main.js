var VIEW = window.VIEW || {};
VIEW.mappCapital = window.VIEW.mappCapital || {};
VIEW.mappCapital = (function (window, undefined) {

    console.log('view-map-app-radio-capital', '1.1.0', 'fix-viewport-responsive');

    var jsonMarker = {
        mark: false,
        x: false,
        y: false,
        title: false,
        content: false,
        audio: false,
        ck: 1
    };

    var elements = function () {
        var html = document ? document.documentElement : '';
        var body = document ? document.body : '';
        var main = document ? document.getElementById('main') : '';
        var markers = document ? document.getElementById('markers') : '';
        var markerHTML = '<div class="pin"></div>';
        var modal = {
            main: document ? document.getElementById('modal') : '',
            close: document ? document.getElementById('close') : '',
            list: document ? document.getElementById('play').getElementsByTagName("li") : '',
            audio: document ? document.getElementsByTagName('audio')[0] : '',
            source: document ? document.getElementsByTagName('source')[0] : '',
        };
        return {
            html: html,
            body: body,
            main: main,
            markers: markers,
            modal: modal,
            markerHTML: markerHTML
        }
    };
    
    var setChangeViewportMeta = function() {
        var viewportmeta = document.querySelector('meta[name="viewport"]');
        viewportmeta.setAttribute('content', 'user-scalable=yes, initial-scale=1, maximum-scale=1.3, width=device-width');
        
        if (document.body.offsetWidth <= 320) {
            return viewportmeta.setAttribute('content', 'user-scalable=yes, initial-scale=0.63, maximum-scale=1.3, width=480');
        } else if (document.body.offsetWidth <= 480) {
            return viewportmeta.setAttribute('content', 'user-scalable=yes, initial-scale=0.89, maximum-scale=1.3, width=480');
        } else if (document.body.offsetWidth <= 768) {
            return viewportmeta.setAttribute('content', 'user-scalable=yes, initial-scale=0.8, maximum-scale=1.3, width=920');
        } else if (document.body.offsetWidth <= 1024) {
            return viewportmeta.setAttribute('content', 'user-scalable=yes, initial-scale=0.85, maximum-scale=1.3, width=920');
        }
    };

    var setElementEvents = function () {
        var el = elements();
        el.body.addEventListener("click", function (e) {
            // console.log(e);
            if (e.target.className == 'pin') {

                el.html.style.overflow = 'hidden';
                el.body.style.overflow = 'hidden';
                el.modal.main.style.width = window.outerWidth + 'px';
                el.modal.main.style.height = window.outerHeight + 'px';
                
                var target = e.path[1].id;
                getOneMarker(target, function(){
                    el.modal.list[1].innerHTML = jsonMarker.title;
                    el.modal.list[2].innerHTML = jsonMarker.content;
                    el.modal.source.src = jsonMarker.audio;
                    el.modal.main.classList.add('show');
                    /*player*/
                    audioControl('load');
                    audioControl('play');

                    ajax('ck', target, false);
                });
            }
            if (e.target.id == 'modal') {
                el.modal.close.click();
            }
        });
        el.modal.close.addEventListener("click", function(){
            el.html.style.overflow = 'auto';
            el.body.style.overflow = 'auto';
            audioControl('stop');
            el.modal.main.classList.remove('show');
            return false;
        });
        window.addEventListener("resize", function(){
            el.modal.close.click();
        });
    };

    var loadMarkers = function (json, callback) {
        var callback = typeof callback == "function" ? callback : function () { };
        var markers = JSON.parse(json);
        var el = elements();
        for (var index = 0; index < markers.length; index++) {
            var marker = markers[index];
            var div = document.createElement('div');
            div.id = marker.mark;
            div.innerHTML = el.markerHTML;
            div.style.position = 'absolute';
            div.style.top = marker.y + 'px';
            div.style.left = marker.x + 'px';
            el.markers.appendChild(div);
        }
        callback(); //setEvent
    };

    var getMarkers = function (callback) {
        ajax('get', '', function (data) {
            loadMarkers(data, callback);
        });
    };

    var getOneMarker = function (mark, callback) {
        var callback = typeof callback == "function" ? callback : function () { };
        
        if (!mark)
            return false;

        var el = elements();
        ajax('get', mark, function (data) {
            var json = JSON.parse(data);
            json = json[0];
            jsonMarker.mark = json.mark;
            jsonMarker.x = json.x;
            jsonMarker.y = json.y;
            jsonMarker.title = json.title;
            jsonMarker.content = json.content;
            jsonMarker.audio = json.audio;
            jsonMarker.ck = json.ck;
            callback();
        });
    };

    var audioControl = function (action) {
        var el = elements();
        switch (action) {
            case 'load':
                el.modal.audio.load();
                break;
            case 'play':
                setTimeout(function(){
                    el.modal.audio.play();
                }, 500);
                break;
            case 'stop':
                el.modal.audio.pause();
                el.modal.source.src = '';
                break;
        }
    };

    var ajax = function (action, data, callback) {
        var callback = typeof callback == "function" ? callback : function () { };
        
        var files = {
            base: {
                dev: 'http://capital-map.local/_markers.php',
                qa: '',
                prd: ''
            },
            actions: {
                get: '?action=getView&mark=',
                ck: '?action=click&mark=',
            }
        };

        var environment = 'dev'; //mudar config em ambiente produtivo

        switch (action) {
            case 'get':
                var url = files.base[environment] + files.actions.get + data;
                break;
            case 'ck':
                var url = files.base[environment] + files.actions.ck + data;
                break;
        };

        if(!url)
            return false;
        
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status == "200") {
                callback(xhr.responseText);
            }
        }
        xhr.send(null);
    };

    return {
        init: function () {
            getMarkers(setElementEvents);
        }
    };

})(window);

VIEW.mappCapital.init();
