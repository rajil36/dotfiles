!function(e){var a;e.getBackgroundInterface=(a=null,function(e){return null===a&&((e=e||{}).source=window,e.direct=!0,a=Interfaces.createInstance(Interfaces.BackgroundInterface,e)),a}),e.getUILanguage=function(){return"en-US"},e.fill=function(e){lpevent("m_mf"),fillaid(e,!0,"notrack")}}(LPPlatform),function(e,a){e.getFavicon=function(e){e.callback&&e.callback(null)},e.onAuthRequired=function(e){return!1},e.openLogin=function(){LPContentScriptFeatures.react_login?openURL(getchromeurl("index.html")):e.openTabDialog("loginSimple")},e.once=function(e,a,t){if(e)var n=e(function(){n(),a.apply(t,arguments)})},e.getBigIcons=function(e,a){var t=(a=a||"big")+"icons",n=opendb();if(createDataTable(n),n){var r=function(a,t){e(t.rows.length>0&&null!==t.rows.item(0).data?t.rows.item(0).data:"")};if(g_indexeddb){var i={rows:{item:function(e){return this[e]},length:0}};n.transaction("LastPassData","readonly").objectStore("LastPassData").openCursor(IDBKeyRange.only(db_prepend(g_username_hash)+"_"+t)).onsuccess=function(e){var a=e.target.result;a?(i.rows[i.rows.length]=a.value,i.rows.length++,a.continue()):r(null,i)}}else n.transaction(function(e){e.executeSql("SELECT * FROM LastPassData WHERE username_hash=? AND type=?",[db_prepend(g_username_hash),t],r,function(e,a){console_log(a)})})}},e.saveBigIcons=function(e,a){var t=(a=a||"big")+"icons",n=opendb();createDataTable(n),n&&(g_indexeddb?n.transaction("LastPassData","readwrite").objectStore("LastPassData").put({username_hash:db_prepend(g_username_hash),type:t,data:e,usertype:db_prepend(g_username_hash)+"_"+t}):n.transaction(function(a){a.executeSql("REPLACE INTO LastPassData (username_hash, type, data) VALUES (?, ?, ?)",[db_prepend(g_username_hash),t,e],function(e,a){console_log("server.js : inserted")},function(e,a){console_log(a)})}))},e.updateBigIcons=function(){};var t=function(e,a){for(var t in e){var n=a[t];n&&(n.group=e[t])}},n,r,i,o,s,c,l,u,f;e.refreshGroupNames=function(e){e&&(t(e.sites,g_sites),t(e.notes,g_securenotes),t(e.applications,g_applications))},e.useDialogWindows=function(){return Preferences.get("htmlindialog")},e.extendSendImproveParams=function(e,a){a()},n={},r=function(e,a){return function(){e.apply(this,arguments),a.apply(this,arguments)}},e.openTabDialog=function(a,t){var i={createAccountSimple:!0,siteTutorial:!0},o=a+(t?"-"+JSON.stringify(t):""),s=n[o];if(s)s.activate();else{var c={dialogWindow:e.useDialogWindows()&&!(t&&t.virtualKeyboard)},l={url:getchromeurl("tabDialog.html?dialog="+a),loadHandler:function(e){e.getTop().LPTabDialog.openDialog(a,t,c),n[o]=e},closeHandler:function(){delete n[o]},tabId:t&&t.tabId?t.tabId:void 0};if(l.tabId)e.navigateTab(l);else if(c.dialogWindow&&!i[a]){var u=Preferences.get("dialogSizePrefs"),f=u[a];l.features={height:f?f.height:600,width:f?f.width:800,left:f?f.left:0,top:f?f.top:0},l.features.width>window.screen.availWidth&&(l.features.width=window.screen.availWidth,l.features.left=0),l.features.height>window.screen.availHeight&&(l.features.height=window.screen.availHeight,l.features.top=0),l.closeHandler=r(l.closeHandler,function(e){u[a]={height:e.outerHeight,width:e.outerWidth,left:e.screenLeft||e.screenX,top:e.screenTop||e.screenY},Preferences.set("dialogSizePrefs",u),delete n[o]}),e.openDialogWindow(l)}else if(i[a])e.openTab(l);else switch(Preferences.get("openpref")){case"tabs":e.openTab(l);break;case"windows":e.openWindow(l);break;case"same":e.openSame(l)}}},e.stringifyFeatures=function(e){var a=[];for(var t in e)a.push(t+"="+e[t]);return a.join(",")},e.doAjax=function(e){LPServer.ajax(e)},e.ajax=function(a){isOffline()?a.error&&a.error(null,null,"offline"):e.doAjax(a)},e.isEdge=function(){return is_edge()},e.copyDataIfEdge=function(a){return e.isEdge()&&void 0!==a?JSON.parse(JSON.stringify(a)):a},e.setUserPreference=(i=e.setUserPreference,function(e,a){i(e,a),g_userprefs_changed[e]=a}),e.setGlobalPreference=(o=e.setGlobalPreference,function(e,a){o(e,a),g_gblprefs_changed[e]=a}),e.writePreferences=function(){lpWriteAllPrefs()},e.closePopovers=function(){},e.activeOverlayTab=void 0,e.showModalOverlay=function(a){"function"==typeof a&&e.getCurrentTabDetails(function(t){t&&t.tabURL&&t.tabURL.indexOf(getchromeurl(""))<0&&(e.activeOverlayTab=t.tabID,a(t.tabID))})},e.removeModalOverlay=function(e){},e.hideYoureAlmostDoneMarketingOverlay=function(e){},s={},c={},l={},u={},f={},a.LPTabs={get:function(e){if(e.interface){var a=[];for(var t in u)u[t].tabDetails.interfaceName===e.interface&&a.push(u[t]);return e.callback&&e.callback(a),a}if(void 0!==e.tabID){var n=u[e.tabID];if(n)return e.callback&&e.callback(n),n;if(e.callback){var r=l[e.tabID];r||(r=l[e.tabID]=[]),r.push(e.callback)}}return null}},e.getUnavailablePreferences=function(){return{clearClipboardSecsVal:!can_clear_clipboard(),openpopoverHk:!1,pollServerVal:g_nopoll,storeLostOTP:"0"===g_prefoverrides.account_recovery,showvault:g_hidevault||g_hideshowvault,homeHk:g_hidevault||g_hideshowvault,saveallHk:g_hidesaedhotkey,searchHk:g_hidesearch,usepopupfill:!g_offer_popupfill,recentUsedCount:g_hiderecentlyusedlistsize,searchNotes:g_hidenotes,idleLogoffVal:!(g_is_win||g_is_mac||g_is_linux),enablenamedpipes:lppassusernamehash||!(g_is_win||g_is_mac||g_is_linux)||is_chrome_portable(),enablenewlogin:!0}},e.getWindowIDs=function(){var e={};for(var a in u)u[a].tabDetails.windowID&&(e[u[a].tabDetails.windowID]=!0);return Object.keys(e)},e.getWindowTabDetails=function(e){var a=[];for(var t in u){var n=u[t];n.tabDetails.windowID===e&&a.push(n.tabDetails)}return a},e.initializeRequestFramework=function(e){var a=null,t=e.tabDetails||{},n=LPMessaging.getNewMessageSourceID(),r=!1,i=e.frameIdentity,o=!1,d=function(a){try{var t=!o;return t?(a.frameID=n,e.sendContentScript(a)):t}catch(e){return!1}},g=function(e){return d({type:"backgroundResponse",data:e})},p=function(o){if(a=u[t.tabID],r=o.top,void 0!==t.tabID&&(r&&(c[t.tabID]=n),o.frameIdentity&&(i=t.tabID+"-"+o.frameIdentity)),d({type:"initialization",data:{tabID:t.tabID,frameID:n,topFrameID:c[t.tabID],request:o}}),o.extendFrame){var l=f[i].frameID,p=s[l];s[l]=function(e){d(e),p(e)}}else s[n]=d;if(o.interfaceName&&Interfaces.hasOwnProperty(o.interfaceName)){t.interfaceName||(t.interfaceName=o.interfaceName);var b=function(e){return LPMessaging.makeRequest(d,{type:"contentScriptRequest",sourceFrameID:0,data:e},g)},m=Interfaces.createInstance(Interfaces[o.interfaceName],{instance:o.extendFrame?f[i].interface:null,direct:!1,context:e.context||"background",requestFunction:b});if(i){var D=f[i];D&&D.frameID!==n&&D.disconnect(),f[i]={interface:m,disconnect:h,frameID:n}}"number"!=typeof t.tabID&&!t.tabID||o.interfaceName!==t.interfaceName||o.extendFrame||(a&&!r||(a&&a.disconnect(),a=u[t.tabID]=new LPTab(t)),a.addFrame(m,{topWindow:r,frameID:n,contentScriptRequester:b,childFrameCount:o.childFrameCount},h)),e.interfaces&&e.interfaces[o.interfaceName]&&e.interfaces[o.interfaceName](m),e.callback&&e.callback(m)}else a||(a=u[t.tabID]=new LPTab(t))},b=Raven.wrap(function(e){switch(e.type){case"backgroundRequest":LPMessaging.handleRequest(Interfaces.BackgroundInterface,e.data,g,{additionalArguments:{tabURL:t.tabURL,tabID:t.tabID,windowID:t.windowID,frameID:n,top:r}});break;case"contentScriptRequest":case"contentScriptResponse":if(0===e.frameID)LPMessaging.handleResponse(e.data);else if(e.frameID){var i=s[e.frameID];i&&i(e)}break;case"initialize":p(e.data);break;case"disconnect":h();break;case"initialized":r&&l[t.tabID]&&(l[t.tabID].forEach(function(e){e(a)}),delete l[t.tabID])}}),h=function(){if(!o){o=!0,delete s[n],delete f[i],c[t.tabID]===n&&delete c[t.tabID];var a=u[t.tabID];a&&(a.removeFrame(n),a.isEmpty()&&delete u[t.tabID]),e.onDisconnect&&e.onDisconnect()}};return{frameID:n,requestHandler:b,disconnectHandler:h}}}(LPPlatform,this);
//# sourceMappingURL=sourcemaps/platformBackground.js.map