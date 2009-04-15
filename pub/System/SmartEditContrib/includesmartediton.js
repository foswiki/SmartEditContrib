function include_dom(script_filename) {
    var html_doc = document.getElementsByTagName('head').item(0);
    var js = document.createElement('script');
    js.setAttribute('language', 'javascript');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', script_filename);
    html_doc.appendChild(js);
    return false;
}
include_dom(wikismartScriptURL+"mochikit/lib/MochiKit/MochiKit.js");
include_dom(wikismartScriptURL+"wikismartEngine.js");
include_dom(wikismartScriptURL+"wikismartActions.js");
include_dom(wikismartScriptURL+"smartEditUI.js");
include_dom(wikismartScriptURL+"wikismartEvents.js");
include_dom(wikismartScriptURL+"smartEditAutoCompletion.js");
include_dom(wikismartScriptURL+"smartEditDynamicDivision.js");

