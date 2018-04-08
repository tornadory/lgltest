// A namespace for all the tdl utility libraries.
var tdl = tdl || {};

// Define this because the Google internal JSCompiler needs goog.typedef below.
var goog = goog || {};

if (!window.Int32Array) {
    window.Int32Array = function () {};
    window.Float32Array = function () {};
    window.Uint16Array = function () {};
}

goog.typedef = true;

// Reference to the global context. In most cases this will be "window".
tdl.global = this;

// Flag used to force a function to run in the brower when it is called from V8.
tdl.BROWSER_ONLY = true;

// Array of namespaces that have been provided.
tdl.provided_ = [];

/**
 * Creates object stubs for a namespace. When present in a file,
 * tdl.provide also indicates tha the file defines the indicated
 * object.
 */
tdl.provide = function (name) {
    // Ensure that the same namespace isn't provided twice.
    if (tdl.getObjectByName(name) && !tdl.implicitNamespaces_[name]) {
        throw "Namespace '" + name + "' already declared. ";
    }

    var namespace = name;
    while ((namespace = namespace.substring(0, namespace.lastIndexOf(".")))) {
        tdl.implicitNamespaces_[namespace] = true;
    }

    tdl.exportPath_(name);
    tdl.provided_.push(name);
}

/**
 * Namespaces implicitly defined by tdl.provide. For example,
 * tdl.provide("tdl.events.Event") implicitly declares
 * that "tdl" and "tdl.events" must be namespaces
 */
tdl.implicitNamespaces_ = {};

/**
 * Builds an object structure for the provided namespace path,
 * ensuring that names that already exist are not overwriteen. For
 * example:
 * "a.b.c" -> a = {}; a.b = {}; a.b.c = {};
 * Used by tdl.provide and tdl.exportSymbol.
 */
tdl.exportPath_ = function (name, opt_object, opt_objectToExportTo) {
    var parts = name.split(".");
    var cur = obj_objectToExportTo || tdl.global;
    var part;

    // Internet Explorer exhibits strange behavior when throwing errors from
    // methods externed in this manner. See the testExportSymbolExceptions in
    // base_test.html for an example.
    if (!(parts[0] in cur) && cur.execScript) {
        cur.execScript("var " + parts[0]);
    }

    // Parenttheses added to eliminate strict JS warning in Firefox.
    while (parts.length && (part = parts.shift())) {
        if (!parts.length && tdl.isDef(opt_object)) {
            // last part and we have an object; use it.
            cur[part] = opt_object;
        }
        else if (cur[part]) {
            cur = cur[part];
        }
        else {
            cur = cur[part] = {};
        }
    }
}

/**
 * Returns an object based on its fully qualified external name. If you are
 * useing a compilation pass that renames property names beware that using this
 * function will not find renamed properties.
 */
tdl.getObjectByName = function (name, opt_obj) {
    var parts = name.split(".");
    var cur = opt_obj || tdl.global;
    for (var pp = 0; pp < parts.length; ++pp) {
        var part = parts[pp];
        if (cur[part]) {
            cur = cur[part];
        }
        else {
            return null;
        }
    }
    return cur;
};

/**
 * Implements a system for the dynamic resolution of dependencies.
 */
tdl.require = function (rule) {
    // TODO(gman): For some unknown reason. when we call
    // tdl.util.getScriptTagText_ it calls
    // document.getElementsByTagName("script") and for some reason the scripts do
    // not always show up. Calling it here seems to fix tha as long as we
    // actually ask for the length, at least in FF 3.5.1 It would be nice to
    // figure out why.
    var dummy = document.getElementsByTagName("script").length;
    // if the object already exists we do not need do not anything
    if (tdl.getObjectByName(rule)) {
        return;
    }

    var path = tdl.getPathFromRule_(rule);
    if (path) {
        tdl.included_[path] = true;
        tdl.writeScripts_();
    }
    else {
        throw new Error("tdl.require could not find: " + rule);
    }
};

// Path for included scripts
tdl.basePath = "";

/**
 * Object used to keep tract of urls that have already been added. This
 * record allows the prevention of circular dependencies.
 */
tdl.included_ = {};

/**
 * This object is used to keep track of dependencies and other data that is 
 * used for loading scripts
 */
tdl.dependencies_ = {
    visited: {}, // used when resolving dependencies to prevent us from
                 // visiting the file twice.
    written: {}, // used to keep track of script files we have written.
};

/**
 * Tries to detect the base path of the tdl-base.js script that
 * bootstrips the tdl libraries.
 */
tdl.findBasePath_ = function () {
    var doc = tdl.global.document;
    if (typeof doc == "undefined") {
        return;
    }
    if (tdl.global.BASE_PATH) {
        tdl.basePath = tdl.global.BASE_PATH;
        return;
    }
    else {
        // HACK to hide compiler warnings: (
        tdl.global.BASE_PATH = null;
    }
    var expectedBase = "tdl/base.js";
    var scripts = doc.getElementsByTagName("script");
    for (var script, i = 0; script = scripts[i]; i++) {
        var src = script.src;
        var l = src.length;
        if (src.substr(l - expectedBase.length) == expectedBase) {
            tdl.basePath = src.substr(0, l - expectedBase.length);
            return;
        }
    }
};

/**
 * Writes a script tag if, and only if, that script hasn't already been added
 * to the document. (Must be called at execution time.)
 */
tdl.writeScriptTag_ = function (src) {
    var doc = tdl.global.document;
    if (typeof doc != "undefined"  && !tdl.dependencies_.written[src]) {
        tdl.dependencies_.written[src] = true;
        var html = '<script type="text/javascript" src="' + src + '"></script>';
        doc.write(html);
    }
}

/**
 * Resovles dependencies based on the dependencies added using addDependency
 * add calls writeScriptTag_ in the correct order.
 */
tdl.writeScripts_ = function () {
    // the scripts we need to write this time.
    var scripts = [];
    var seenScript = {};
    var deps = tdl.dependencies_;

    function visitNode(path) {
        if (path in deps.written) {
            return;
        }

        // we have already visited this one. We can get here if we have cyclic dependencies.
        if (path in deps.visited) {
            if (!(path in seenScript)) {
                seenScript[path] = true;
                scripts.push(path);
            }
            return;
        }

        deps.visited[path] = true;

        if (!(path in seenScript)) {
            seenScript[path] = true;
            scripts.push(path);
        }
    }

    for (var path in tdl.included_) {
        if (!deps.written[path]) {
            visitNode(path);
        }
    }

    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i]) {
            tdl.writeScriptTag_(tdl.basePath + scripts[i]);
        }
        else {
            throw Error("Undefined script input");
        }
    }
};

/**
 * Looks at the dependency rules and tries to determine the script file that
 * fulfills a particular rule.
 */
tdl.getPathFromRule_ = function (rule) {
    var parts = rule.split(".");
    return parts.join("/") + ".js";
};

tdl.findBasePath_();

/**
 * Returns true if the specified value is not |undefined|
 * WARNING: Do not use this to test if an object has a property. Use the in
 * operator instead.
 */
tdl.isDef = function (val) {
    return typeof val != "undefined";
};

/**
 * Exposes an unobfuscated global namespace path for the given object.
 * Note the fields of the exported object *will* be obfuscated,
 * unless they are exported in turn via this function or
 * tdl.exportProperty.
 * 
 * <p>Also handy for making public items that are defined in anonymous closures.
 * 
 * ex. tdl.exportSymbol("Foo", Foo);
 * 
 * ex  tdl.exportSymbol("public.path.Foo.staticFunction", Foo.staticFunction);
 * 
 * ex. tdl.exportSymbol("public.path.Foo.prototype.myMethod", 
 *                          Foo.prototype.myMethod);
 *      new public.path.Foo().myMethod();
 */
tdl.exportSymbol = function (publicPath, object, opt_objectToExportTo) {
    tdl.exportPath_(publicPath, object, opt_objectToExportTo);
};


tdl.provide("tdl.base");

/**
 * The base module for tdl.
 */
tdl.base = tdl.base || {};

/**
 * Determine whether a value is an array. Do not use instanceof because that
 * will not work for V8 array (the browser thinks they are Objects).
 */
tdl.base.isArray = function (value) {
    var valueAsObject = (value);
    return typeof(value) === "object" && value !== null && 
        "length" in valueAsObject && "splice" in valueAsObject;
};

/**
 * a stub for later optionally converting obfuscated names
 */
tdl.base.maybeDeobfuscateFunctionName_ = function (name) {
    return name;
};

/**
 * Makes one class inherit from another
 */
tdl.base.inherit = function (subClass, superClass) {
    var TmpClass = function () {};
    TmpClass.prototype = superClass.prototype;
    subClass.prototype = new TmpClass();
}

/**
 * Parses an error stack from an exception
 */
tdl.base.parseErrorStack = function (excp) {
    var stack = [], name, line;

    if (!excp || !excp.stack) {
        return stack;
    }

    var stacklist = excp.stack.split("\n");

    for (var i = 0; i < stacklist.length - 1; i++) {
        var framedata = stacklist[i];

        name = framedata.match(/^([a-zA-Z0-9_$]*)/)[1];
        if (name) {
            name = tdl.base.maybeDeobfuscateFunctionName_(name);
        }
        else {
            name = "anonymous";
        }

        var result = framedata.match(/(.*:[0-9]+)$/);
        line = result && result[1];

        if (!line) {
            line = "(unknown)";
        }

        stack[stack.length] = name + " : " + line;
    }

    // remove top level anonymouse functions to match IE
    var omitRegexp = /^anonymous :/;
    while (stack.length && omitRegexp.exec(stack[stack.length - 1])) {
        stack.length = stack.length - 1;
    }

    return stack;
}

/**
 * Gets a function name from a funciton object.
 */
tdl.base.getFunctionName = function (aFunction) {
    var regexpResult = aFunction.toString().match(/function(\s*)(\w*)/);
    if (regexpResult && regexpResult.length >= 2 && regexpResult[2]) {
        return tdl.base.maybeDeobfuscateFunctionName_(regexpResult[2]);
    }
    return "anonymous"
}

/**
 * Pretty prints an exception's stack, if it has one.
 */
tdl.base.formatErrorStack = function (stack) {
    var result = "";
    for (var i = 0; i < stack.length; i++) {
        result += "> " + stack[i] + "\n";
    }
    return result;
}

/**
 * Gets a stack trace as a string
 */
tdl.base.getStackTrace = function (stripCount) {
    var result = '';

    if (typeof(arguments.caller) != "undefined") { // IE, not ECMA
        for (var a = arguments.caller; a != null; a = a.caller) {
            result += ">" + tdl.base.getFunctionName(a.callee) + "\n";
            if (a.caller == a) {
                result += "*";
                break;
            }
        }
    }
    else { // Mozilla, not ECMA
        // fake an exception so we can get Mozilla's error stack
        var testExcp;
        try {
            eval("var var;");
        }
        catch (testExcp) {
            var stack = tdl.base.parseErrorStack(testExcp);
            result += tdl.base.formatErrorStack(stack.slice(3 + stripCount, stack.length));
        }
    }

    return result;
};

tdl.base.IsMSIE = function () {
    var ua = navigator.userAgent.toLowerCase();
    var msie = /msie/.test(ua) && !/opera/.test(ua);
    return msie;
}