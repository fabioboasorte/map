var ADMIN = window.ADMIN || {};
ADMIN.mappCapital = window.ADMIN.mappCapital || {};
ADMIN.mappCapital = (function (window, undefined) {

    console.log('admin-map-app-radio-capital', '1.0.0');

    var jsonMarker = {
        mark: false,
        x: false,
        y: false,
        title: false,
        content: false,
        audio: false,
        ck: 1
    };

    var jsonSave = {
        mark: false,
        title: false,
        content: false,
        audio: false,
    };

    var elements = function () {
        var body = document ? document.body : '';
        var main = document ? document.getElementById('main') : '';
        var markers = document ? document.getElementById('markers') : '';
        var edit = document ? document.getElementById('edit') : '';
        var markerHTML = '<div class="pin"></div>';
        var form = {
            title: document ? document.getElementById('title') : '',
            content: document ? document.getElementById('content') : '',
            audio: document ? document.getElementById('audio') : '',
            id: document ? document.getElementById('id') : '',
            mark: document ? document.getElementById('mark') : '',
            submit: document ? document.getElementById('submit') : '',
            del: document ? document.getElementById('del') : '',
            load: document ? document.getElementById('load') : '',
            ck: document ? document.getElementById('ck') : '',
        };
        var list = {
            btnToggle: document ? document.getElementById('openList') : '', 
            main: document ? document.getElementById('list') : '', 
            ul: document ? document.getElementById('listEl') : '', 
            delList: document ? document.getElementsByClassName('delList') : '',
        };
        return {
            body: body,
            main: main,
            edit: edit,
            markers: markers,
            form: form,
            list: list,
            markerHTML: markerHTML
        }
    };

    var setElementEvents = function () {
        var el = elements();
        el.body.addEventListener("click", function(e){
            if(e.target.id=='markers'){
                var x = e.offsetX;
                var y = e.offsetY;
                newMarker(x, y, function(newID){
                    saveMarker();
                });
            }
            if(e.target.className=='pin'){
                var target = e.path[1].id;
                // editMarker(target);
                getOneMarker(target);
                // console.info(target);
            }
        });
        el.form.submit.addEventListener("click", function(e){
            if(!el.form.title.value)
                return false;
            el.form.load.style.display = 'inline-block';
            jsonSave.mark = el.form.mark.value;
            jsonSave.title = el.form.title.value;
            jsonSave.content = el.form.content.value;
            jsonSave.audio = el.form.audio.value;
            // console.log('jsonSave', jsonSave);
            setTimeout(function(){
                saveMarker(jsonSave);
                el.form.load.style.display = 'none';                
            }, 1000);
            return false;
        });
        el.form.del.addEventListener("click", function(e) {
            var mark = el.form.mark.value;
            deleteMarker(mark, function(){
                window.location.reload();
            });
            return false;
        });
        el.list.btnToggle.addEventListener("click", function(e) {
            /*toggle*/
            if(!this.classList.contains('close')){
                this.classList.add('close');
                el.body.classList.add('listModeOn');
                el.list.main.classList.add('show');
            }else{
                this.classList.remove('close');
                el.body.classList.remove('listModeOn');
                el.list.main.classList.remove('show');
                window.location.reload();                
            }
            return false;
        })
    };

    var getListMode = function (json, callback){
        var el = elements();
        var callback = typeof callback == "function" ? callback : function () { };
        var markers = JSON.parse(json);

        // el.list.btnToggle.click(); //temp
        
        for (var index = 0; index < markers.length; index++) {
            var marker = markers[index];
            var title = marker.title;
            var content = '<p>'+marker.content+'</p>';
            var data = '<span>'+marker.data+'</span>';
            var lineBreak = '<br>';
            var del = '<button class="delList">X</button>';
            var html = title + lineBreak + content + data + del;
            var li = document.createElement('li');
            li.id = marker.mark;
            li.innerHTML = html;
            li.addEventListener("click", function (e) {
                // var mark = el.form.mark.value;
                if(e.target.className=='delList'){
                    var mark = e.path[1].id;
                    // this.style.opacity = 0;
                    var target = this.outerHTML;
                    deleteMarker(mark, function(){
                        hiddenMarkerList(mark);
                    });
                }
                return false;
            });
            el.list.ul.appendChild(li);
        }
    };

    var newMarker = function (x, y, callback) {
        var el = elements();
        var callback = typeof callback == "function" ? callback : function () { };
        var rand = Math.floor(Math.random() * 20000000);
        var newID = 'marker_' + rand + '_' + x + '_' + y;
        var div = document.createElement('div');
        div.id = newID;
        div.innerHTML = el.markerHTML;
        div.style.position = 'absolute';
        div.style.top = y + 'px';
        div.style.left = x + 'px';
        el.markers.appendChild(div);
        newMarkerJSON('set', x, y, newID);
        callback(x, y);
    };

    var loadMarkers = function (json, callback) {
        var callback = typeof callback == "function" ? callback : function () { };
        var markers = JSON.parse(json);
        var el = elements();
        // callback(); 
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
    };

    var newMarkerJSON = function (action, x, y, newID) {
        if(action=='set'){
            if(!x&&!y&&!newID)
                return false;
            jsonMarker.mark = newID;
            jsonMarker.x = x;
            jsonMarker.y = y;
            jsonMarker.title = 'Titulo ' + newID;
            jsonMarker.content = 'Texto para ' + newID;
        }
        if(action=='get')
            return jsonMarker;
    };

    var saveMarker = function (data) {
        
        var json = JSON.stringify(newMarkerJSON('get'));
        
        if(data)
            var json = JSON.stringify(data);

        // var encoded = btoa(json);
        ajax('set', json, function(){
            getMarkers(function(){
                clearMarkers();
            });
        });
    };

    var getMarkers = function (callback) {
        ajax('get', '', function(data){
            loadMarkers(data, callback);
            getListMode(data, callback);
        });
    };
    
    var getOneMarker = function(mark) {
        if(!mark)
            return false;

        var el = elements();
        ajax('get', mark, function(data){
            var json = JSON.parse(data);
            json = json[0];
            el.form.title.value = json.title;
            el.form.content.value = json.content;
            el.form.audio.value = json.audio;
            el.form.ck.innerHTML = json.ck;
            el.form.id.value = json.ID;
            el.form.mark.value = json.mark;
            console.log(el.form.ck);
        });
    };

    var clearMarkers = function() {
        var el = elements();
        el.main.innerHTML = '';
        // callback();
    };

    var deleteMarker = function(mark, callback) {
        var callback = typeof callback == "function" ? callback : function () { };
        if (!mark) {
            console.error('Sem marcador para excluir!');
            return false;
        }
        var r = confirm("Certeza que deseja excluir?");
        if (r) {
            ajax('del', mark, function (data) {
                callback();
            });
        }
    };

    var hiddenMarkerList = function (mark) {
        var el = elements();
        var li = el.list.ul.querySelector('#'+mark);
        li.style.opacity = 0;
    };

    var ajax = function (action, data, callback) {
        var callback = typeof callback == "function" ? callback : function () { };
        var rand = Math.floor(Math.random() * 20000000);        

        var files = {
            base: {
                dev: 'http://localhost/capital/mapa/_markers.php',
                qa: '',
                prd: ''
            },
            actions: {
                get: '?action=get&mark=',
                set: '?action=set',
                del: '?action=del&mark='
            }
        };

        var environment = 'dev'; //mudar config em ambiente produtivo
        // console.log(data);
        if(action=='set'){
            var xhr = new XMLHttpRequest();
            var url = files.base[environment] + files.actions.set;
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.send('action=set&json='+data);
            setTimeout(function(){
                callback();
            }, 1000);
        }
        
        if(action=='get'){
            var xhr = new XMLHttpRequest();
            var url = files.base[environment] + files.actions.get + data;
            xhr.overrideMimeType("application/json");
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status == "200") {
                    callback(xhr.responseText);
                }
            }
            xhr.send(null);
        }

        if (action == 'del') {
            var xhr = new XMLHttpRequest();
            var url = files.base[environment] + files.actions.del + data;
            xhr.overrideMimeType("application/json");
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status == "200") {
                    callback(xhr.responseText);
                }
            }
            xhr.send(null);
        }

    };

    return {
        init: function () {
            getMarkers();
            setElementEvents();
        }
    };

})(window);

ADMIN.mappCapital.init();
