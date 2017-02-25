/**
 *     @module
 *     jshint browserify: true
 */
"use strict";

var Handlebars = require("handlebars");
var bony = require("bony");
var Component = bony.Component;
var Button = require("./Button");

/**
 * @class CommandsTable
 *
 * Panel ment for adding CommandButtons. Used on Edit pages.
 *
 * [Image](images/components.CommandButton.png)
 *
 *
 * ### Example
 * ```
 *      var col2 = new CommandsPanel();
 *      this.addComponent(col2);
 * ```
 */

module.exports = bony.Component.extend({
    className: 'col1-3 commands-panel',
    initialize: function(options) {
        bony.Component.prototype.initialize.call(this, options);
        this.addComponent(new Component({tagName: "h2", template: "Commands"}))
        this.addComponent(new Component({tagName: "p", template: "Don't use commands if you have unsaved data."}))
    },
    add: function(button){
        var p = new Component({tagName: 'p'});
        p.addComponent(button);
        this.addComponent(p);
    }
});
