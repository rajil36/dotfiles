!function(o){o.shouldOpenDropdown()?window.location="extensionDropdown.html":o.shouldOpenLogin()?o.shouldOpenLogin()&&o.LPContentScriptFeatures.react_login&&(window.location="index.html"):window.location="lp_toolstrip.html?browseraction=1",window.bg=o.LPPlatform.getBackgroundInterface()}(chrome.extension.getBackgroundPage()),window.addEventListener("DOMContentLoaded",function(){Topics.get(Topics.INITIALIZED).publish(),ExtensionDropdown.open()});
//# sourceMappingURL=sourcemaps/initializeLogin.js.map
