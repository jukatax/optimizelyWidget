class optimizelyWidget {
        constructor() {
                this.domain = document.domain.split('.').length > 2 ? document.domain.split('.')[document.domain.split('.').length - 2] + "." + document.domain.split('.')[document.domain.split('.').length - 1] : document.domain;
                this.bdy = document.body;
                this.bckgrnd_clr = '#f4f7f1';
                this.main_clr = '#19405b';
                this.active_clr = '#3778ad';
                this.font_size = '12px';
        }

        setCookie(exdays) {
                let vm = this;
                var d = new Date(),
                        cname = document.getElementById("cname_yuli"),
                        cerror = document.getElementById("cerror");
                if (cname && cname.value) {
                        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                        var expires = "expires=" + d.toUTCString();
                        document.cookie = cname.value + "=1;path=/;domain=" + this.domain + ";" + expires;
                        cerror.innerHTML = "Cookie has been Set!";
                        if (exdays == -1 || exdays == '-1') {
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
                        if( (exdays != -1 && !window.location.search) || (exdays != -1 && !window.location.search.match(cname.value+"=true")) ){vm.setExperiment("&"+cname.value+"=1");}
                        else if( exdays == -1 && window.location.search && window.location.search.match(cname.value+"=1")){window.location.search = window.location.search.replace(cname.value+"=1" , "");}
                }, 1000);
        }

        removeThis() {
                this.bdy.removeChild(document.getElementById("ccontainer_yuli"));
        }

        setExperiment(variationId) {
                var wls = window.location.search;
                if(Boolean(wls) && /optimizely_x/.test(wls) ){
                        window.location.search = wls.replace(/optimizely_x=(\d+)?/ , "optimizely_x="+variationId);
                }else if(Boolean(wls) && /\?/.test(wls)){
                        window.location.search = wls+"&optimizely_x="+variationId;
                }else{
                        window.location.search = "optimizely_x="+variationId;
                }
        }

        getVariations() {
                let variations = {};
                let activeExp = [];
                if (window.optimizely && window.optimizely.variationNamesMap && optimizely.activeExperiments.length) {
                        if(typeof Object.assign === "function"){Object.assign(variations,optimizely.variationNamesMap);}
                        else{variations = JSON.parse(JSON.stringify(optimizely.variationNamesMap));}
                        activeExp = activeExp.concat(optimizely.activeExperiments);
                }
                if (window.optimizely && window.optimizely.get('state').getVariationMap() && Object.getOwnPropertyNames(window.optimizely.get('state').getVariationMap()).length) {
                        if(typeof Object.assign === "function"){Object.assign(variations,window.optimizely.get('state').getVariationMap());}
                        else{variations = JSON.parse(JSON.stringify(window.optimizely.get('state').getVariationMap()));}
                        activeExp = activeExp.concat(optimizely.get('state').getActiveExperimentIds());
                }
                var data = optimizely.get('data');
                console.log("Optimizely Experiments: ",data);
                if (activeExp.length) {
                        let vm = this;
                        activeExp.map(function (val, ind) {
                                var experiment = data.experiments[val];
                                var varName = variations[val].name?variations[val].name:variations[val];
                                var divWrap = document.createElement("div");
                                divWrap.innerHTML = "<div id=\"test_id_"+ind+"\" style='font-size : "+vm.font_size+";border : 1px solid "+vm.main_clr+";border-radius : 3px;margin : 0 0 5px;padding : 5px;'>ID: " + val + ",rv:<span id=\"test_version\">" + (optimizely.get('data').revision||optimizely.revision)  + "</span><br />"+experiment.name+" </div>";
                                if(typeof varName==="string"){document.querySelector("#optimizely_info_data").appendChild(divWrap);}

                                experiment.variations.forEach(function(val,indx){
                                        var div = document.createElement("div");
                                        div.style = "margin : 0;padding : 0 0 0 10px;";
                                        var isActive = varName==val.name?true:false;
                                        var styles = 'color:'+vm.active_clr+';';
                                        div.innerHTML = isActive?"<div style="+styles+"><span id=\"test_name\">" + val.name + " - " + val.id +  "<span style='font-style:italic;font-size:'+vm.font_size+';'>(active)</span></div>":"<div><span id=\"test_name\">" + val.name + " - " + val.id +  "</span> - <a href='#' style="+styles+" onclick=\"setExperiment("+val.id+")\">activate</a></div>";
                                        document.querySelector("#test_id_"+ind).appendChild(div);
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
                document.querySelector("#removeWidget").addEventListener('click', this.removeThis.bind(this));
        }

        init() {
                let content = '<div><input type="text" style="margin:0;padding:2px 0;width: auto;display: inline-block;font-size: '+this.font_size+';height : 25px;line-height : 14px;" placeholder="cookie name" id="cname_yuli" value="yy_qa" />' +
                        '<button id="setCookie"  style="color : #eee;width: auto;display: inline-block;float : none; height: auto;line-height: 14px;margin : 0;font-size: '+this.font_size+';padding: 3px 10px; border : 1px solid '+this.main_clr+';background : '+this.active_clr+';">Set</button><button id="removeCookie"  style="color : #fff;width: auto;display: inline-block;float : none; height: auto;line-height: 14px;margin : 0;font-size: '+this.font_size+';padding: 3px 10px; border : 1px solid '+this.main_clr+';background : #f00;">Remove</button></div>' +
                        '<div id="cerror" style="color : #fff; background : #f00;"></div>' +
                        '<span id="removeWidget" style="padding : 5px 8px; position : absolute; top : 0; right : 0; color : #f00; background : rgba(235,28,36,0.4);cursor : pointer;" > X </span>' +
                        '<div id="optimizely_info_data" style="margin: 2px 0 0;">' +
                        '</div>',
                        container_styles = "position : fixed; z-index : 999999999; top : 10px;width: auto;min-width: 280px; left : 10px; padding : 5px; background : "+this.bckgrnd_clr+"; box-shadow : 0 0 5px #555; -moz-box-shadow : 0 0 5px #555; -webkit-box-shadow : 0 0 5px #555;color : "+this.main_clr+";";
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