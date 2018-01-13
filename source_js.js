/**
 * Optimizely X widget
 * Created by YYordanov on 11/03/17.
 * v6.0.1
 */
/*  @url params to force an experiment
 ?optimizely_x=VARIATIONID&optimizely_token=PUBLIC
 ?optimizely_force_tracking=true
 */
/*
In order for the log to work this script has to be injected before the call to Optimizely, in Tampermonkey set the script to be injected at "document start"
 */
"use strict";
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
    font_size = '12px',
    start = 0,
    domain = document.domain.split('.').length>2?document.domain.split('.')[document.domain.split('.').length-2]+"."+document.domain.split('.')[document.domain.split('.').length-1] : document.domain,
    stls = "font-size : "+font_size+";border : 1px solid "+main_clr+";border-radius : 3px;margin : 10px 0 5px;padding : 5px;",
    count = 0,
    maxCount = 4, //seconds until poll is done
    to = null,
    tt = [],
    cname = "qa_cookie_name",
    isTargetPresent = false,
    anim = null;
function KeyPress(e) {//console.log(e);
    var evtobj = window.event? event : e;
    if ((evtobj.metaKey || evtobj.ctrlKey) && evtobj.shiftKey && evtobj.keyCode == 89 ) {
        if(document.querySelector("#ccontainer_yuli")){
            document.querySelector("#ccontainer_yuli").classList.toggle("hide");
        }
    }
}

function createWrapper(){
    var stls = document.createElement("style");
    stls.textContent = "#ccontainer_yuli.hide{display : none!important;}";
    document.head.appendChild(stls);
    var container_styles = "position : fixed; z-index : 9999999999; top : 10px;width: auto;min-width: 280px; left : 10px; padding : 5px; background : "+bckgrnd_clr+"; box-shadow : 0 0 5px #555; -moz-box-shadow : 0 0 5px #555; -webkit-box-shadow : 0 0 5px #555;color: "+main_clr+";";
    var content = '<div><span id="removewidget" style="padding : 5px 8px; position : absolute; top : 0; right : 0; color : #f00; background : rgba(235,28,36,0.4);cursor : pointer;"> X </span>' +
        '<div id="optimizely_info_data" style="margin: 2px 24px 0 0;"></div>' +
        '</div>';
    var div = document.createElement("div");
    div.id = "ccontainer_yuli";
    div.style = container_styles;
    div.innerHTML = content;
    document.body.appendChild(div);
    document.querySelector("#removewidget").addEventListener("click",function () { document.body.removeChild(document.getElementById("ccontainer_yuli")); }, false);
    document.onkeydown = KeyPress;
}// createWrapper

function optimizelyWidget(){
    var content = '<div><input type="text" style="margin:0;padding:2px 0;width: auto;display: inline-block;font-size: ' + font_size + ';height : 25px;line-height : 14px;" placeholder="cookie name" id="cname_yuli" value="yy_qa" /> <button id="setcookie" style="float:none;color : #eee;width: auto;display: inline-block; height: auto;line-height: 14px;margin : 0;font-size: 12px;padding: 3px 10px; border : 1px solid '+main_clr+';background : '+active_clr+';">Set</button> <button id="remcookie" style="float:none;color : #fff;font-size: 12px;padding: 3px 10px;width: auto; display: inline-block;height: auto;line-height: 14px;margin: 0; border : 1px solid '+main_clr+';background : #f00;">Remove</button></div>' +
        '<div id="cerror" style="color : #fff; background : #f00;"></div>';
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
            if (exdays === -1 || exdays === '-1') {
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
            if( (exdays != -1 && !window.location.search) || (exdays != -1 && !window.location.search.match(cname.value+"=true")) ){window.setExperiment("&"+cname.value+"=true");}
            else if( exdays === -1 && window.location.search && window.location.search.match(cname.value+"=true")){window.location.search = window.location.search.replace(cname.value+"=true" , "");window.location.replace(window.location.origin+window.location.pathname);}
            else if(exdays === -1 ){
                window.location.replace(window.location.origin+window.location.pathname);
            }
        }, 1000);
    };
    window.setExperiment = function(variationId){
        var wls = window.location.search;
        if(Boolean(wls) && /optimizely_x/.test(wls) ){
            window.location.search = wls.replace(/optimizely_x=(\d+)?/ , "optimizely_x="+variationId);
        }else if(Boolean(wls) && /\?/.test(wls)){
            window.location.search = wls+"&optimizely_x="+variationId;
        }else{
            window.location.search = "optimizely_x="+variationId;
        }
    };
    document.querySelector("#removewidget").insertAdjacentHTML("beforebegin" , content);
    setTimeout(function(){
        document.querySelector("#setcookie").addEventListener("click",setCookie.bind(window,0.5) , true);
        document.querySelector("#remcookie").addEventListener("click",setCookie.bind(window,-1) , true);
    },500);
    var variations = {};
    var activeExp = [];
    if (window.optimizely && window.optimizely.variationNamesMap && optimizely.activeExperiments.length) {console.log("optly classic detected...");
        if(typeof Object.assign === "function"){Object.assign(variations,optimizely.variationNamesMap);}
        else{variations = JSON.parse(JSON.stringify(optimizely.variationNamesMap));}
        activeExp = optimizely.activeExperiments.indexOf(undefined)===-1?activeExp.concat(optimizely.activeExperiments):[];
    }
    if (window.optimizely && window.optimizely.get('state').getVariationMap() && Object.getOwnPropertyNames(window.optimizely.get('state').getVariationMap()).length) {
        if(typeof Object.assign === "function"){Object.assign(variations,window.optimizely.get('state').getVariationMap());}
        else{variations = JSON.parse(JSON.stringify(window.optimizely.get('state').getVariationMap()));}
        activeExp = optimizely.get('state').getActiveExperimentIds().indexOf(undefined)===-1?activeExp.concat(optimizely.get('state').getActiveExperimentIds()):activeExp;
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
        document.querySelector("#optimizely_info_data").innerHTML = "<div style='"+stls+"'>#### No Optimizely experiments running ####</div>";
    }
}

function getTargetTests() {
    if(!isTargetPresent) {
        Array.prototype.slice.call(document.querySelectorAll("script")).map(function (val, ind, arr) {
            if (val.textContent && val.textContent.trim().length && val.textContent.trim().match(/(at|mbox)\.js/gi)) {
                //console.log("found in the "+ind+" script");
                isTargetPresent = true;
                return;
            }
        });
    }
    if ((window.mboxCurrent && window.mboxCurrent.fe && window.mboxCurrent.fe.fd) || window.testversion) {
        //var tests = window.mboxCurrent.fe.fd.match(/\<\!\-\-\n(.*\n)+\-\-\>/gi);
        var tests = (window.mboxCurrent && window.mboxCurrent.fe && window.mboxCurrent.fe.fd)?window.mboxCurrent.fe.fd.match(/campaign:.*\nexperience:.*\n/gi) : window.testversion;
        var divWrap = document.createElement("div");
        divWrap.style = stls;
        if (tests.length&& !tests.substring) {
            tt.push("#### Target tests detected: ####");
            tests.forEach(function (val, ind, arr) {
                tt.push(val);
            });
        }else{
            tt.push("#### Target tests detected: ####");
            tt.push(tests.replace(/,campaign/gi,"<br />campaign"));
        }
        divWrap.innerHTML = tt.join("<br />");
        document.querySelector("#optimizely_info_data").appendChild(divWrap);
    } else {
        if (count < maxCount) {
            count++;
            to = setTimeout(getTargetTests, 1000);
        } else {
            clearTimeout(to);
            to = null;
            //console.log("#### No Target tests detected... ####");
            var divWrap = document.createElement("div");
            divWrap.style = stls;
            divWrap.textContent = "#### "+(isTargetPresent?"Target exists but no experiments are running":"No Target on page")+" ####";
            document.querySelector("#optimizely_info_data").appendChild(divWrap);
            return false;
        }
    }
}

function poll4elems(frame){
    if(!(Boolean(document.body && window.optimizely && typeof window.optimizely.get === "function") && Boolean(typeof window.optimizely.activeExperiments==="object" || window.optimizely.get('state').getVariationMap()))){
        if(!start){start=frame;}
        if(frame-start<4000){
            anim = requestAnimationFrame(poll4elems);
        }else{console.log("looping...");
            createWrapper();
            document.querySelector("#optimizely_info_data").innerHTML = "<div style='"+stls+"'>#### No Optimizely tag present ####</div>";
            cancelAnimationFrame(anim);
            //console.log("Optimizely NOT running on this page - aborting widget poll... ");
            //Append Target test info if there is one
            getTargetTests();
            return;
        }
    }
    else{
        createWrapper();
        optimizelyWidget();
        //Append Target test info if there is one
        getTargetTests();
    }
}

anim = requestAnimationFrame(poll4elems);