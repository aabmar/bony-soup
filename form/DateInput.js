/*jshint browserify: true */
"use strict";

var bony = require("bony");
var Handlebars = require("handlebars");
var moment = require("moment");
var FieldBlock = require("./FieldBlock");

module.exports = FieldBlock.extend({
    initialize: function(options, args) {
        FieldBlock.prototype.initialize.call(this, options);
        var name = this.attributes.name;
        var tpl = `
            <label for="{{cid}}">{{label}}</label>
            <input id="{{cid}}" type="text" name="${this.data.name}" value = "${moment(this.model.get(this.data.name)).format("DD.MM.YYYY HH:mm")||""}" {{#disabled}}disabled{{/disabled}}/>
        `;
        this.template = Handlebars.compile(tpl);
    },
    // Set changes from HTML to model
    formChange: function(e) {
        // Check that we have a target
        if (!e || !e.target) return;

        // Apply the change to the model
        var name = this.attributes.name;
        var val = e.target.value;

        if (this.data.validation) {
            var valid = this.data.validation.test(val);
            if (valid) this.$el.removeClass("error");
            else {
                this.$el.addClass("error");
                return;
            }
        }

        if(val) val = moment(val, "DD.MM.YYYY HH:mm").toISOString();
        this.model.set(name, val);

        return this;
    },

});
