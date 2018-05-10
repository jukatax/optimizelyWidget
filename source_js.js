// ==UserScript==
// @name         Optimizely X Widget v6.2.0
// @namespace    https://*/*
// @version      6.2.0
// @encoding     utf-8
// @description  Optimizely X Widget
// @author       Yuliyan Yordanov
// @match        https://*/*
// @include      http://*/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/jukatax/optimizelyWidget/master/source_js.js
// @downloadURL  https://raw.githubusercontent.com/jukatax/optimizelyWidget/master/source_js.js
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==
/**
 * Optimizely X widget
 * Created by YYordanov on 11/03/17.
 * v6.2.0
 */
/*  @url params to force an experiment
 ?optimizely_x=VARIATIONID&optimizely_token=PUBLIC
 ?optimizely_force_tracking=true
 */
/*
In order for the log to work this script has to be injected before the call to Optimizely, in Tampermonkey set the script to be injected at "document start"
Cmnd + Shift to hide/show teh widget
 */
(function(window,document) {
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
    window.widget = {
        version: '6.2.0',
        styles: {
            bckgrnd_clr: '#f4f7f1',
            main_clr: '#19405b',
            active_clr: '#3778ad',
            font_size: '12px',
            isTargetPresent: false,
            versionWrapper: "position:absolute;top:0;left:5px;font-size : 8px;line-height : 8px;",
            containerWrapper: "position : fixed; z-index : 9999999999; top : 10px;width: auto;min-width: 280px;max-width: 500px; left : 10px; padding : 8px 5px 5px; background : #f4f7f1; box-shadow : 0 0 5px #555; -moz-box-shadow : 0 0 5px #555; -webkit-box-shadow : 0 0 5px #555;color: #19405b;",
            xwrapper: "padding : 5px 8px; position : absolute; top : 0; right : 0; color : #f00; background : rgba(235,28,36,0.4);cursor : pointer;",
            results: "font-size : 12px;border : 1px solid #19405b;border-radius : 3px;margin : 10px 0 5px;padding : 5px;",
            inputField: "margin:0;padding:3px 0;width: auto;height: auto;display: inline-block;line-height : 14px;font-size: 12px;",
            button: "float:none;color : #fff;font-size: 12px;padding: 3px 10px;width: auto; display: inline-block;height: auto;line-height: 14px;margin: 0; border : 1px solid #19405b;",
            error: "color : #fff; background : #f00;",
            hide: "#ccontainer_yuli.hide{display : none!important;}"
        },
        clientSideTests: [],
        serverSideTests: [],
        targetTests: [],
        cookieName: "qa", /* Cookie name for QA */
        domain: document.domain.split('.').length > 2 ? document.domain.split('.')[document.domain.split('.').length - 2] + "." + document.domain.split('.')[document.domain.split('.').length - 1] : document.domain,
        count: 0,
        start: 0,
        start2: 0,
        countMax: 4,
        toggleWidget: function (e) {
            var evtobj = window.event ? event : e;
            if ((evtobj.metaKey || evtobj.ctrlKey) && evtobj.shiftKey && evtobj.keyCode === 89) {
                if (document.querySelector("#ccontainer_yuli")) {
                    document.querySelector("#ccontainer_yuli").classList.toggle("hide");
                }
            }
        },
        setCookie: function (exdays) {
            var d = new Date(),
                cname = document.getElementById("cname_yuli"),
                cerror = document.getElementById("cerror");
            if (cname && cname.value) {
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toUTCString();
                document.cookie = cname.value + "=1;path=/;domain=" + widget.domain + ";" + expires;
                cerror.innerHTML = "Cookie has been Set!";
                if (exdays === -1 || exdays === '-1') {
                    document.cookie = "optimizelySegments=0;path=/;domain=" + widget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                    document.cookie = "optimizelyEndUserId=0;path=/;domain=" + widget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                    document.cookie = "optimizelyEndUserId=0;path=/;domain=optimizely.com;expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                    document.cookie = "optimizelyRedirectData=0;path=/;domain=" + widget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                    document.cookie = "optimizelyBuckets=0;path=/;domain=" + widget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                    document.cookie = "optimizelyEndUserId=0;path=/;domain=" + widget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                    document.cookie = "optimizelySegments=0;path=/;domain=" + widget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                    document.cookie = "optimizelyPendingLogEvents=0;path=/;domain=" + widget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                    window.localStorage.clear();
                    window.sessionStorage.clear();
                }
            } else {
                cerror.innerHTML = "You need to specify a name for the cookie";
            }
            setTimeout(function () {
                cerror.innerHTML = "";
                if ((exdays != -1 && !window.location.search) || (exdays !== -1 && !window.location.search.match(cname.value + "=true"))) {
                    window.setExperiment("&" + cname.value + "=true");
                }
                else if (exdays === -1 && window.location.search && window.location.search.match(cname.value + "=true")) {
                    window.location.search = window.location.search.replace(cname.value + "=true", "");
                    window.location.replace(window.location.origin + window.location.pathname);
                }
                else if (exdays === -1) {
                    window.location.replace(window.location.origin + window.location.pathname);
                }
            }, 1000);
        },
        setExperiment: function (variationId) {
            var wls = window.location.search;
            if (Boolean(wls) && /optimizely_x/.test(wls)) {
                window.location.search = wls.replace(/optimizely_x=(\d+)?/, "optimizely_x=" + variationId);
            } else if (Boolean(wls) && /\?/.test(wls)) {
                window.location.search = wls + "&optimizely_x=" + variationId;
            } else {
                window.location.search = "optimizely_x=" + variationId;
            }
        },
        createwidget: function () {
            var stls = document.createElement("style");
            stls.textContent = widget.styles.hide;
            document.head.appendChild(stls);
            var content = '<div><span style="' + widget.styles.versionWrapper + '">v: ' + widget.version + '</span><span id="removewidget" style="' + widget.styles.xwrapper + '"> X </span>' +
                '<div id="optimizely_info_data" style="margin: 2px 24px 0 0;">' +
                '<div>' +
                '<input type="text" style="' + widget.styles.inputField + '" placeholder="cookie name" id="cname_yuli" value=' + widget.cookieName + ' />' +
                '<button id="setcookie" style="' + widget.styles.button + ';background : ' + widget.styles.active_clr + ';">Set</button>' +
                '<button id="remcookie" style="' + widget.styles.button + ';background : #f00;">Remove</button></div>' +
                '<div id="cerror" style="' + widget.styles.error + '"></div>' +
                '</div>' +
                '<div id="optlyX"></div>' +
                '<div id="optlyServerSide"></div>' +
                '<div id="target"></div>' +
                '</div>';
            var div = document.createElement("div");
            div.id = "ccontainer_yuli";
            div.style = widget.styles.containerWrapper;
            div.innerHTML = content;
            if (!document.querySelector("#ccontainer_yuli")) {
                document.body.appendChild(div);
            }
            document.querySelector("#removewidget").addEventListener("click", function () {
                document.body.removeChild(document.getElementById("ccontainer_yuli"));
            }, false);
            document.onkeydown = widget.toggleWidget;
        },
        getOptlyServerSideTests : function(){
            var divWrap = document.createElement("div");
            divWrap.style = widget.styles.results;
            var gettests = document.querySelectorAll('[data-experiment]');
            if (gettests.length) {
                widget.serverSideTests.push("#### Optly Server-side tests detected: ####");
                Array.prototype.slice.call(gettests).forEach(function (val, ind, arr) {
                    widget.serverSideTests.push(val.getAttribute('data-experiment'));
                });
            }else{
                widget.serverSideTests.push("#### No Optly Server-side experiments running ####");
            }
            divWrap.innerHTML = "<ul>"+widget.serverSideTests.join("<br />")+"</ul>";
            if(document.querySelector("#optlyServerSide")){
                document.querySelector("#optlyServerSide").appendChild(divWrap);
            }else{
                widget.getOptlyServerSideTests();
            }
        },
        getOptlyClientSideTests: function () {
            var variations = {},
                activeExp = [],
                bdy = document.body,
                data;
            document.querySelector("#setcookie").addEventListener("click", widget.setCookie.bind(widget, 0.5), true);
            document.querySelector("#remcookie").addEventListener("click", widget.setCookie.bind(widget, -1), true);
            if (typeof Object.assign === "function") {
                Object.assign(variations, window.optimizely.get('state').getVariationMap());
            }
            else {
                variations = JSON.parse(JSON.stringify(window.optimizely.get('state').getVariationMap()));
            }
            activeExp = optimizely.get('state').getActiveExperimentIds().indexOf(undefined) === -1 ? activeExp.concat(optimizely.get('state').getActiveExperimentIds()) : activeExp;
            data = optimizely.get('data');
            if (activeExp.length) {
                activeExp.forEach(function (val, ind) {
                    var experiment = data.experiments[val];
                    var varName = variations[val].name ? variations[val].name : variations[val];
                    var divWrap = document.createElement("div");
                    divWrap.innerHTML = "<div id=\"test_id_" + ind + "\" style='font-size : " + widget.styles.font_size + ";border : 1px solid " + widget.styles.main_clr + ";border-radius : 3px;margin : 0 0 5px;padding : 5px;'>ID: " + val + ",rv:<span id=\"test_version\">" + (optimizely.get('data').revision || optimizely.revision) + "</span><br />" + experiment.name + " </div>";
                    if (typeof varName === "string") {
                        document.querySelector("#optimizely_info_data").appendChild(divWrap);
                    }

                    experiment.variations.forEach(function (val, indx) {
                        var div = document.createElement("div");
                        div.style = "margin : 0;padding : 0 0 0 10px;";
                        var isActive = (varName === val.name) ? true : false;
                        var styles = 'color:' + widget.styles.active_clr + ';';
                        div.innerHTML = isActive ? "<div style=" + styles + "><span id=\"test_name\">" + val.name + " - " + val.id + "<span style='font-style:italic;font-size:'+widget.styles.font_size+';'>(active)</span></div>" : "<div><span id=\"test_name\">" + val.name + " - " + val.id + "</span> - <a href='#' style=" + styles + " onclick=\"widget.setExperiment(" + val.id + ")\">activate</a></div>";
                        document.querySelector("#test_id_" + ind).appendChild(div);
                    });
                });
            }
            else {
                document.querySelector("#optlyX").innerHTML = "<div style='" + widget.styles.results + "'>#### No Optimizely experiments running ####</div>";
            }
        },
        getTargetTests: function () {
            var divWrap = document.createElement("div"),
                to, tests;
            divWrap.style = widget.styles.results;
            if (!widget.isTargetPresent) {
                if ((window.adobe && window.adobe.target && window.adobe.target.VERSION) || window.mbox) {
                    widget.isTargetPresent = true;
                }
            }
            //var tests = window.mboxCurrent.fe.fd.match(/\<\!\-\-\n(.*\n)+\-\-\>/gi);
            tests = (window.mboxCurrent && window.mboxCurrent.fe && window.mboxCurrent.fe.fd) ? window.mboxCurrent.fe.fd.match(/campaign:.*\nexperience:.*\n/gi) : window.testversion;
            if (tests.length && !tests.substring) {
                widget.targetTests.push("#### Target tests detected: ####");
                tests.forEach(function (val, ind, arr) {
                    widget.targetTests.push(val);
                });
            } else if (tests.length) {
                widget.targetTests.push("#### Target tests detected: ####");
                widget.targetTests.push(tests.replace(/,campaign/gi, "<br />campaign"));
            } else {
                widget.targetTests.push("#### No Target experiments running ####");
            }
            divWrap.innerHTML = widget.targetTests.join("<br />");
            if (document.querySelector("#target")) {
                document.querySelector("#target").appendChild(divWrap);
            } else {
                widget.getTargetTests();
            }

        },
        poll4optlyX: function () {
            if (!Boolean(document.body && window.optimizely && (typeof window.optimizely.get === "function") && window.optimizely.get('state').getVariationMap())) {
                if (widget.start < widget.countMax) {
                    widget.start += 0.5;
                    setTimeout(widget.poll4optlyX, 250);
                } else {
                    document.querySelector("#optlyX").innerHTML = "<div style='" + widget.styles.results + "'>#### No Optimizely tag present ####</div>";
                    return;
                }
            }
            else {
                widget.getOptlyClientSideTests();
            }
        },
        poll4target: function () {
            if (!Boolean((window.mboxCurrent && window.mboxCurrent.fe && window.mboxCurrent.fe.fd) || window.testversion)) {
                if (widget.start2 < widget.countMax) {
                    widget.start2 += 0.5;
                    setTimeout(widget.poll4target, 250);
                } else {
                    document.querySelector("#target").innerHTML = "<div style='" + widget.styles.results + "'>#### No Target present ####</div>";
                    return;
                }
            }
            else {
                widget.getTargetTests();
            }
            //return Boolean((window.mboxCurrent && window.mboxCurrent.fe && window.mboxCurrent.fe.fd) || window.testversion);
        },
        poll4OptlyServerSide : function(){
            if(document.querySelectorAll('[data-experiment]') && document.querySelectorAll('[data-experiment]').length){
                widget.getOptlyServerSideTests();
            }else{
                document.querySelector("#optlyServerSide").innerHTML = "<div style='"+widget.styles.results+"'>#### No Optly server-side experiments ####</div>";
                return;
            }
        },
        init: function () {
            widget.createwidget();
            widget.poll4optlyX();
            widget.poll4target();
            widget.poll4OptlyServerSide();
        }
    };

    document.addEventListener("DOMContentLoaded", function poll4Ready() {
        if (document.readyState === "complete") {
            widget.init();
        } else {
            setTimeout(poll4Ready, 250);
        }
    });
})(window,document);