// ==UserScript==
// @name         Optimizely X Widget
// @namespace    https://*/*
// @version      6.7.0
// @encoding     utf-8
// @description  Optimizely X Widget
// @author       Yuliyan Yordanov
// @match        https://domain.here/*
// @include      http://*/*
// @include      https://*/*
// @exclude      /(condeco|github|aha|jira|timex|litmos|payslip|launchandlearn|app\.optimizely|webex|ukirp365)/
// @grant        none
// @updateURL    https://raw.githubusercontent.com/jukatax/optimizelyWidget/master/source_js.js
// @downloadURL  https://raw.githubusercontent.com/jukatax/optimizelyWidget/master/source_js.js
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==
/*jshint esversion:6*/
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


    // start the widget when the body is present
(function (w, d) {
    "use strict";
    w.optimizely = w.optimizely || [];
    w.optimizely.push({
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


    // start the widget when the body is present
    let startWidget = () => {
        if (d.querySelectorAll("head") && d.querySelectorAll("head").length === 1 && d.querySelectorAll("body") && d.querySelectorAll("body").length === 1) {
            w.widget = {
                version: '6.7.0',
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
                    all: '#ccontainer_yuli{position : fixed; z-index : 9999999999; top : 10px;width: auto;min-width: 280px;max-width: 500px; left : 10px; padding : 12px 5px 5px; background : #f4f7f1; box-shadow : 0 0 5px #555; -moz-box-shadow : 0 0 5px #555; -webkit-box-shadow : 0 0 5px #555;color: #19405b;font-family : Helvetica, Arial;font-size: 12px;border-radius: 3px;transition : left 1s ease-in-out;max-height: 100%;overflow-y: scroll;}' +
                        '#ccontainer_yuli div{text-align:left;}' +
                        '#ccontainer_yuli #optlyServerSide div ul{padding:0;margin: 0;}' +
                        '#ccontainer_yuli .positions{ font-size : 0.8em;line-height : 8px;font-style: italic;display: flex; justify-content: space-around; align-items : center;}' +
                        '#ccontainer_yuli .positions span{ display : block; }' +
                        '#ccontainer_yuli .positions span:hover{ cursor:pointer; text-decoration : underline; }' +
                        '#ccontainer_yuli.center{left : calc(50% - 165px);}' +
                        '#ccontainer_yuli.left{left : 10px;}' +
                        '#ccontainer_yuli.right{left  :calc(100% - 340px);}' +
                        '#ccontainer_yuli.hide{display : none!important;}'
                },
                clientSideTests: [],
                serverSideTests: [],
                targetTests: [],
                cookieName: "_qa",
                /* Initial cookie name for QA */
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
                setCookie: (name, exdays) => {
                    var d = new Date(),
                        cname = name,
                        cerror = document.getElementById("cerror");
                    if (cname) {
                        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                        var expires = "expires=" + d.toUTCString();
                        document.cookie = cname + "=1;path=/;domain=" + widget.domain + ";" + expires;
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
                            w.localStorage.clear();
                            w.sessionStorage.clear();
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
                        d.head.appendChild(stls);
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
                        d.body.appendChild(div);
                    }
                },
                addDOMEvents: () => {
                    d.querySelector("#setcookie").addEventListener("click", () => {
                        widget.setCookie(w.widget.cookieName, 0.5);
                    }, true);
                    d.querySelector("#remcookie").addEventListener("click", () => {
                        widget.setCookie(w.widget.cookieName, -1);
                    }, true);
                    d.querySelector("#removewidget").addEventListener("click", () => {
                        d.body.removeChild(d.getElementById("ccontainer_yuli"));
                        /* set widget position */
                        d.querySelectorAll("#ccontainer_yuli .positions span").forEach((val, ind) => {
                            let pos = val.getAttribute("data-pos");
                            val.removeEventListener("click", w.widget.setWidgetPosition.bind(null, pos));
                        });
                        //remove styles
                        if (d.getElementById("optly_tests")) {
                            d.head.removeChild(d.getElementById("optly_tests"));
                        }
                    }, false);
                    d.onkeydown = widget.toggleWidget;
                    d.getElementById("cname_yuli").addEventListener("keyup", (e) => {
                        w.widget.cookieName = e.target.value;
                    });
                    /* set widget position */
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
                    var divWrap = d.createElement("div");
                    divWrap.style = widget.styles.results;
                    var gettests = w.optimizelyData;
                    if (gettests && gettests.length) {
                        widget.serverSideTests.push("#### Optly Server-side tests detected: ####");
                        Array.prototype.slice.call(gettests).forEach(function (val, ind, arr) {
                            val ? (widget.serverSideTests.push(JSON.stringify(val))) : null;
                        });
                        !widget.serverSideTests.length > 1 ? widget.serverSideTests[0] = "#### No Optly Server-side experiments running ####" : null;
                    } else {
                        widget.serverSideTests.push("#### No Optly Server-side experiments running ####");
                    }
                    divWrap.innerHTML = "<ul>" + widget.serverSideTests.join("<br />") + "</ul>";
                    if (d.querySelector("#optlyServerSide")) {
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
                            if ( /*typeof varName === "string"*/ true) {
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
                getTargetTests: () => {
                    var divWrap = d.createElement("div"),
                        to, tests;
                    divWrap.style = widget.styles.results;
                    if (!widget.isTargetPresent) {
                        if ((w.adobe && w.adobe.target && w.adobe.target.VERSION) || w.mbox) {
                            widget.isTargetPresent = true;
                        }
                    }
                    //var tests = w.mboxCurrent.fe.fd.match(/\<\!\-\-\n(.*\n)+\-\-\>/gi);
                    tests = (w.mboxCurrent && w.mboxCurrent.fe && w.mboxCurrent.fe.fd) ? w.mboxCurrent.fe.fd.match(/campaign:.*\nexperience:.*\n/gi) : w.testversion;
                    if (tests && tests.length && !tests.substring) {
                        widget.targetTests.push("#### Target tests detected: ####");
                        tests.forEach(function (val, ind, arr) {
                            widget.targetTests.push(val);
                        });
                    } else if (tests && tests.length) {
                        widget.targetTests.push("#### Target tests detected: ####");
                        widget.targetTests.push(tests.replace(/,campaign/gi, "<br />campaign"));
                    } else {
                        widget.targetTests.push("#### No Target experiments running ####");
                    }
                    divWrap.innerHTML = widget.targetTests.join("<br />");
                    if (d.querySelector("#target")) {
                        d.querySelector("#target").appendChild(divWrap);
                    } else {
                        widget.getTargetTests();
                    }

                },
                initBertie: () => {
                    if (!(bertie && bertie.on)) {
                        console.log("bertie not available...exiting...");
                    } else {
                        let bertie_dom_log_wrapper = document.getElementById("bertie");
                        console.log("bertie loaded...");
                        bertie.onAny(function (e) {
                            console.log("bertie fired...: ", e.type)
                        });
                        bertie.on("UISearch", function (e) {
                            //console.log("UISearch: ",e);
                            //console.log("UISearch e.searchTerm: ",e.searchTerm);
                            bertie_dom_log_wrapper.innerHTML = bertie_dom_log_wrapper.innerHTML + "<p><b>UISearch e.searchTerm</b>: " + e.searchTerm + "</p>";
                        });
                        bertie.on("siteData", function (e) {
                            bertie_dom_log_wrapper.innerHTML = "#### Bertie events ####<br />";
                            //console.log("siteData: ",e);
                            bertie_dom_log_wrapper.innerHTML = bertie_dom_log_wrapper.innerHTML + "<p><b>siteData</b>: " + e.country + " - " + e.storeId + " - " + e.buildVersion + "</p>";
                        });
                        bertie.on("customerData", function (e) {
                            //console.log("customerData: ",e);
                            //console.log("customerData time: ",e);
                            document.getElementById("bertie").classList.remove("hide");
                            bertie_dom_log_wrapper.innerHTML = bertie_dom_log_wrapper.innerHTML + "<p><b>customerData</b>: " + JSON.stringify(e.flags) + "</p>";
                        });
                        bertie.on("pageData", function (e) {
                            //gStart = e;
                            //console.log("pageData: ",e);
                            //console.log("pageData time: ",e);
                            bertie_dom_log_wrapper.innerHTML = bertie_dom_log_wrapper.innerHTML + "<p><b>pageData</b>: " + e.superDepartment + " " + e.pageTitle + "</p>";
                        });
                        bertie.on("UIEventBasket", function (e) {
                            //console.log("UIEventBasket: ",e);
                            //console.log("UIEventBasket time: ",e);
                            bertie_dom_log_wrapper.innerHTML = bertie_dom_log_wrapper.innerHTML + "<p><b>UIEventBasket</b>: " + e.type + "</p>";
                        });
                        bertie.on("app:routeChanged", function (e) {
                            //console.log("app:routeChanged: ",e);
                            //console.log("app:routeChanged time: ",e);
                            bertie_dom_log_wrapper.innerHTML = bertie_dom_log_wrapper.innerHTML + "<p><b>app:routeChanged</b>: " + e.path + "</p>";
                        });

                        bertie.on("app:routeChanging", function (e) {
                            //console.log("app:routeChanged: ",e);
                            //console.log("app:routeChanged time: ",e);
                            bertie_dom_log_wrapper.innerHTML = bertie_dom_log_wrapper.innerHTML + "<p><b>app:routeChanged</b>: " + e.path + "</p>";
                        });
                        bertie.on("UIEventFilterOp", function (e) {
                            //console.log("UIEventFilterOp: ",e);
                            //console.log("UIEventFilterOp time: ",e);
                            bertie_dom_log_wrapper.innerHTML = bertie_dom_log_wrapper.innerHTML + "<p><b>UIEventFilterOp</b></p>";
                        });

                        bertie.on("UIExperimentRendered", function (e) {
                            //console.log("UIExperimentRendered: ",e);
                            //console.log("UIExperimentRendered time: ",e);
                            bertie_dom_log_wrapper.innerHTML = bertie_dom_log_wrapper.innerHTML + "<p><b>UIExperimentRendered</b></p>";
                            widget.getOptlyServerSideTests();
                        });
                        //extra events
                        bertie.on("UIRenderContent", function (e) {
                            //console.log("UIRenderContent: ",e);
                            //console.log("UIRenderContent time: ",e);
                            bertie_dom_log_wrapper.innerHTML = bertie_dom_log_wrapper.innerHTML + "<p><b>UIRenderContent</b></p>";
                        });
                        //extra events
                        bertie.on("UIEventSlotBooked", function (e) {
                            //console.log("UIEventSlotBooked: ",e);
                            //console.log("UIEventSlotBooked time: ",e);
                            bertie_dom_log_wrapper.innerHTML = bertie_dom_log_wrapper.innerHTML + "<p><b>UIEventSlotBooked</b>:" + e.locationId + "</p>";
                        });
                        // !!!!!! ======== handle pagination ======== !!!!!!!
                        bertie.on("UIImpression", function (e) {
                            //console.log("UIImpression: ",e);
                            //console.log("UIImpression time: ",performance.now());
                            bertie_dom_log_wrapper.innerHTML = bertie_dom_log_wrapper.innerHTML + "<p><b>UIImpression:" + e.type + "</b>, identifier:" + e.identifier + " total items:" + e.payload.items.length + " </p>";
                        });
                        bertie.on("UIContentClicked", function (e) {
                            //console.log("UIContentClicked: ",e);
                            bertie_dom_log_wrapper.innerHTML = bertie_dom_log_wrapper.innerHTML + "<p>UIContentClicked " + e.component + "</p>";
                        });
                        bertie.on("UIEventBasicEvent", function (e) {
                            //console.log("UIEventBasicEvent: ",e);
                            bertie_dom_log_wrapper.innerHTML = bertie_dom_log_wrapper.innerHTML + "<p>UIEventBasicEvent.type:" + e.type + "</p>";
                            bertie_dom_log_wrapper.innerHTML = bertie_dom_log_wrapper.innerHTML + "<p>UIEventBasicEvent.value:" + e.value + "</p>";
                        });
                        bertie.on("tesco:UIRenderContent", function (e) {
                            //console.log("UIEventBasicEvent: ",e);
                            bertie_dom_log_wrapper.innerHTML = bertie_dom_log_wrapper.innerHTML + "<p>tesco:UIRenderContent " + e + "</p>";
                        });
                        bertie.on("tesco:customerData", function (e) {
                            //console.log("UIEventBasicEvent: ",e);
                            bertie_dom_log_wrapper.innerHTML = bertie_dom_log_wrapper.innerHTML + "<p>tesco:customerData " + e + "</p>";
                        });
                    }
                }, //initBertie
                poll4optlyX: () => {
                    if (!Boolean(d.body && w.optimizely && (typeof w.optimizely.get === "function") && w.optimizely.get('state').getVariationMap())) {
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
                poll4target: () => {
                    if (!Boolean((w.mboxCurrent && w.mboxCurrent.fe && w.mboxCurrent.fe.fd) || w.testversion || w.mboxVersion)) {
                        if (widget.targetCounter < widget.countMax) {
                            widget.targetCounter += 0.5;
                            setTimeout(widget.poll4target, 250);
                        } else {
                            d.querySelector("#target").innerHTML = "<div style='" + widget.styles.results + "'>#### No Target present ####</div>";
                            return;
                        }
                    } else {
                        widget.getTargetTests();
                    }
                    //return Boolean((w.mboxCurrent && w.mboxCurrent.fe && w.mboxCurrent.fe.fd) || w.testversion);
                },
                poll4OptlyServerSide: () => {
                    if (typeof window.optimizelyData === "object" && window.optimizelyData.length) {
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
                    widget.poll4target();
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