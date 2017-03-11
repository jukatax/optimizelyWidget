/**
 * Created by b12mac on 11/03/17.
 */
/*  @url params to force an experiment
 ?optimizely_x=VARIATIONID&optimizely_token=PUBLIC
 ?optimizely_force_tracking=true
 */
window['optimizely'] = window['optimizely'] || [];
window['optimizely'].push({
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
var start = 0;
function poll4elems(frame){
        if(!(window.optimizely && (typeof optimizely.get==="function")) && (optimizely.activeExperiments||window.optimizely.get('state').getVariationMap()) ){
                if(!start){start=frame;}
                if(frame-start<4000){
                        requestAnimationFrame(poll4elems);
                }else{
                        console.log("aborting widget poll... ");
                        return;
                }
        }
        else{
                addBookmarklet();
        }
}
requestAnimationFrame(poll4elems);
function addBookmarklet() {
        var content = '<div><input type="text" style="margin:0;padding:2px 0;width: auto;" placeholder="cookie name" id="cname_yuli" value="xx_qa" />' +
                '<button onclick="setCookie(0.5)" style="color : #888;margin : 0; border : 1px solid #555;background : #0f0;">Set</button><button onclick="setCookie(-1)" style="color : #fff; border : 1px solid #555;background : #f00;">Remove</button></div>' +
                '<div id="cerror" style="color : #fff; background : #f00;"></div>' +
                '<div><input style="margin:0;padding:2px 0;width: auto;" type="text" placeholder="variationId" id="variationId_yuli" value="" />' +
                '<button onclick="setExperiment(document.getElementById(\'variationId_yuli\').value)" style="color : #888; border : 1px solid #555;background : #0f0;margin : 0">Force Experiment</button></div>'+
                '<span style="padding : 5px 8px; position : absolute; top : 0; right : 0; color : #f00; background : rgba(235,28,36,0.4);cursor : pointer;" onclick="removeThis()"> X </span>' +
                '<div id="optimizely_info_data" style="margin: 2px 0 0;padding : 5px;border : 1px solid #555;border-radius : 3px;">' +
                '</div>';
        var bdy = document.body;
        window.setCookie = function (exdays) {
                var d = new Date(),
                        cname = document.getElementById("cname_yuli"),
                        cerror = document.getElementById("cerror");
                if (cname && cname.value) {
                        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                        var expires = "expires=" + d.toUTCString();
                        document.cookie = cname.value + "=1;path=/;" + expires;
                        cerror.innerHTML = "Cookie has been Set!";
                        if (exdays == "-1") {
                                document.cookie = "optimizelySegments=0;path=/;expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                document.cookie = "optimizelyBuckets=0;path=/;expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                document.cookie = "optimizelyEndUserId=0;path=/;expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                document.cookie = "optimizelySegments=0;path=/;expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                document.cookie = "optimizelyPendingLogEvents=0;path=/;expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                window.localStorage.clear();
                                window.sessionStorage.clear();
                        }
                } else {
                        cerror.innerHTML = "You need to specify a name for the cookie";
                }
                setTimeout(function () {
                        cerror.innerHTML = "";
                }, 3000);
        };
        window.removeThis = function () {
                bdy.removeChild(document.getElementById("ccontainer_yuli"));
        };
        window.setExperiment = function(variationId){
                window.location.search = "optimizely_x="+variationId+"&optimizely_token=PUBLIC";
        };
        var container_styles = "position : fixed; z-index : 999; top : 10px; left : 10px; padding : 25px; background : rgb(238, 241, 255); border : 1px solid #aaa; border-radius : 3px; box-shadow : 0 0 5px #555; -moz-box-shadow : 0 0 5px #555; -webkit-box-shadow : 0 0 5px #555;";
        var div = document.createElement("div");
        div.id = "ccontainer_yuli";
        div.style = container_styles;
        div.innerHTML = content;
        bdy.appendChild(div);
        document.querySelector("#ccontainer_yuli").setAttribute("style", container_styles);
        var variations = {};
        if (window.optimizely && window.optimizely.variationNamesMap && optimizely.activeExperiments.length) {
                Object.assign(variations,optimizely.variationNamesMap);
        }
        if (window.optimizely && window.optimizely.get('state').getVariationMap() && Object.getOwnPropertyNames(window.optimizely.get('state').getVariationMap()).length) {
                Object.assign(variations,window.optimizely.get('state').getVariationMap());
        }
        if(Object.getOwnPropertyNames(variations).length){
                Object.getOwnPropertyNames(variations).forEach(function (val, ind) {
                        var div = document.createElement("div");
                        var varName = variations[val].name?variations[val].name:variations[val];
                        div.style = "margin : 0;padding : 5px 0;";
                        div.innerHTML = "Id: <span id=\"test_id\">" + val + "</span>, v: <span id=\"test_name\">" + varName + "</span>, rv:<span id=\"test_version\">" + (optimizely.get('data').revision||optimizely.revision)  + "</span>";
                        if(typeof varName==="string"){document.querySelector("#optimizely_info_data").appendChild(div);}
                });
        }
        else {
                document.querySelector("#optimizely_info_data").innerHTML = "No experiment running!";
        }
}