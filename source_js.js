/**
 * Optimizely X widget
 * Created by YYordanov on 11/03/17.
 * v3.7
 */
/*  @url params to force an experiment
 ?optimizely_x=VARIATIONID&optimizely_token=PUBLIC
 ?optimizely_force_tracking=true
 */
/*
In order for thr log to work this script has to be injected before the call to Optimizely, in Tampermonkey set the script to be injected at "document start"
 */
window.optimizely = window.optimizely || [];
window.optimizely.push({
        type: 'log',
        level: 'error'
});
/* @level : string
 off : no messages
 error : only errors (i.e. unexpected conditions that might cause the snippet to run improperly)
 warn : unusual conditions that might indicate a misconfiguration
 info: Recommended when you're trying to identify what's running and what's not.
 debug: May be useful if you're trying to identify why something is or isn't running.
 all : all messages, including detailed debugging information (intended for developers)
 */
/* Color scheme : */
    var bckgrnd_clr = '#f4f7f1',
        main_clr = '#19405b',
        active_clr = '#3778ad',
        font_size = '12px';
    var start = 0;
    var domain = document.domain.split('.').length>2?document.domain.split('.')[document.domain.split('.').length-2]+"."+document.domain.split('.')[document.domain.split('.').length-1] : document.domain;
    function poll4elems(frame){
        if(!((document.body && window.optimizely && typeof window.optimizely.get === "function") && (typeof window.optimizely.activeExperiments==="object" || window.optimizely.get('state').getVariationMap()))){
            if(!start){start=frame;}
            if(frame-start<4000){
                requestAnimationFrame(poll4elems);
            }else{
                console.log("Optimizely NOT running on this page - aborting widget poll... ");
                return;
            }
        }
        else{
            optimizelyWidget();
        }
    }
    requestAnimationFrame(poll4elems);
    function optimizelyWidget(){
        var content = '<div><input type="text" style="margin:0;padding:2px 0;width: auto;font-size: '+font_size+';height : 25px;line-height : 14px;" placeholder="cookie name" id="cname_yuli" value="yy_qa" />' +
            '<button onclick="setCookie(0.5)" style="color : #eee;margin : 0;font-size: 12px;padding: 3px 10px; border : 1px solid '+main_clr+';background : '+active_clr+';">Set</button><button onclick="setCookie(-1)" style="color : #fff;font-size: 12px;padding: 3px 10px; border : 1px solid '+main_clr+';background : #f00;">Remove</button></div>' +
            '<div id="cerror" style="color : #fff; background : #f00;"></div>' +
            '<span style="padding : 5px 8px; position : absolute; top : 0; right : 0; color : #f00; background : rgba(235,28,36,0.4);cursor : pointer;" onclick="removeThis()"> X </span>' +
            '<div id="optimizely_info_data" style="margin: 2px 0 0;">' +
            '</div>';
        var bdy = document.body;
        window.setCookie = function (exdays) {
            var d = new Date(),
                cname = document.getElementById("cname_yuli"),
                cerror = document.getElementById("cerror");
            if (cname && cname.value) {
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toUTCString();
                document.cookie = cname.value + "=1;path=/;domain="+domain+";" + expires;
                cerror.innerHTML = "Cookie has been Set!";
                if (exdays == "-1") {
                    document.cookie = "optimizelySegments=0;path=/;domain="+domain+";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                    document.cookie = "optimizelyBuckets=0;path=/;domain="+domain+";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                    document.cookie = "optimizelyEndUserId=0;path=/;domain="+domain+";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                    document.cookie = "optimizelySegments=0;path=/;domain="+domain+";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                    document.cookie = "optimizelyPendingLogEvents=0;path=/;domain="+domain+";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                    window.localStorage.clear();
                    window.sessionStorage.clear();
                }
            } else {
                cerror.innerHTML = "You need to specify a name for the cookie";
            }
            setTimeout(function () {
                cerror.innerHTML = "";
            }, 1000);
        };
        window.removeThis = function () {
            bdy.removeChild(document.getElementById("ccontainer_yuli"));
        };
        window.setExperiment = function(variationId){
            var wls = window.location.search;
            if(/optimizely_x/.test(wls)){
                window.location.search = wls.replace(/optimizely_x=\d+/ , "optimizely_x="+variationId);
            }else{
                window.location.search = wls+"&optimizely_x="+variationId;
            }
        };
        var container_styles = "position : fixed; z-index : 999999999; top : 10px;width: auto;min-width: 280px; left : 10px; padding : 5px; background : "+bckgrnd_clr+"; box-shadow : 0 0 5px #555; -moz-box-shadow : 0 0 5px #555; -webkit-box-shadow : 0 0 5px #555;color: "+main_clr+";";
        var div = document.createElement("div");
        div.id = "ccontainer_yuli";
        div.style = container_styles;
        div.innerHTML = content;
        bdy.appendChild(div);
        document.querySelector("#ccontainer_yuli").setAttribute("style", container_styles);
        var variations = {};
        var activeExp = [];
        if (window.optimizely && window.optimizely.variationNamesMap && optimizely.activeExperiments.length) {
            Object.assign(variations,optimizely.variationNamesMap);
            activeExp = activeExp.concat(optimizely.activeExperiments);
        }
        if (window.optimizely && window.optimizely.get('state').getVariationMap() && Object.getOwnPropertyNames(window.optimizely.get('state').getVariationMap()).length) {
            Object.assign(variations,window.optimizely.get('state').getVariationMap());
            activeExp = activeExp.concat(optimizely.get('state').getActiveExperimentIds());
        }

        var data = optimizely.get('data');
        console.log("Optimizely Experiments: ",data);

        if(activeExp.length){
            activeExp.forEach(function (val, ind) {
                var experiment = data.experiments[val];
                var varName = variations[val].name?variations[val].name:variations[val];
                var divWrap = document.createElement("div");
                divWrap.innerHTML = "<div id=\"test_id_"+ind+"\" style='font-size : "+font_size+";border : 1px solid "+main_clr+";border-radius : 3px;margin : 0 0 5px;padding : 5px;'>ID: " + val + ",rv:<span id=\"test_version\">" + (optimizely.get('data').revision||optimizely.revision)  + "</span><br />"+experiment.name+" </div>";
                if(typeof varName==="string"){document.querySelector("#optimizely_info_data").appendChild(divWrap);}

                experiment.variations.forEach(function(val,indx){
                    var div = document.createElement("div");
                    div.style = "margin : 0;padding : 0 0 0 10px;";
                    var isActive = varName==val.name?true:false;
                    var styles = 'color:'+active_clr+';';
                    div.innerHTML = isActive?"<div style="+styles+"><span id=\"test_name\">" + val.name + " - " + val.id +  "<span style='font-style:italic;font-size:'+font_size+';'>(active)</span></div>":"<div><span id=\"test_name\">" + val.name + " - " + val.id +  "</span> - <a href='#' style="+styles+" onclick=\"setExperiment("+val.id+")\">activate</a></div>";
                    document.querySelector("#test_id_"+ind).appendChild(div);
                });
            });
        }
        else {
            document.querySelector("#optimizely_info_data").innerHTML = "No experiment running!";
        }
}