"use strict";

var formatUtils = require("./format_utils"),
    isDefined = require("../../core/utils/type").isDefined,
    messageLocalization = require("../../localization/message"),
    $ = require("../../core/renderer"),
    extend = require("../../core/utils/extend").extend;

var FILTER_BUILDER_RANGE_CLASS = "dx-filterbuilder-range",
    FILTER_BUILDER_RANGE_START_CLASS = FILTER_BUILDER_RANGE_CLASS + "-start",
    FILTER_BUILDER_RANGE_END_CLASS = FILTER_BUILDER_RANGE_CLASS + "-end",
    FILTER_BUILDER_RANGE_SEPARATOR_CLASS = FILTER_BUILDER_RANGE_CLASS + "-separator";

function editorTemplate(conditionInfo, container) {
    var $editorStart = $("<div>").addClass(FILTER_BUILDER_RANGE_START_CLASS),
        $editorEnd = $("<div>").addClass(FILTER_BUILDER_RANGE_END_CLASS),
        values = conditionInfo.value || [],
        getStartValue = function(values) {
            return values && values.length > 0 ? values[0] : null;
        },
        getEndValue = function(values) {
            return values && values.length === 2 ? values[1] : null;
        };

    container.append($editorStart);
    container.append($("<span>").addClass(FILTER_BUILDER_RANGE_SEPARATOR_CLASS).text("-"));
    container.append($editorEnd);
    container.addClass(FILTER_BUILDER_RANGE_CLASS);

    this._editorFactory.createEditor.call(this, $editorStart, extend({}, conditionInfo.field, conditionInfo, {
        value: getStartValue(values),
        parentType: "filterBuilder",
        setValue: function(value) {
            values = [value, getEndValue(values)];
            conditionInfo.setValue(values);
        }
    }));

    this._editorFactory.createEditor.call(this, $editorEnd, extend({}, conditionInfo.field, conditionInfo, {
        value: getEndValue(values),
        parentType: "filterBuilder",
        setValue: function(value) {
            values = [getStartValue(values), value];
            conditionInfo.setValue(values);
        }
    }));
}

function customizeText(conditionInfo) {
    var startValue = conditionInfo.value[0],
        endValue = conditionInfo.value[1];

    if(!isDefined(startValue) && !isDefined(endValue)) {
        return messageLocalization.format("dxFilterBuilder-enterValueText");
    }

    return (isDefined(startValue) ? formatUtils.getFormattedValueText(conditionInfo.field, startValue) : "?") + " - "
                + (isDefined(endValue) ? formatUtils.getFormattedValueText(conditionInfo.field, endValue) : "?");
}

function calculateFilterExpression(filterValue, field) {
    if(!filterValue || filterValue.length < 2) return null;

    var startValue = filterValue[0],
        endValue = filterValue[1];
    if(!isDefined(startValue) && !isDefined(endValue)) {
        return null;
    }
    return [[field.dataField, ">=", startValue], "and", [field.dataField, "<=", endValue]];
}

function getConfig() {
    return {
        name: "between",
        caption: messageLocalization.format("dxDataGrid-filterRowOperationBetween"),
        icon: "range",
        dataTypes: ["number", "date", "datetime"],
        calculateFilterExpression: calculateFilterExpression,
        editorTemplate: editorTemplate,
        customizeText: customizeText
    };
}

exports.getConfig = getConfig;
