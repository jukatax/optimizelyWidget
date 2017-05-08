class optimizelyWidget {
        constructor() {
                this.domain = document.domain.split('.').length > 2 ? document.domain.split('.')[document.domain.split('.').length - 2] + "." + document.domain.split('.')[document.domain.split('.').length - 1] : document.domain;
                this.bdy = document.body;
        }

        setCookie(exdays) {
                var d = new Date(),
                        cname = document.getElementById("cname_yuli"),
                        cerror = document.getElementById("cerror");
                if (cname && cname.value) {
                        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                        var expires = "expires=" + d.toUTCString();
                        document.cookie = cname.value + "=1;path=/;domain=" + this.domain + ";" + expires;
                        cerror.innerHTML = "Cookie has been Set!";
                        if (exdays == "-1") {
                                document.cookie = "optimizelySegments=0;path=/;domain=" + this.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                document.cookie = "optimizelyBuckets=0;path=/;domain=" + this.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                document.cookie = "optimizelyEndUserId=0;path=/;domain=" + this.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                document.cookie = "optimizelySegments=0;path=/;domain=" + this.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                document.cookie = "optimizelyPendingLogEvents=0;path=/;domain=" + this.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                window.localStorage.clear();
                                window.sessionStorage.clear();
                        }
                } else {
                        cerror.innerHTML = "You need to specify a name for the cookie";
                }
                setTimeout(function () {
                        cerror.innerHTML = "";
                }, 1000);
        }

        removeThis() {
                this.bdy.removeChild(document.getElementById("ccontainer_yuli"));
        }

        setExperiment(variationId) {
                var wls = window.location.search;
                if(/optimizely_x/.test(wls)){
                        window.location.search = wls.replace(/optimizely_x=\d+/ , "optimizely_x="+variationId);
                }else{
                        window.location.search = wls+"&optimizely_x="+variationId;
                }
        }

        getVariations() {
                let variations = {};
                let activeExp = [];
                if (window.optimizely && window.optimizely.variationNamesMap && optimizely.activeExperiments.length) {
                        Object.assign(variations, optimizely.variationNamesMap);
                        activeExp = activeExp.concat(optimizely.activeExperiments);
                }
                if (window.optimizely && window.optimizely.get('state').getVariationMap() && Object.getOwnPropertyNames(window.optimizely.get('state').getVariationMap()).length) {
                        Object.assign(variations, window.optimizely.get('state').getVariationMap());
                        activeExp = activeExp.concat(optimizely.get('state').getActiveExperimentIds());
                }
                var data = optimizely.get('data');
                console.log("Optimizely Experiments: ",data);
                if (activeExp.length) {
                        activeExp.map(function (val, ind) {
                                var experiment = data.experiments[val];
                                var varName = variations[val].name?variations[val].name:variations[val];
                                var divWrap = document.createElement("div");
                                divWrap.innerHTML = "<div id=\"test_id\" style='font-size : 12px;border : 1px solid #a210e7;border-radius : 3px;margin : 0 0 5px;padding : 5px;'>ID: " + val + ",rv:<span id=\"test_version\">" + (optimizely.get('data').revision||optimizely.revision)  + "</span><br />"+experiment.name+" </div>";
                                if(typeof varName==="string"){document.querySelector("#optimizely_info_data").appendChild(divWrap);}

                                experiment.variations.forEach(function(val,ind){
                                        var div = document.createElement("div");
                                        div.style = "margin : 0;padding : 0 0 0 10px;";
                                        var isActive = varName==val.name?true:false;
                                        var styles = 'color:#a210e7;';
                                        div.innerHTML = isActive?"<div style="+styles+"><span id=\"test_name\">" + val.name + "<span style='font-style:italic;font-size:11px;'>(active)</span></div>":"<div><span id=\"test_name\">" + val.name + "</span> - <a href='#' style="+styles+" onclick=\"setExperiment("+val.id+")\">activate</a></div>";
                                        document.querySelector("#test_id").appendChild(div);
                                });
                        });
                }
                else {
                        document.querySelector("#optimizely_info_data").innerHTML = "No experiment running!";
                }
        }

        setEvents(){
                document.querySelector("#setCookie").addEventListener('click', this.setCookie.bind(this,0.5));
                document.querySelector("#removeCookie").addEventListener('click', this.setCookie.bind(this,-1));
                //document.querySelector("#setExperiment").addEventListener('click', this.setExperiment.bind(this,document.getElementById('variationId_yuli').value));
                document.querySelector("#removeWidget").addEventListener('click', this.removeThis.bind(this));
        }

        init() {
                let content = '<div><input type="text" style="margin:0;padding:2px 0;width: auto;" placeholder="cookie name" id="cname_yuli" value="yy_qa" />' +
                    '<button id="setCookie" style="color : #888;margin : 0;font-size: 12px;padding: 2px 10px; border : 1px solid #555;background : #0f0;">Set</button><button id="removeCookie" style="color : #fff;font-size: 12px;padding: 2px 10px; border : 1px solid #555;background : #f00;">Remove</button></div>' +
                    '<div id="cerror" style="color : #fff; background : #f00;"></div>' +
                    '<span style="padding : 5px 8px; position : absolute; top : 0; right : 0; color : #f00; background : rgba(235,28,36,0.4);cursor : pointer;" id="removeWidget"> X </span>' +
                    '<div id="optimizely_info_data" style="margin: 2px 0 0;">' +
                    '</div>',
                        container_styles = "position : fixed; z-index : 99999999; top : 10px;width: auto;min-width: 280px; left : 10px; padding : 5px; background : rgb(238, 241, 255); box-shadow : 0 0 5px #555; -moz-box-shadow : 0 0 5px #555; -webkit-box-shadow : 0 0 5px #555;";
                let div = document.createElement("div");
                div.id = "ccontainer_yuli";
                div.style = container_styles;
                div.innerHTML = content;
                this.bdy.appendChild(div);
                document.querySelector("#ccontainer_yuli").setAttribute("style", container_styles);
                this.getVariations();
                this.setEvents();
        }
}
let newWidget = new optimizelyWidget();
let start = 0;

let poll4elems = (frame)=> {
        if (!((document.body && window.optimizely && typeof window.optimizely.get === "function") && (typeof window.optimizely.activeExperiments==="object" || window.optimizely.get('state').getVariationMap()))) {
                if (!start) {
                        start = frame;
                }
                if (frame - start < 4000) {
                        requestAnimationFrame(poll4elems);
                } else {
                        console.log("Optimizely NOT running on this page - aborting widget ... ");
                        return;
                }
        }
        else {
                newWidget.init();
        }
};
requestAnimationFrame(poll4elems);