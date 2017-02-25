/*jshint browserify: true */
"use strict";

var bony = require("bony");
var Handlebars = require("handlebars");
var FieldBlock = require("./FieldBlock");

var Component = bony.Component;

module.exports  = FieldBlock.extend({
    initialize: function(options, args) {
        FieldBlock.prototype.initialize.call(this, options);
        var name = this.attributes.name;

        var tpl = `
            <label for="{{cid}}">{{label}}</label>
            <textarea id="{{cid}}" type="{{type}}" name="${this.data.name}" {{#disabled}}disabled{{/disabled}}>${this.model.get(this.data.name)||""}</textarea>
        `;
        this.template = Handlebars.compile(tpl);
    },

});

