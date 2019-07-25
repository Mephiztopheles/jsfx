"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;
const rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
const rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
const rdisplayswap = /^(none|table(?!-c[ea]).+)/, rcustomProp = /^--/, cssNormalTransform = {
    letterSpacing: "0",
    fontWeight: "400"
}, cssShow = { position: "absolute", visibility: "hidden", display: "block" }, cssPrefixes = ["Webkit", "Moz", "ms"], emptyStyle = document.createElement("div").style, cssExpand = ["Top", "Right", "Bottom", "Left"];
// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName(name) {
    // Shortcut for names that are not vendor prefixed
    if (name in emptyStyle) {
        return name;
    }
    // Check for vendor prefixed names
    var capName = name[0].toUpperCase() + name.slice(1), i = cssPrefixes.length;
    while (i--) {
        name = cssPrefixes[i] + capName;
        if (name in emptyStyle) {
            return name;
        }
    }
}
// Return a property mapped along what Style.cssProps suggests or to
// a vendor prefixed property.
function finalPropName(name) {
    var ret = Style.cssProps[name];
    if (!ret) {
        ret = Style.cssProps[name] = vendorPropName(name) || name;
    }
    return ret;
}
const rmsPrefix = /^-ms-/, rdashAlpha = /-([a-z])/g;
// Used by camelCase as callback to replace()
function fcamelCase(all, letter) {
    return letter.toUpperCase();
}
// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase(string) {
    return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
}
function getStyles(elem) {
    // Support: IE <=11 only, Firefox <=30 (#15098, #14150)
    // IE throws on elements created in popups
    // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
    let view = elem.ownerDocument.defaultView;
    if (!view || !view.opener)
        view = window;
    return view.getComputedStyle(elem);
}
function adjustCSS(elem, prop, valueParts, tween) {
    var adjusted, scale, maxIterations = 20, currentValue = tween ?
        function () {
            return tween.cur();
        } :
        function () {
            return Style.css(elem, prop, "");
        }, initial = currentValue(), unit = valueParts && valueParts[3] || (Style.cssNumber[prop] ? "" : "px"), initialInUnit, 
    // Starting value computation is required for potential unit mismatches
    unitBefore = (Style.cssNumber[prop] || unit !== "px" && +initial) &&
        rcssNum.exec(Style.css(elem, prop));
    if (unitBefore && unitBefore[3] !== unit) {
        // Support: Firefox <=54
        // Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
        initial = initial / 2;
        // Trust units reported by Style.css
        unit = unit || unitBefore[3];
        // Iteratively approximate from a nonzero starting point
        initialInUnit = +initial || 1;
        while (maxIterations--) {
            // Evaluate and update our best guess (doubling guesses that zero out).
            // Finish if the scale equals or crosses 1 (making the old*new product non-positive).
            Style.style(elem, prop, initialInUnit + unit);
            if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
                maxIterations = 0;
            }
            initialInUnit = initialInUnit / scale;
        }
        initialInUnit = initialInUnit * 2;
        Style.style(elem, prop, initialInUnit + unit);
        // Make sure we update the tween properties later on
        valueParts = valueParts || [];
    }
    if (valueParts) {
        initialInUnit = +initialInUnit || +initial || 0;
        // Apply relative offset (+=/-=) if specified
        adjusted = valueParts[1] ?
            initialInUnit + (valueParts[1] + 1) * valueParts[2] :
            +valueParts[2];
        if (tween) {
            tween.unit = unit;
            tween.start = initialInUnit;
            tween.end = adjusted;
        }
    }
    return adjusted;
}
function curCSS(elem, name, computed) {
    let ret;
    computed = computed || getStyles(elem);
    // getPropertyValue is needed for:
    //   .css('filter') (IE 9 only, #12537)
    //   .css('--customProperty) (#3144)
    if (computed) {
        ret = computed.getPropertyValue(name) || computed[name];
        if (ret === "" && !Style.contains(elem.ownerDocument, elem)) {
            ret = Style.style(elem, name);
        }
    }
    return ret !== undefined ?
        // Support: IE <=9 - 11 only
        // IE returns zIndex value as an integer.
        ret + "" :
        ret;
}
function swap(elem, options, callback, args) {
    const old = {};
    // Remember the old values, and insert the new ones
    for (let name in options) {
        old[name] = elem.style[name];
        elem.style[name] = options[name];
    }
    const ret = callback.apply(elem, args || []);
    // Revert the old values
    for (let name in options)
        elem.style[name] = old[name];
    return ret;
}
function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
    var i = dimension === "width" ? 1 : 0, extra = 0, delta = 0;
    // Adjustment may not be necessary
    if (box === (isBorderBox ? "border" : "content")) {
        return 0;
    }
    for (; i < 4; i += 2) {
        // Both box models exclude margin
        if (box === "margin") {
            delta += Style.css(elem, box + cssExpand[i], true, styles);
        }
        // If we get here with a content-box, we're seeking "padding" or "border" or "margin"
        if (!isBorderBox) {
            // Add padding
            delta += Style.css(elem, "padding" + cssExpand[i], true, styles);
            // For "border" or "margin", add border
            if (box !== "padding") {
                delta += Style.css(elem, "border" + cssExpand[i] + "Width", true, styles);
                // But still keep track of it otherwise
            }
            else {
                extra += Style.css(elem, "border" + cssExpand[i] + "Width", true, styles);
            }
            // If we get here with a border-box (content + padding + border), we're seeking "content" or
            // "padding" or "margin"
        }
        else {
            // For "content", subtract padding
            if (box === "content") {
                delta -= Style.css(elem, "padding" + cssExpand[i], true, styles);
            }
            // For "content" or "padding", subtract border
            if (box !== "margin") {
                delta -= Style.css(elem, "border" + cssExpand[i] + "Width", true, styles);
            }
        }
    }
    // Account for positive content-box scroll gutter when requested by providing computedVal
    if (!isBorderBox && computedVal >= 0) {
        // offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
        // Assuming integer scroll gutter, subtract the rest and round down
        delta += Math.max(0, Math.ceil(elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] -
            computedVal -
            delta -
            extra -
            0.5));
    }
    return delta;
}
function getWidthOrHeight(elem, dimension, extra) {
    // Start with computed style
    let styles = getStyles(elem), val = curCSS(elem, dimension, styles), isBorderBox = Style.css(elem, "boxSizing", false, styles) === "border-box", valueIsBorderBox = isBorderBox;
    // Support: Firefox <=54
    // Return a confounding non-pixel value or feign ignorance, as appropriate.
    if (rnumnonpx.test(val)) {
        if (!extra)
            return val;
        val = "auto";
    }
    // Fall back to offsetWidth/offsetHeight when value is "auto"
    // This happens for inline elements with no explicit setting (gh-3571)
    // Support: Android <=4.1 - 4.3 only
    // Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
    if (val === "auto" ||
        !parseFloat(val) && Style.css(elem, "display", false, styles) === "inline") {
        val = elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)];
        // offsetWidth/offsetHeight provide border-box values
        valueIsBorderBox = true;
    }
    // Normalize "" and auto
    val = parseFloat(val) || 0;
    // Adjust for the element's box model
    return (val +
        boxModelAdjustment(elem, dimension, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles, 
        // Provide the current computed size to request scroll gutter calculation (gh-3589)
        val)) + "px";
}
function setPositiveNumber(elem, value, subtract) {
    const matches = rcssNum.exec(value);
    if (matches == null)
        return value;
    return Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px");
}
class Style {
    static css(elem, name, extra, styles) {
        let val, num, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name);
        if (!isCustomProp)
            name = finalPropName(origName);
        hooks = Style.cssHooks[name] || Style.cssHooks[origName];
        // If a hook was provided get the computed value from there
        if (hooks && "get" in hooks)
            val = hooks.get(elem, true, extra);
        // Otherwise, if a way to get the computed value exists, use that
        if (val === undefined)
            val = curCSS(elem, name, styles);
        // Convert "normal" to computed value
        if (val === "normal" && name in cssNormalTransform)
            val = cssNormalTransform[name];
        // Make numeric if forced or a qualifier was provided and val looks numeric
        if (extra === "" || extra) {
            num = parseFloat(val);
            return extra === true || isFinite(num) ? num || 0 : val;
        }
        return val;
    }
    static contains(a, b) {
        let adown = a.nodeType === 9 ? a.documentElement : a, bup = b && b.parentNode;
        return a === bup || !!(bup && bup.nodeType === 1 && adown.contains(bup));
    }
    static style(elem, name, value, extra) {
        // Don't set styles on text and comment nodes
        if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
            return;
        }
        // Make sure that we're working with the right name
        let ret, type, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name), style = elem.style;
        // Make sure that we're working with the right name. We don't
        // want to query the value if it is a CSS custom property
        // since they are user-defined.
        if (!isCustomProp)
            name = finalPropName(origName);
        // Gets hook for the prefixed version, then unprefixed version
        hooks = Style.cssHooks[name] || Style.cssHooks[origName];
        // Check if we're setting a value
        if (value !== undefined) {
            type = typeof value;
            // Convert "+=" or "-=" to relative numbers (#7345)
            if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
                value = adjustCSS(elem, name, ret);
                // Fixes bug #9237
                type = "number";
            }
            // Make sure that null and NaN values aren't set (#7116)
            if (value == null || value !== value)
                return;
            // If a number was passed in, add the unit (except for certain CSS properties)
            if (type === "number")
                value += ret && ret[3] || (Style.cssNumber[origName] ? "" : "px");
            // If a hook was provided, use that value, otherwise just set the specified value
            if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
                if (isCustomProp)
                    style.setProperty(name, value);
                else
                    style[name] = value;
            }
        }
        else {
            // If a hook was provided get the non-computed value from there
            if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined)
                return ret;
            // Otherwise just get the value from the style object
            return style[name];
        }
    }
    static getStyles(elem) {
        return getStyles(elem);
    }
}
Style.cssProps = {};
Style.cssNumber = {
    "animationIterationCount": true,
    "columnCount": true,
    "fillOpacity": true,
    "flexGrow": true,
    "flexShrink": true,
    "fontWeight": true,
    "lineHeight": true,
    "opacity": true,
    "order": true,
    "orphans": true,
    "widows": true,
    "zIndex": true,
    "zoom": true
};
Style.cssHooks = {
    opacity: {
        get: function (elem, computed) {
            if (computed) {
                // We should always get a number back from opacity
                let ret = curCSS(elem, "opacity");
                return ret === "" ? "1" : ret;
            }
        }
    }
};
exports.default = Style;
["height", "width"].forEach((dimension) => {
    Style.cssHooks[dimension] = {
        get(elem, computed, extra) {
            if (computed) {
                return rdisplayswap.test(Style.css(elem, "display")) &&
                    (!elem.getClientRects().length || !elem.getBoundingClientRect().width) ?
                    swap(elem, cssShow, function () {
                        return getWidthOrHeight(elem, dimension, extra);
                    }) :
                    getWidthOrHeight(elem, dimension, extra);
            }
        },
        set(elem, value, extra) {
            let matches, styles = getStyles(elem), isBorderBox = Style.css(elem, "boxSizing", false, styles) === "border-box", subtract = extra && boxModelAdjustment(elem, dimension, extra, isBorderBox, styles);
            // Convert to pixels if value adjustment is needed
            if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {
                elem.style[dimension] = value;
                value = hookCss(elem, dimension);
            }
            return setPositiveNumber(elem, value, subtract);
        }
    };
});
function hookCss(elem, name, extra, styles) {
    let val, num, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name);
    // Make sure that we're working with the right name. We don't
    // want to modify the value if it is a CSS custom property
    // since they are user-defined.
    if (!isCustomProp)
        name = finalPropName(origName);
    // Try prefixed name followed by the unprefixed name
    hooks = Style.cssHooks[name] || Style.cssHooks[origName];
    // If a hook was provided get the computed value from there
    if (hooks && "get" in hooks)
        val = hooks.get(elem, true, extra);
    // Otherwise, if a way to get the computed value exists, use that
    if (val === undefined)
        val = curCSS(elem, name, styles);
    // Convert "normal" to computed value
    if (val === "normal" && name in cssNormalTransform)
        val = cssNormalTransform[name];
    // Make numeric if forced or a qualifier was provided and val looks numeric
    if (extra === "" || extra) {
        num = parseFloat(val);
        return extra === true || isFinite(num) ? num || 0 : val;
    }
    return val;
}
