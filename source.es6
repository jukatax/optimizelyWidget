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
                window.location.search = "optimizely_x=" + variationId + "&optimizely_token=PUBLIC";
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
                if (activeExp.length) {
                        activeExp.map(function (val, ind) {
                                let div = document.createElement("div");
                                let varName = variations[val].name ? variations[val].name : variations[val];
                                div.style = "margin : 0;padding : 5px 0;";
                                div.innerHTML = "Id: <span id=\"test_id\">" + val + "</span>, v: <span id=\"test_name\">" + varName + "</span>, rv:<span id=\"test_version\">" + (optimizely.get('data').revision || optimizely.revision) + "</span>";
                                if (typeof varName === "string") {
                                        document.querySelector("#optimizely_info_data").appendChild(div);
                                }
                        });
                }
                else {
                        document.querySelector("#optimizely_info_data").innerHTML = "No experiment running!";
                }
        }

        setEvents(){
                document.querySelector("#setCookie").addEventListener('click', this.setCookie.bind(this,0.5));
                document.querySelector("#removeCookie").addEventListener('click', this.setCookie.bind(this,-1));
                document.querySelector("#setExperiment").addEventListener('click', this.setExperiment.bind(this,document.getElementById('variationId_yuli').value));
                document.querySelector("#removeWidget").addEventListener('click', this.removeThis.bind(this));
        }

        init() {
                let content = '<div><input type="text" style="margin:0;padding:2px 0;width: auto;" placeholder="cookie name" id="cname_yuli" value="xx_qa" />' +
                                '<button id="setCookie"  style="color : #888;margin : 0; border : 1px solid #555;background : #0f0;">Set</button><button id="removeCookie" style="color : #fff; border : 1px solid #555;background : #f00;">Remove</button></div>' +
                                '<div id="cerror" style="color : #fff; background : #f00;"></div>' +
                                '<div><input style="margin:0;padding:2px 0;width: auto;" type="text" placeholder="variationId" id="variationId_yuli" value="" />' +
                                '<button id="setExperiment" style="color : #888; border : 1px solid #555;background : #0f0;margin : 0">Force Experiment</button></div>' +
                                '<span id="removeWidget" style="padding : 5px 8px; position : absolute; top : 0; right : 0; color : #f00; background : rgba(235,28,36,0.4);cursor : pointer;"> X </span>' +
                                '<div id="optimizely_info_data" style="margin: 2px 0 0;padding : 5px;border : 1px solid #555;border-radius : 3px;">' +
                                '</div>',
                        container_styles = "position : fixed; z-index : 999; top : 10px; left : 10px; padding : 25px; background : rgb(238, 241, 255); border : 1px solid #aaa; border-radius : 3px; box-shadow : 0 0 5px #555; -moz-box-shadow : 0 0 5px #555; -webkit-box-shadow : 0 0 5px #555;";
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
        if (!((window.optimizely && typeof window.optimizely.get === "function") && (typeof window.optimizely.activeExperiments==="object" || window.optimizely.get('state').getVariationMap()))) {
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