// ==UserScript==
// @name         Optimizely X Widget
// @namespace
// @version      6.8.12
// @encoding     utf-8
// @description  Optimizely X Widget
// @author       Yuliyan Yordanov
// @match        https://*
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
if (!(unsafeWindow.location.ancestorOrigins && unsafeWindow.location.ancestorOrigins.length)) {
    (function (w, d) {
        "use strict";
        w.optimizely = w.optimizely || [];
        w.optimizely.push ? w.optimizely.push({
            type: 'log',
            level: 'error' // off/error/warn/info/debug/all
        }) : null;
        const VERSION = "6.8.12";
        const WIDGETSTYLES = "background:orange;color:#000;padding:2px 4px;";
        const NAME = "::WIDGET-Optimizely X Widget v." + VERSION + "::";
        /**
        *
        * @param {Array of strings} msg
        */
        function _log(msg) {
            console.log.call(null, ("%c" + NAME), WIDGETSTYLES);
            if (typeof msg === 'object' && typeof msg.slice === 'function') {
                msg.map((item) => {
                    if (typeof item === 'object') {
                        console.log.call(null, "%c %o ", WIDGETSTYLES, item);
                    } else {
                        console.log.call(null, ("%c " + item), WIDGETSTYLES);
                    }
                });
            } else {
                if (typeof msg === 'object') {
                    console.log.call(null, "%c %o ", WIDGETSTYLES, msg);
                } else {
                    console.log.call(null, ("%c " + msg), WIDGETSTYLES);
                }
            }
            console.log.call(null, ("%c" + NAME + " END "), WIDGETSTYLES);
        }
        /*===========================*/
        // start the widget when the body is present
        let startWidget = () => {
            if (d.getElementsByTagName("head")[0] && d.getElementsByTagName("head")[0] && d.getElementsByTagName("body") && d.getElementsByTagName("body")[0]) {
                w.optlywidget = {
                    version: VERSION,
                    name: "optlyWidget",
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
                    toggleWidget: (e) => { //Cmnd/Ctrl + Shift + Y to hide/show the widget
                        var evtobj = e; //w.optlywidget.log(evtobj.keyCode);
                        if ((evtobj.metaKey || evtobj.ctrlKey) && evtobj.shiftKey && evtobj.keyCode === 89) {
                            if (d.querySelector("#ccontainer_yuli")) {
                                d.querySelector("#ccontainer_yuli").classList.toggle("hide");
                            }
                        }
                    },
                    log: (...msg) => {
                        console.log.call(null, ("%c::WIDGET-" + w.optlywidget.name + " v." + w.optlywidget.version + "::"), w.optlywidget.logstyles, ...msg);
                    },
                    setCookie: (name, exdays) => {
                        var d = new Date(),
                            cname = name,
                            cerror = document.getElementById("cerror");
                        if (cname) {
                            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                            var expires = "expires=" + d.toUTCString();
                            document.cookie = cname + "=true;path=/;domain=" + w.optlywidget.domain + ";" + expires + "sameSite=Lax;";
                            cerror ? (cerror.innerHTML = "Cookie has been Set!") : null;
                            if (exdays === -1 || exdays === '-1') {
                                document.cookie = "optimizelySegments=0;path=/;domain=" + w.optlywidget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                document.cookie = "optimizelyEndUserId=0;path=/;domain=" + w.optlywidget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                document.cookie = "optimizelyEndUserId=0;path=/;domain=optimizely.com;expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                document.cookie = "optimizelyRedirectData=0;path=/;domain=" + w.optlywidget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                document.cookie = "optimizelyBuckets=0;path=/;domain=" + w.optlywidget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                document.cookie = "optimizelyEndUserId=0;path=/;domain=" + w.optlywidget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                document.cookie = "optimizelySegments=0;path=/;domain=" + w.optlywidget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                document.cookie = "optimizelyPendingLogEvents=0;path=/;domain=" + w.optlywidget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                document.cookie = cname + "=0;path=/;domain=" + w.optlywidget.domain + ";expires=Thu, 18 Dec 2013 12:00:00 UTC;";
                                //w.localStorage.clear();
                                //w.sessionStorage.clear();
                            }
                        } else {
                            cerror ? (cerror.innerHTML = "You need to specify a name for the cookie") : null;
                        }
                        if (cname && cname.indexOf("ssp") === -1) {
                            setTimeout(() => {
                                cerror.innerHTML = "";
                                if ((exdays != -1 && !w.location.search) || (exdays !== -1 && !w.location.search.match(cname + "=true"))) {
                                    w.optlywidget.setExperiment("&" + cname + "=true");
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
                            stls.textContent = w.optlywidget.styles.all;
                            d.getElementsByTagName("head")[0].appendChild(stls);
                        }
                        var content = '<div>' +
                            '<div class="positions">' +
                            '<span style="' + w.optlywidget.styles.versionWrapper + '">v: ' + w.optlywidget.version + '&nbsp;&nbsp;&nbsp; Ctrl+Shift+Y to toggle</span> <span data-pos="left">left</span> <span data-pos="center">center</span> <span data-pos="right">right</span>   <span id="removewidget" style="' + w.optlywidget.styles.xwrapper + '"> X </span>' +
                            '</div>' +
                            '<div id="optimizely_info_data" style="margin: 2px 24px 0 0;">' +
                            '<div>' +
                            '<input type="text" style="' + w.optlywidget.styles.inputField + '" placeholder="cookie name" id="cname_yuli" value=' + w.optlywidget.cookieName + ' />' +
                            '<button id="setcookie" style="' + w.optlywidget.styles.button + ';background : ' + w.optlywidget.styles.active_clr + '!important;">Set</button>' +
                            '<button id="remcookie" style="' + w.optlywidget.styles.button + ';background : #f00!important;">Remove</button></div>' +
                            '<div id="cerror" style="' + w.optlywidget.styles.error + '"></div>' +
                            '</div>' +
                            '<div id="optlyX"></div>' +
                            '<div id="optlyServerSide"></div>' +
                            '<div id="target"></div>' +
                            '<div id="bertie" class="hide" style="' + w.optlywidget.styles.results + '"></div>' +
                            '</div>';
                        var div = d.createElement("div");
                        div.id = "ccontainer_yuli";
                        div.style = w.optlywidget.styles.containerWrapper;
                        div.setAttribute("class", (d.cookie.match(/sspleft/ig) ? "left" : d.cookie.match(/sspright/ig) ? "right" : d.cookie.match(/sspcenter/ig) ? "center" : "left"));
                        div.insertAdjacentHTML("afterbegin", content);
                        if (!d.querySelector("#ccontainer_yuli")) {
                            d.getElementsByTagName("body")[0].appendChild(div);
                            //w.optlywidget.log("createwidget: widget container created");
                        }
                    },
                    addDOMEvents: () => {
                        d.querySelector("#setcookie").addEventListener("click", () => {
                            w.optlywidget.setCookie(w.optlywidget.cookieName, 60);
                        }, true);
                        d.querySelector("#remcookie").addEventListener("click", () => {
                            w.optlywidget.setCookie(w.optlywidget.cookieName, -1);
                        }, true);
                        d.querySelector("#removewidget").addEventListener("click", () => {
                            if (d.querySelectorAll("#ccontainer_yuli .positions span").length) {
                                d.querySelectorAll("#ccontainer_yuli .positions span").forEach((val, ind) => {
                                    let pos = val.getAttribute("data-pos");
                                    val.removeEventListener("click", w.optlywidget.setWidgetPosition.bind(null, pos));
                                });
                            }
                            //remove widget
                            if (d.getElementById("ccontainer_yuli")) {
                                d.getElementById("ccontainer_yuli").parentNode.removeChild(d.getElementById("ccontainer_yuli"));
                            }
                            //remove styles
                            if (d.getElementById("optly_tests")) {
                                d.getElementById("optly_tests").parentNode.removeChild(d.getElementById("optly_tests"));
                            }
                        }, false);
                        d.onkeydown = w.optlywidget.toggleWidget;
                        d.getElementById("cname_yuli").addEventListener("keyup", (e) => {
                            w.optlywidget.cookieName = e.target.value;
                        });

                        d.querySelectorAll("#ccontainer_yuli .positions span").forEach((val, ind) => {
                            let pos = val.getAttribute("data-pos");
                            val.addEventListener("click", w.optlywidget.setWidgetPosition.bind(null, pos), false);
                        });
                        //w.optlywidget.log("addDOMEvents: done");
                    },
                    setWidgetPosition: (pos, e) => {
                        let currentClass = w.optlywidget.cookieName2.substring(3);
                        let wdget = d.getElementById("ccontainer_yuli");
                        w.optlywidget.setCookie("ssp" + currentClass, -1);
                        w.optlywidget.cookieName2 = "ssp" + pos;
                        if (wdget) {
                            wdget.classList.remove(currentClass);
                            wdget.classList.add(pos);
                        }
                        w.optlywidget.setCookie(w.optlywidget.cookieName2, 30);
                    },
                    getOptlyServerSideTests: () => {
                        if (d.querySelector("#optlyServerSide")) {
                            var divWrap = d.getElementById("ss_tests") ? d.getElementById("ss_tests") : d.createElement("div");
                            !d.getElementById("ss_tests") ? (divWrap.style = w.optlywidget.styles.results) : null;
                            !d.getElementById("ss_tests") ? (divWrap.id = "ss_tests") : null;
                            var gettests = w.optimizelyData;
                            if (gettests) {
                                w.optlywidget.serverSideTests = [];
                                d.querySelector("#optlyServerSide").innerHTML = "";
                                w.optlywidget.serverSideTests.indexOf("#### Optly Server-side tests: ####") === -1 ? w.optlywidget.serverSideTests.push("#### Optly Server-side tests: ####") : null;
                                w.optlywidget.serverSideTests.push(JSON.stringify(gettests));

                            } else {
                                w.optlywidget.serverSideTests = [];
                                d.querySelector("#optlyServerSide").innerHTML = "";
                                w.optlywidget.serverSideTests.indexOf("#### No Optly Server-side experiments running ####") === -1 ? widget.serverSideTests.push("#### No Optly Server-side experiments running ####") : null;
                            }
                            divWrap.innerHTML = "<ul>" + w.optlywidget.serverSideTests.join("<br />") + "</ul>";
                            d.querySelector("#optlyServerSide").appendChild(divWrap);
                        } else {
                            w.optlywidget.getOptlyServerSideTests();
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
                                divWrap.innerHTML = "<div id=\"test_id_" + ind + "\" style='font-size : " + w.optlywidget.styles.font_size + ";border : 1px solid " + w.optlywidget.styles.main_clr + ";border-radius : 3px;margin : 0 0 5px;padding : 5px;'>ID: " + val + ",rv:<span id=\"test_version\">" + (optimizely.get('data').revision || optimizely.revision) + "</span><br />" + experiment.name + " </div>";
                                if (!d.querySelector("#test_id_" + ind)) {
                                    d.querySelector("#optlyX").appendChild(divWrap);
                                    experiment.variations.forEach(function (val, indx) {
                                        var div = d.createElement("div");
                                        div.style = "margin : 0;padding : 0 0 0 10px;";
                                        var isActive = (varName === val.name) ? true : false;
                                        var styles = 'color:' + w.optlywidget.styles.active_clr + ';';
                                        div.innerHTML = isActive ? "<div style=" + styles + "><span id=\"test_name\">" + val.name + " - " + val.id + "<span style='font-style:italic;font-size:'+w.optlywidget.styles.font_size+';'>(active)</span></div>" : "<div><span id=\"test_name\">" + val.name + " - " + val.id + "</span> - <a href='#' style=" + styles + " onclick=\"optlywidget.setExperiment(" + val.id + ")\">activate</a></div>";
                                        d.querySelector("#test_id_" + ind).appendChild(div);
                                    });
                                }
                            });
                        } else {
                            d.querySelector("#optlyX").innerHTML = "<div style='" + w.optlywidget.styles.results + "'>#### No Optimizely experiments running ####</div>";
                        }
                    },

                    initBertie: () => {
                        if (!(bertie && bertie.on)) {
                            w.optlywidget.log("bertie not available...exiting...");
                        } else {
                            let bertie_dom_log_wrapper = document.getElementById("bertie");
                            //w.optlywidget.log("bertie loaded...");
                            w.brty = "";
                            bertie.onAny(function (e) {
                                var type = e["@type"] || e.type || e._eventType;
                                //type.match(/siteData/i)?bertie_dom_log_wrapper.innerHTML="":null;
                                //w.optlywidget.log(" bertie.onAny fired...: ",type," , exists already?- ",!Boolean(bertie_dom_log_wrapper.textContent.match(type)));
                                bertie_dom_log_wrapper ?
                                    (
                                        bertie_dom_log_wrapper.classList.remove("hide"),
                                        bertie_dom_log_wrapper.innerHTML =
                                        !Boolean(bertie_dom_log_wrapper.textContent.match(type)) && (type === "tesco:UIExperimentRendered" || type.match("UIExperiment")) ?
                                            bertie_dom_log_wrapper.innerHTML + "<p><b>" + type + "</b> - <b>" + e.experimentName + "</b> - <b>" + e.variationKey + "</b></p>" + w.brty :
                                            !Boolean(bertie_dom_log_wrapper.textContent.match(type)) ?
                                                bertie_dom_log_wrapper.innerHTML + "<p><b>" + type + "</b></p>" + w.brty :
                                                bertie_dom_log_wrapper.innerHTML,
                                        w.brty = ""
                                    )
                                    : w.brty += "<p><b>" + type + "</b></p>";
                                if (e && type && (type === "tesco:UIExperimentRendered" || type.match("UIExperiment"))) {
                                    w.optlywidget.getOptlyServerSideTests();
                                }
                            });//END bertie.onAny
                            /*======*/
                        }// END else
                    }, //END initBertie()
                    poll4optlyX: () => {
                        if (!Boolean(d.getElementsByTagName("body")[0] && w.optimizely && (typeof w.optimizely.get === "function") && w.optimizely.get('state').getVariationMap())) {
                            if (w.optlywidget.optlyCounter < w.optlywidget.countMax) {
                                w.optlywidget.optlyCounter += 0.5;
                                setTimeout(w.optlywidget.poll4optlyX, 250);
                            } else {
                                d.querySelector("#optlyX").innerHTML = "<div style='" + w.optlywidget.styles.results + "'>#### No Optimizely tag present ####</div>";
                                return;
                            }
                        } else {
                            w.optlywidget.getOptlyClientSideTests();
                        }
                    },
                    poll4OptlyServerSide: () => {
                        if (typeof window.optimizelyData === "object") {
                            w.optlywidget.getOptlyServerSideTests();
                        } else {
                            if (w.optlywidget.sstestsCounter < w.optlywidget.countMax) {
                                w.optlywidget.sstestsCounter += 0.5;
                                setTimeout(w.optlywidget.poll4OptlyServerSide, 250);
                            } else {
                                d.querySelector("#optlyServerSide").innerHTML = "<div style='" + w.optlywidget.styles.results + "'>#### No Optly server-side experiments ####</div>";
                                return;
                            }
                        }
                    },
                    poll4Bertie: () => {
                        if (!(w.bertie && w.bertie.on)) {
                            if (w.optlywidget.bertieCounter < w.optlywidget.countMax) {
                                w.optlywidget.bertieCounter += 0.5; //console.error("bertie NOT avaialable...");
                                setTimeout(w.optlywidget.poll4Bertie, 500);
                            } else {
                                return;
                            }
                        } else {
                            w.optlywidget.initBertie();
                        }
                    },
                    init: () => {
                        w.optlywidget.createwidget();
                        w.optlywidget.addDOMEvents();
                        w.optlywidget.poll4optlyX();
                        //w.optlywidget.poll4target();
                        w.optlywidget.poll4OptlyServerSide();
                        w.optlywidget.poll4Bertie();
                    }
                };
                //w.optlywidget.log("startWidget: window.optlywidget created");
                w.optlywidget.init();
            } else { //console.error("body not available...polling again");
                w.requestAnimationFrame(startWidget);
            }
        }; // startWidget
        function poll4complete() {
            if (document.readyState === "complete") {
                startWidget();
            } else {
                w.requestAnimationFrame(poll4complete);
            }
        } poll4complete();
        d.addEventListener("DOMContentLoaded", function poll4ready() {
            if (document.readyState === "complete") {
                startWidget();
            } else {
                w.requestAnimationFrame(poll4ready);
            }
        });
        // _log("running...");
    })(unsafeWindow, document);
}