// ==UserScript==
// @name         Optimizely X Widget
// @namespace    https://www.tesco.com
// @version      6.8.0
// @encoding     utf-8
// @description  Optimizely X Widget
// @author       Yuliyan Yordanov
// @match        https://*.tesco.*/*
// @exclude      /(condeco|github|aha|jira|timex|litmos|payslip|launchandlearn|app\.optimizely|webex|ukirp365)/
// @grant        none
// @updateURL    https://raw.githubusercontent.com/jukatax/optimizelyWidget/master/source_js.js
// @downloadURL  https://raw.githubusercontent.com/jukatax/optimizelyWidget/master/source_js.js
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==
/*jshint esversion:6*/
/*globals document,window,console,requestAnimationFrame,setTimeout */
/*  @url params to force an experiment
 ?optimizely_x=VARIATIONID&optimizely_token=PUBLIC
 ?optimizely_force_tracking=true
 */
/*
In order for the log to work this script has to be injected before the call to Optimizely, in Tampermonkey set the script to be injected at "document start"
 */
(function (w, d) {
    "use strict";
    w.optimizely = w.optimizely || [];
    w.optimizely.push({
        type: 'log',
        level: 'error' // off/error/warn/info/debug/all
    });

    // start the widget when the body is present
    let startWidget = () => {
        if (d.getElementsByTagName("head")[0] && d.getElementsByTagName("head")[0] && d.getElementsByTagName("body") && d.getElementsByTagName("body")[0]) {
            w.widget = {
                version: '6.8.0',
                name: "::yy-optlyWidget::",
                styles: {
                    bckgrnd_clr: '#f4f7f1',
                    main_clr: '#19405b',
                    active_clr: '#3778ad',
                    font_size: '12px',
                    isTargetPresent: false,
                    versionWrapper: "position:absolute;top:2px;left:5px;font-size : 0.8em;line-height : 8px;",
                    containerWrapper: "",
                    xwrapper: "padding : 5px 8px; position : absolute; top : 0; right : 0; color : #f00; background : rgba(235,28,36,0.4);cursor : pointer;",
                    results: "font-size : 12px;border : 1px solid #19405b;border-radius : 3px;margin : 10px 0 5px;padding : 5px;",
                    inputField: "margin:0;padding:3px 0;width: auto!important;height: auto!important;display: inline-block;line-height : 14px!important;font-size: 12px!important;",
                    button: "float:none;color : #fff!important;font-size: 12px!important;padding: 3px 10px;width: auto!important; display: inline-block;height: auto;line-height: 14px!important;margin: 0; border : 1px solid #19405b!important;",
                    error: "color : #fff; background : #f00;",
                    hide: "#ccontainer_yuli.hide, #ccontainer_yuli .hide{display : none!important;}",
                    all: '#ccontainer_yuli{position : fixed; z-index : 9999999999; top : 10px;width: auto;min-width: 280px;max-width: 440px; left : 10px; padding : 12px 5px 5px; background : #f4f7f1; box-shadow : 0 0 5px #555; -moz-box-shadow : 0 0 5px #555; -webkit-box-shadow : 0 0 5px #555;color: #19405b;font-family : Helvetica, Arial;font-size: 12px;border-radius: 3px;transition : left 1s ease-in-out;max-height: 100%;overflow-y: scroll;}' +
                        '#ccontainer_yuli div{text-align:left;}' +
                        '#ccontainer_yuli #optlyServerSide div ul{padding:0;margin: 0;}' +
                        '#ccontainer_yuli .positions{ font-size : 0.8em;line-height : 8px;font-style: italic;display: flex; justify-content: space-around; align-items : center;}' +
                        '#ccontainer_yuli .positions span{ display : block; }' +
                        '#ccontainer_yuli .positions span:hover{ cursor:pointer; text-decoration : underline; }' +
                        '#ccontainer_yuli.center{left : calc(50% - 200px);}' +
                        '#ccontainer_yuli.left{left : 10px;}' +
                        '#ccontainer_yuli.right{left  :calc(100% - 440px);}' +
                        '#ccontainer_yuli.hide{display : none!important;}'
                },
                logstyles: "background:orange;color:#000;padding:2px 4px;",
                clientSideTests: [],
                serverSideTests: [],
                targetTests: [],
                cookieName: "_qa",

                cookieName2: "ssp" + (d.cookie.match(/sspleft/ig) ? "left" : d.cookie.match(/sspright/ig) ? "right" : d.cookie.match(/sspcenter/ig) ? "center" : "left"),
                domain: d.domain.split('.').length > 2 ? d.domain.split('.')[d.domain.split('.').length - 2] + "." + d.domain.split('.')[d.domain.split('.').length - 1] : d.domain,
                count: 0,
                optlyCounter: 0,
                targetCounter: 0,
                sstestsCounter: 0,
                bertieCounter: 0,
                countMax: 4,
                toggleWidget: (e) => { //Cmnd + Shift + Y to hide/show the widget
                    var evtobj = w.event ? event : e;
                    if ((evtobj.metaKey || evtobj.ctrlKey) && evtobj.shiftKey && evtobj.keyCode === 89) {
                        if (d.querySelector("#ccontainer_yuli")) {
                            d.querySelector("#ccontainer_yuli").classList.toggle("hide");
                        }
                    }
                },
                log: (...msg) => {
                    console.log.call(null, ("%c" + widget.name), widget.logstyles, ...msg);
                },
                setCookie: (name, exdays) => {
                    var d = new Date(),
                        cname = name,
                        cerror = document.getElementById("cerror");
                    if (cname) {
                        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                        var expires = "expires=" + d.toUTCString();
                        document.cookie = cname + "=true;path=/;domain=" + widget.domain + ";" + expires;
                        cerror ? (cerror.innerHTML = "Cookie has been Set!") : null;
                        if (exdays === -1 || exdays === '-1') {
                            document.cookie = "optimizelySegments=0;path=/;domain=" + widget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                            document.cookie = "optimizelyEndUserId=0;path=/;domain=" + widget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                            document.cookie = "optimizelyEndUserId=0;path=/;domain=optimizely.com;expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                            document.cookie = "optimizelyRedirectData=0;path=/;domain=" + widget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                            document.cookie = "optimizelyBuckets=0;path=/;domain=" + widget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                            document.cookie = "optimizelyEndUserId=0;path=/;domain=" + widget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                            document.cookie = "optimizelySegments=0;path=/;domain=" + widget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                            document.cookie = "optimizelyPendingLogEvents=0;path=/;domain=" + widget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                            document.cookie = cname + "=0;path=/;domain=" + widget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                            //w.localStorage.clear();
                            //w.sessionStorage.clear();
                        }
                    } else {
                        ceror ? (cerror.innerHTML = "You need to specify a name for the cookie") : null;
                    }
                    if (cname && cname.indexOf("ssp") === -1) {
                        setTimeout(() => {
                            cerror.innerHTML = "";
                            if ((exdays != -1 && !w.location.search) || (exdays !== -1 && !w.location.search.match(cname + "=true"))) {
                                w.widget.setExperiment("&" + cname + "=true");
                            } else if (exdays === -1 && w.location.search && w.location.search.match(cname + "=true")) {
                                w.location.search = w.location.search.replace(cname + "=true", "");
                                w.location.replace(w.location.origin + w.location.pathname);
                            } else if (exdays === -1) {
                                w.location.replace(w.location.origin + w.location.pathname);
                            }
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            cerror ? (cerror.innerHTML = "") : null;
                        }, 1000);
                    }
                },
                setExperiment: (variationId) => {
                    var wls = w.location.search;
                    if (Boolean(wls) && /optimizely_x/.test(wls)) {
                        w.location.search = wls.replace(/optimizely_x=(\d+)?/, "optimizely_x=" + variationId);
                    } else if (Boolean(wls) && /\?/.test(wls)) {
                        w.location.search = wls + "&optimizely_x=" + variationId;
                    } else {
                        w.location.search = "optimizely_x=" + variationId;
                    }
                },
                createwidget: () => {
                    if (!d.getElementById("optly_tests")) {
                        var stls = d.createElement("style");
                        stls.id = "optly_tests";
                        stls.textContent = widget.styles.all;
                        d.getElementsByTagName("head")[0].appendChild(stls);
                    }
                    var content = '<div>' +
                        '<div class="positions">' +
                        '<span style="' + widget.styles.versionWrapper + '">v: ' + widget.version + '</span> <span data-pos="left">left</span> <span data-pos="center">center</span> <span data-pos="right">right</span>   <span id="removewidget" style="' + widget.styles.xwrapper + '"> X </span>' +
                        '</div>' +
                        '<div id="optimizely_info_data" style="margin: 2px 24px 0 0;">' +
                        '<div>' +
                        '<input type="text" style="' + widget.styles.inputField + '" placeholder="cookie name" id="cname_yuli" value=' + widget.cookieName + ' />' +
                        '<button id="setcookie" style="' + widget.styles.button + ';background : ' + widget.styles.active_clr + '!important;">Set</button>' +
                        '<button id="remcookie" style="' + widget.styles.button + ';background : #f00!important;">Remove</button></div>' +
                        '<div id="cerror" style="' + widget.styles.error + '"></div>' +
                        '</div>' +
                        '<div id="optlyX"></div>' +
                        '<div id="optlyServerSide"></div>' +
                        '<div id="target"></div>' +
                        '<div id="bertie" class="hide" style="' + widget.styles.results + '"></div>' +
                        '</div>';
                    var div = d.createElement("div");
                    div.id = "ccontainer_yuli";
                    div.style = widget.styles.containerWrapper;
                    div.setAttribute("class", (d.cookie.match(/sspleft/ig) ? "left" : d.cookie.match(/sspright/ig) ? "right" : d.cookie.match(/sspcenter/ig) ? "center" : "left"));
                    div.innerHTML = content;
                    if (!d.querySelector("#ccontainer_yuli")) {
                        d.getElementsByTagName("body")[0].appendChild(div);
                    }
                },
                addDOMEvents: () => {
                    d.querySelector("#setcookie").addEventListener("click", () => {
                        widget.setCookie(w.widget.cookieName, 60);
                    }, true);
                    d.querySelector("#remcookie").addEventListener("click", () => {
                        widget.setCookie(w.widget.cookieName, -1);
                    }, true);
                    d.querySelector("#removewidget").addEventListener("click", () => {
                        d.getElementById("ccontainer_yuli").parentNode.removeChild(d.getElementById("ccontainer_yuli"));

                        d.querySelectorAll("#ccontainer_yuli .positions span").forEach((val, ind) => {
                            let pos = val.getAttribute("data-pos");
                            val.removeEventListener("click", w.widget.setWidgetPosition.bind(null, pos));
                        });
                        //remove styles
                        if (d.getElementById("optly_tests")) {
                            d.getElementById("optly_tests").parentNode.removeChild(d.getElementById("optly_tests"));
                        }
                    }, false);
                    d.onkeydown = widget.toggleWidget;
                    d.getElementById("cname_yuli").addEventListener("keyup", (e) => {
                        w.widget.cookieName = e.target.value;
                    });

                    d.querySelectorAll("#ccontainer_yuli .positions span").forEach((val, ind) => {
                        let pos = val.getAttribute("data-pos");
                        val.addEventListener("click", w.widget.setWidgetPosition.bind(null, pos), false);
                    });
                },
                setWidgetPosition: (pos, e) => {
                    let currentClass = w.widget.cookieName2.substring(3);
                    let wdget = d.getElementById("ccontainer_yuli");
                    w.widget.setCookie("ssp" + currentClass, -1);
                    w.widget.cookieName2 = "ssp" + pos;
                    if (wdget) {
                        wdget.classList.remove(currentClass);
                        wdget.classList.add(pos);
                    }
                    w.widget.setCookie(w.widget.cookieName2, 30);
                },
                getOptlyServerSideTests: () => {
                    if (d.querySelector("#optlyServerSide")) {
                        var divWrap = d.getElementById("ss_tests") ? d.getElementById("ss_tests") : d.createElement("div");
                        !d.getElementById("ss_tests") ? (divWrap.style = widget.styles.results) : null;
                        !d.getElementById("ss_tests") ? (divWrap.id = "ss_tests") : null;
                        var gettests = w.optimizelyData;
                        if (gettests) {
                            widget.serverSideTests = [];
                            d.querySelector("#optlyServerSide").innerHTML = "";
                            widget.serverSideTests.indexOf("#### Optly Server-side tests: ####") === -1 ? widget.serverSideTests.push("#### Optly Server-side tests: ####") : null;
                            widget.serverSideTests.push(JSON.stringify(gettests));

                        } else {
                            widget.serverSideTests = [];
                            d.querySelector("#optlyServerSide").innerHTML = "";
                            widget.serverSideTests.indexOf("#### No Optly Server-side experiments running ####") === -1 ? widget.serverSideTests.push("#### No Optly Server-side experiments running ####") : null;
                        }
                        divWrap.innerHTML = "<ul>" + widget.serverSideTests.join("<br />") + "</ul>";
                        d.querySelector("#optlyServerSide").appendChild(divWrap);
                    } else {
                        widget.getOptlyServerSideTests();
                    }
                },
                getOptlyClientSideTests: () => {
                    var variations = {},
                        activeExp = [],
                        bdy = d.body,
                        data;
                    if (typeof Object.assign === "function") {
                        Object.assign(variations, w.optimizely.get('state').getVariationMap());
                    } else {
                        variations = JSON.parse(JSON.stringify(w.optimizely.get('state').getVariationMap()));
                    }
                    activeExp = optimizely.get('state').getActiveExperimentIds().indexOf(undefined) === -1 ? activeExp.concat(optimizely.get('state').getActiveExperimentIds()) : activeExp;
                    data = optimizely.get('data');
                    if (activeExp.length) {
                        activeExp.forEach(function (val, ind) {
                            var experiment = data.experiments[val];
                            var varName = variations[val].name ? variations[val].name : variations[val];
                            var divWrap = d.createElement("div");
                            divWrap.innerHTML = "<div id=\"test_id_" + ind + "\" style='font-size : " + widget.styles.font_size + ";border : 1px solid " + widget.styles.main_clr + ";border-radius : 3px;margin : 0 0 5px;padding : 5px;'>ID: " + val + ",rv:<span id=\"test_version\">" + (optimizely.get('data').revision || optimizely.revision) + "</span><br />" + experiment.name + " </div>";
                            if (true) {
                                d.querySelector("#optimizely_info_data").appendChild(divWrap);
                            }

                            experiment.variations.forEach(function (val, indx) {
                                var div = d.createElement("div");
                                div.style = "margin : 0;padding : 0 0 0 10px;";
                                var isActive = (varName === val.name) ? true : false;
                                var styles = 'color:' + widget.styles.active_clr + ';';
                                div.innerHTML = isActive ? "<div style=" + styles + "><span id=\"test_name\">" + val.name + " - " + val.id + "<span style='font-style:italic;font-size:'+widget.styles.font_size+';'>(active)</span></div>" : "<div><span id=\"test_name\">" + val.name + " - " + val.id + "</span> - <a href='#' style=" + styles + " onclick=\"widget.setExperiment(" + val.id + ")\">activate</a></div>";
                                d.querySelector("#test_id_" + ind).appendChild(div);
                            });
                        });
                    } else {
                        d.querySelector("#optlyX").innerHTML = "<div style='" + widget.styles.results + "'>#### No Optimizely experiments running ####</div>";
                    }
                },

                initBertie: () => {
                    if (!(bertie && bertie.on)) {
                        widget.log("bertie not available...exiting...");
                    } else {
                        let bertie_dom_log_wrapper = document.getElementById("bertie");
                        widget.log("bertie loaded...");
                        bertie.onAny(function (e) {
                            widget.log(" bertie.onAny fired...: ", e);
                            var type = e.type || e["@type"];
                            bertie_dom_log_wrapper.classList.remove("hide");
                            bertie_dom_log_wrapper.innerHTML = !(bertie_dom_log_wrapper.textContent.match(type)) ? bertie_dom_log_wrapper.innerHTML + "<p><b>" + type + "</b></p>" : "";
                            if (e && type && type === "tesco:UIExperimentRendered") {
                                widget.getOptlyServerSideTests();
                                /*try {
     var allCurrentArray = [],
          todayDate = e && e.timestamp ? e.timestamp.substring(0, e.timestamp.indexOf("T")) : (new Date()).toLocaleDateString().split("/").reverse().join("-"),
          expNamesFromStorage = [];

     // Get all previously seen experiments if any
     (localStorage && localStorage.getItem('OptVars')) ? (expNamesFromStorage = JSON.parse(localStorage.getItem('OptVars'))) : null;

     // Loop through all currently requested experiments from the event and check if they exist in previously seen
     if (e && e.experiments && typeof e.experiments.push === "function" && e.experiments.length) {
          e.experiments.map(function (val, ind, arr) {
               var tmpExpName_RExp = new RegExp(val.experimentName + "-" + val.variationKey, "ig");
               // push only if localStorage was empty || (there are experiments in the localStorage array && the current experiment-variant combo do not exist in there)
               if ( !expNamesFromStorage.length || (expNamesFromStorage.length && !(JSON.stringify(expNamesFromStorage).match(tmpExpName_RExp)))) {
                    expNamesFromStorage.push({ "V": val.experimentName + "-" + val.variationKey, "D": todayDate });
               }
          });
     } else {
          throw new Error("Can't work with event data: experiments is either undefined, not an array or empty"); //exit
     }

     // Set evars in _satellite
     if (window._satellite && typeof window._satellite.setVar === "function") {
          window._satellite.setVar('busExpTodayDate', todayDate);
          window._satellite.setVar('busExpCurrent', expNamesFromStorage);
     } else {
          throw new Error("Can't send data: _satellite seem to be undefined"); //exit
     }

     // Store all experiments - current and past in localStorage. Will overwrite existing value or set new one if it didn't exist
     if (localStorage) {
          localStorage.setItem('OptVars', JSON.stringify(expNamesFromStorage));
     } else {
          throw new Error("Can't store data: localStorage seem to be  undefined"); //exit
     }
} catch (err) {
     console.log("Error while trying to store and send experiments: ", err);
}*/
                            }
                        });

                    }
                }, //initBertie
                poll4optlyX: () => {
                    if (!Boolean(d.getElementsByTagName("body")[0] && w.optimizely && (typeof w.optimizely.get === "function") && w.optimizely.get('state').getVariationMap())) {
                        if (widget.optlyCounter < widget.countMax) {
                            widget.optlyCounter += 0.5;
                            setTimeout(widget.poll4optlyX, 250);
                        } else {
                            d.querySelector("#optlyX").innerHTML = "<div style='" + widget.styles.results + "'>#### No Optimizely tag present ####</div>";
                            return;
                        }
                    } else {
                        widget.getOptlyClientSideTests();
                    }
                },
                poll4OptlyServerSide: () => {
                    if (typeof window.optimizelyData === "object") {
                        widget.getOptlyServerSideTests();
                    } else {
                        if (widget.sstestsCounter < widget.countMax) {
                            widget.sstestsCounter += 0.5;
                            setTimeout(widget.poll4OptlyServerSide, 250);
                        } else {
                            d.querySelector("#optlyServerSide").innerHTML = "<div style='" + widget.styles.results + "'>#### No Optly server-side experiments ####</div>";
                            return;
                        }
                    }
                },
                poll4Bertie: () => {
                    if (!(w.bertie && w.bertie.on)) {
                        if (widget.bertieCounter < widget.countMax) {
                            widget.bertieCounter += 0.5; //console.error("bertie NOT avaialable...");
                            setTimeout(widget.poll4Bertie, 500);
                        } else {
                            return;
                        }
                    } else {
                        widget.initBertie();
                    }
                },
                init: () => {
                    widget.createwidget();
                    widget.addDOMEvents();
                    widget.poll4optlyX();
                    //widget.poll4target();
                    widget.poll4OptlyServerSide();
                    widget.poll4Bertie();
                }
            };
            w.widget.init();
        } else { //console.error("body not available...polling again");
            w.requestAnimationFrame(startWidget);
        }
    }; // startWidget
    if (document.readyState === "complete") {
        startWidget();
    }
    d.addEventListener("DOMContentLoaded", function poll4ready() {
        if (document.readyState === "complete") {
            startWidget();
        } else {
            //console.log("Document lodaing document.readyState: ",document.readyState);
            w.requestAnimationFrame(poll4ready);
        }
    });
})(window, document);