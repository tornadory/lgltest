var tdl = tdl || {};
tdl.global = this;

/**
 * Returns true if the specified value is not |undefined|.
 * WARNING: Do not use this to test if an object has a property. Use the in
 * operator instead.
 */
tdl.isDef = function (val) {
    return typeof val != "undefined";
}

/**
 * Array of namespaces that have been provided.
 */
tdl.provided_ = [];

/**
 * Creates object stubs for a namespace. When present in a file,
 * tdl.provide also indicates that the file defines the indicated
 * object
 */
tdl.provide = function (name) {
    if (tdl.getObjectByName(name) && !tdl.implicitNamespaces_[name]) {
        throw 'Namespace "' + name + '" already declared.';
    }

    var namespace = name;
    while (namespace = namespace.substring(0, namespace.lastIndexOf('.'))) {
        tdl.implicitNamespaces_[namespace] = true;
    }

    tdl.exportPath_(name);
    tdl.provided_.push(name);
}

/**
 * Returns an object based on its fully qualified external name. If you are 
 * using a compilation pass that renames property names beware that using this
 * function will not find renamed properties.
 */
tdl.getObjectByName = function (name, opt_obj) {
    var parts = name.split(".");
    var cur = opt_obj || tdl.global;

    for (var pp = 0; pp < parts.length; pp++) {
        var part = parts[pp];
        if (cur[part]) {
            cur = cur[part];
        }
        else {
            return null;
        }
    }

    return cur;
}

/**
 * Namespaces implicitly defined by tdl.provide. For example,
 * tdl.provide("tdl.events.Event") implicitly declares
 * that "tdl" and "tdl.events" must be namespaces.
 */
tdl.implicitNamespaces_ = {};

/**
 * Builds an object structure for the provided namespace path,
 * ensring that names that already exist are not overwritten. For
 * example:
 * "a.b.c" -> a = {}; a.b = {}; a.b.c = {};
 * Used by tdl.provide and tdl.exportSymbol.
 */
tdl.exportPath_ = function (name, opt_object, opt_objectToExportTo) {
    var parts = name.split(".");
    var cur = opt_objectToExportTo || tdl.global;
    var part;

    // Internet Explorer exhibits strange behavior when throwing errors from
    // methods externed in this manner.  See the testExportSymbolExceptions in
    // base_test.html for an example.
    if (!(parts[0] in cur) && cur.execScript) {
        cur.execScript('var ' + parts[0]);
    }

    // Parentheses added to eliminate strict JS warning in Firefox
    while (parts.length && (part = parts.shift())) {
        if (!parts.length && tdl.isDef(opt_object)) {
            cur[part] = opt_object;
        }
        else if (cur[part]) {
            cur = cur[part];
        }
        else {
            cur = cur[part] = {};
        }
    }
};

/**
 * Object used to keep track of urls that have already been added.
 * This record allows the prevention of circular dependencies.
 */
 tdl.included_ = {};

/**
 * Implements a system for the dynamic resolution of dependencies.
 */
tdl.require = function (rule) {
    // TODO(gman): For some unknown reason, when we call
    // tdl.util.getScriptTagText_ it calls
    // document.getElementsByTagName('script') and for some reason the scripts do
    // not always show up. Calling it here seems to fix that as long as we
    // actually ask for the length, at least in FF 3.5.1 It would be nice to
    // figure out why.
    var dummy = document.getElementsByTagName("script").length;
    // if the object already exists we do not need to do anything
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

/**
 * Looks at the dependency rules and tries to determine the script file that
 * fulfills a particular rule.
 */
tdl.getPathFromRule_ = function (rule) {
    var parts = rule.split(".");
    return parts.join("/") + ".js";
}

/**
 * This object is used to keep track of dependencies and other data that is
 * used for loading scripts.
 */
tdl.dependencies_ = {
    // used when resolving dependencies to prevent us from visiting the file twice.
    visited: {},
    // used to keep track of script files we have written.
    written: {}
}

/**
 * Resolves dependencies based on the dependencies added using addDependency
 * and calls writeScriptTag_ in the correct order.
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

        // we have already visited this one. We can get here if we have cyclic
        // dependencies.
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

tdl.writeScriptTag_ = function (src) {
    var doc = tdl.global.document;
    if (typeof doc != "undefined" && !tdl.dependencies_.written[src]) {
        tdl.dependencies_.written[src] = true;
        var html = '<script type="text/javascript" src="' + src + '"></script>';
        doc.write(html);
    }
};

/**
 * Path for included scripts.
 */
tdl.basePath = "";

/**
 * Tries to detect the base path of the tdl-base.js script that 
 * bootstraps the tdl libraries.
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
        tdl.global.BASE_PATH = null;
    }

    var expectedBase = "./require.js";
    var scripts = doc.getElementsByTagName("script");
    for (var script, i = 0; script = scripts[i]; i++) {
        var src = script.src, l = src.length;
        if (src.substr(l - expectedBase.length) == expectedBase) {
            tdl.basePath = src.substr(0, l - expectedBase.length);
            return;
        }
    }
};

tdl.findBasePath_();

tdl.provide('tdl.base');

/**
 * The base module for tdl.
 * @namespace
 */
tdl.base = tdl.base || {};

/**
 * Determine whether a value is an array. Do not use instanceof because that
 * will not work for V8 arrays (the browser thinks they are Objects).
 * @param {*} value A value.
 * @return {boolean} Whether the value is an array.
 */
tdl.base.isArray = function(value) {
  var valueAsObject = /** @type {!Object} */ (value);
  return typeof(value) === 'object' && value !== null &&
      'length' in valueAsObject && 'splice' in valueAsObject;
};

/**
 * A stub for later optionally converting obfuscated names
 * @private
 * @param {string} name Name to un-obfuscate.
 * @return {string} un-obfuscated name.
 */
tdl.base.maybeDeobfuscateFunctionName_ = function(name) {
  return name;
};

/**
 * Makes one class inherit from another.
 * @param {!Object} subClass Class that wants to inherit.
 * @param {!Object} superClass Class to inherit from.
 */
tdl.base.inherit = function(subClass, superClass) {
  /**
   * TmpClass.
   * @ignore
   * @constructor
   */
  var TmpClass = function() { };
  TmpClass.prototype = superClass.prototype;
  subClass.prototype = new TmpClass();
};

/**
 * Parses an error stack from an exception
 * @param {!Exception} excp The exception to get a stack trace from.
 * @return {!Array.<string>} An array of strings of the stack trace.
 */
tdl.base.parseErrorStack = function(excp) {
  var stack = [];
  var name;
  var line;

  if (!excp || !excp.stack) {
    return stack;
  }

  var stacklist = excp.stack.split('\n');

  for (var i = 0; i < stacklist.length - 1; i++) {
    var framedata = stacklist[i];

    name = framedata.match(/^([a-zA-Z0-9_$]*)/)[1];
    if (name) {
      name = tdl.base.maybeDeobfuscateFunctionName_(name);
    } else {
      name = 'anonymous';
    }

    var result = framedata.match(/(.*:[0-9]+)$/);
    line = result && result[1];

    if (!line) {
      line = '(unknown)';
    }

    stack[stack.length] = name + ' : ' + line
  }

  // remove top level anonymous functions to match IE
  var omitRegexp = /^anonymous :/;
  while (stack.length && omitRegexp.exec(stack[stack.length - 1])) {
    stack.length = stack.length - 1;
  }

  return stack;
};

/**
 * Gets a function name from a function object.
 * @param {!function(...): *} aFunction The function object to try to get a
 *      name from.
 * @return {string} function name or 'anonymous' if not found.
 */
tdl.base.getFunctionName = function(aFunction) {
  var regexpResult = aFunction.toString().match(/function(\s*)(\w*)/);
  if (regexpResult && regexpResult.length >= 2 && regexpResult[2]) {
    return tdl.base.maybeDeobfuscateFunctionName_(regexpResult[2]);
  }
  return 'anonymous';
};

/**
 * Pretty prints an exception's stack, if it has one.
 * @param {Array.<string>} stack An array of errors.
 * @return {string} The pretty stack.
 */
tdl.base.formatErrorStack = function(stack) {
  var result = '';
  for (var i = 0; i < stack.length; i++) {
    result += '> ' + stack[i] + '\n';
  }
  return result;
};

/**
 * Gets a stack trace as a string.
 * @param {number} stripCount The number of entries to strip from the top of the
 *     stack. Example: Pass in 1 to remove yourself from the stack trace.
 * @return {string} The stack trace.
 */
tdl.base.getStackTrace = function(stripCount) {
  var result = '';

  if (typeof(arguments.caller) != 'undefined') { // IE, not ECMA
    for (var a = arguments.caller; a != null; a = a.caller) {
      result += '> ' + tdl.base.getFunctionName(a.callee) + '\n';
      if (a.caller == a) {
        result += '*';
        break;
      }
    }
  } else { // Mozilla, not ECMA
    // fake an exception so we can get Mozilla's error stack
    var testExcp;
    try {
      eval('var var;');
    } catch (testExcp) {
      var stack = tdl.base.parseErrorStack(testExcp);
      result += tdl.base.formatErrorStack(stack.slice(3 + stripCount,
                                                        stack.length));
    }
  }

  return result;
};

/**
 * Returns true if the user's browser is Microsoft IE.
 * @return {boolean} true if the user's browser is Microsoft IE.
 */
tdl.base.IsMSIE = function() {
  var ua = navigator.userAgent.toLowerCase();
  var msie = /msie/.test(ua) && !/opera/.test(ua);
  return msie;
};