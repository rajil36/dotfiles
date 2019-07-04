function doc_get_form_equivalents(e){if(e||(e=LP_derive_doc()),!e)return[];if(!e.body)return[];var n=sprintf;g_isie&&init_LPfn()&&LPfn&&(n=LPfn.sprintf);var t=new RegExp("container|form|box|wrapper|youama-login-window|youama-register-window","i"),r,o,i=100,l=!1,a=[],s=0,_=e.body.children,f=_.length;if(Checkpoint.assert(f<i,"document too complex, "+get_doc_location_href(e)),f>i&&(f=i),LP_has_youama(e)){var m=LP_get_youama_fields(e);if(m.login_form_container&&m.regis_form_container)return[m.login_form_container,m.regis_form_container]}for(r=0;r<f;r++){var u=_[r].tagName.toUpperCase();if(lp_in_array(u,["DIV","FORM","SECTION","HEADER"])){if(elt_is_formlike_container(_[r])){var g=p(_[r],t);for(s+=g.length,o=0;o<g.length;o++)a.push(g[o])}}else"INPUT"==u&&(l=!0)}return l&&0==a.length&&a.push(e.body),verbose_log(n("Found %d form equivalents on this page",s)),a;function p(e,t,r){if(!e)return[];var o=e.ownerDocument,i,l,a=!0;r||(r=0);var s=[],_=[],f=0,m=[],u=e.children,g=0;if(!u||0==u.length)return[];for(i=0;i<u.length;i++)if(lp_in_array(u[i].tagName.toUpperCase(),["DIV","SECTION","HEADER"])&&lpIsVisible(u[i],a)){var h=p(u[i],t,r+1);for(l=0;l<h.length;l++)_.push(h[l]);verbose_log(n("child div %s has %d forms ",LP_getname(u[i]),h.length))}else"FORM"==u[i].tagName.toUpperCase()?!is_search_form(o,u[i])&&popupfill_shoulddoform(o,u[i])&&_.push(u[i]):"INPUT"==u[i].tagName.toUpperCase()&&popupfill_shoulddofield(o,u[i])&&(verbose_log(n("child input %s found in %s",LP_getname(u[i]),LP_getname(e))),m.push(u[i]));return("DIV"==e.tagName||"FORM"==e.tagName)&&m.length>0?popupfill_shoulddoform(o,e)?(s.push(e),verbose_log(n("FOUND %d child forms and found inputs in this div %s, treating all together as one",_.length,LP_getname(e)))):verbose_log(n("FOUND child forms in this div %s but intentionally skipping it",0,LP_getname(e))):(s=_,verbose_log(n("FOUND %d child forms in this div %s",s.length,LP_getname(e)))),s}}function elt_is_formlike_container(e,n){if(!e)return!1;var t=e.ownerDocument,r,o,i=!0,l=LP_createXPathFromElement(t,e);if(l||(l=LP_pickFormName(t,e)),!lpIsVisible(e,i))return!1;if(e.children.length<=0)return!1;var a=e.getElementsByTagName("input"),s=[],_,f,m;if(a){if(a.length<=0)return!1;var u=a.length;for(Checkpoint.assert(u<MAX_INPUTS_SOFT,"formlike container "+LP_getname(e)+" is too complex"),u>MAX_INPUTS_SOFT&&(u=MAX_INPUTS_SOFT),r=0;r<u;r++)if(popupfill_shoulddofield(t,a[r])){s.push(a[r]);break}}return!(s.length<=0)&&(s.length>0&&(verbose_log("detected mammaliaforme "+LP_getname(e)),!0))}var g_lp_form_num=1;function LP_pickFormName(e,n){var t="none";if(null!=n&&(null==(t=LP_getname(n,LP_GETNAME_FAVOR_ID_OVER_NAME))||t.length<=0)){if(null!=n.action&&"string"==typeof n.action&&n.action.length>=0||null!=n.className&&n.className.length>=0){var r=n.action;"string"!=typeof r&&(r=n.getAttribute("action")),t="FF"+r+n.className}else t="none";if("FF"==t||"none"==t){var o=n.getAttribute("lpformnum");o||(o=g_lp_form_num++,n.setAttribute("lpformnum",o)),t+="lpformnum"+o}}return t}function LP_getFormEquivalent(e,n){return n?(e||(e=n.ownerDocument),e&&n.form?n.form:null):null}
//# sourceMappingURL=sourcemaps/forms_cs.js.map
