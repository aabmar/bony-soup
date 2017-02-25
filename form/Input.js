/*jshint browserify: true */
"use strict";

var bony = require("bony");
var Handlebars = require("handlebars");
var FieldBlock = require("./FieldBlock");

module.exports = FieldBlock.extend({
    initialize: function(options, args) {
        FieldBlock.prototype.initialize.call(this, options);
        var name = this.attributes.name;

        var tpl = `
            <label for="{{cid}}">{{label}}</label>
            <input id="{{cid}}" type="{{type}}" name="${this.data.name}" value = "${this.model.get(this.data.name)||""}" {{#disabled}}disabled{{/disabled}}/>
        `;
        this.template = Handlebars.compile(tpl);
    }
});
