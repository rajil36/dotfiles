Feature={isEnabled:function(e,n,i,t){var a="lmiapi/feature-switch/is-enabled/"+e+"/"+n;LPServer.lmiapi.jsonRequest({url:a,type:"GET",data:{},success:function(e){i(e.enabled)},error:function(e){"function"==typeof t&&t(e)}})}};
//# sourceMappingURL=sourcemaps/feature.js.map
