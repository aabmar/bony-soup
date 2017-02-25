/*jshint browserify: true */
"use strict";

var Handlebars = require("handlebars");
var bony = require("bony");
var Component = bony.Component;
var Button = require("./Button");

module.exports = bony.Component.extend({
    tagName: "header",

    initialize: function(options) {
        bony.Component.prototype.initialize.call(this, options);

        options = options || {};

        var title = options.name || "Dashboard";

        this.left = new Component({className: "left"});
        this.title = new Component({
            tagName: "h1",
            template: Handlebars.compile("{{title}}"),
            data: {title: title}
        });
        this.right = new Component({className: "right"});

        this.addComponent(this.title);
        this.addComponent(this.left);
        this.addComponent(this.right);

        this.left.addComponent(new Component({tagName: "a",  className: 'fa fa-home fa-3x', attributes: {"href": "#index"}, template: ' '}));

    },

});
