"use strict";

var $ = require("jquery");

require("common.css!");
require("ui/resizable");

QUnit.testStart(function() {
    var markup = '<div id="resizable" style="height: 50px; width: 50px; position: absolute"></div>';
    $("#qunit-fixture").html(markup);
});

var RESIZABLE_CLASS = "dx-resizable",
    RESIZABLE_HANDLE_CLASS = "dx-resizable-handle",
    RESIZABLE_HANDLE_CORNER_CLASS = "dx-resizable-handle-corner";


QUnit.module("markup");

QUnit.test("resizable render", function(assert) {
    var $resizable = $("#resizable").dxResizable({});

    assert.ok($resizable.hasClass(RESIZABLE_CLASS), "dx-resizable class attached");
    assert.ok($resizable.css("position") !== "static", "position of element should not be static");
});

QUnit.test("resizable should have correct handle for handles", function(assert) {
    var isHandleExist = function(handleName) {
        var $handle = $resizable.find("." + RESIZABLE_HANDLE_CLASS + "-" + handleName);
        return $handle.length === 1;
    };

    var $resizable = $("#resizable").dxResizable({ handles: "all" }),
        resizable = $resizable.dxResizable("instance");

    assert.ok(isHandleExist("top"), "top handle exists");
    assert.ok(isHandleExist("bottom"), "bottom handle exists");
    assert.ok(isHandleExist("right"), "right handle exists");
    assert.ok(isHandleExist("left"), "left handle exists");

    resizable.option("handles", "left right");
    assert.ok(!isHandleExist("top"), "top handle does not exist");
    assert.ok(!isHandleExist("bottom"), "bottom handle does not exist");
    assert.ok(isHandleExist("right"), "right handle exists");
    assert.ok(isHandleExist("left"), "left handle exists");

    resizable.option("handles", "top bottom");
    assert.ok(isHandleExist("top"), "top handle exists");
    assert.ok(isHandleExist("bottom"), "bottom handle exists");
    assert.ok(!isHandleExist("right"), "right handle does not exist");
    assert.ok(!isHandleExist("left"), "left handle does not exist");
});

QUnit.test("resizable shouldn't render handles if handles is none", function(assert) {
    var $resizable = $("#resizable").dxResizable({ handles: "none" });

    assert.equal($resizable.find("." + RESIZABLE_HANDLE_CLASS).length, 0, "no handles were rendered");
});


QUnit.test("resizable should have corner handles when need", function(assert) {
    var $resizable = $("#resizable").dxResizable({
            handles: "right bottom"
        }),
        instance = $resizable.dxResizable("instance");

    var isHandleExist = function(handles) {
        var $handle = $resizable.find("." + RESIZABLE_HANDLE_CORNER_CLASS + "-" + handles);
        return $handle.length === 1;
    };

    assert.ok(isHandleExist("bottom-right"), "bottom right corner exists");

    instance.option("handles", "bottom left");
    assert.ok(isHandleExist("bottom-left"), "bottom left corner exists");
    assert.ok(!isHandleExist("bottom-right"), "bottom right corner does not exist");

    instance.option("handles", "top left");
    assert.ok(isHandleExist("top-left"), "top left right corner exists");

    instance.option("handles", "top right");
    assert.ok(isHandleExist("top-right"), "top right corner exists");

    instance.option("handles", "all");
    assert.ok(isHandleExist("top-right"), "top right corner exists with 'all' handles");
    assert.ok(isHandleExist("top-left"), "top left right corner exists with 'all' handles");
    assert.ok(isHandleExist("bottom-left"), "bottom left corner exists with 'all' handles");
    assert.ok(isHandleExist("bottom-right"), "bottom right corner exists with 'all' handles");
});
