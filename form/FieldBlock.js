/*jshint browserify: true */
"use strict";

var bony = require("bony");
var $ = require("jquery");
var Component = bony.Component;

// Basic FieldBlock FieldBlock element for Inputs to extend. Saves the field description
// and checks for a model.
module.exports = Component.extend({
    tagName: "p",
    events: {
        "change": "formChange"
    },
    initialize: function(options, args) {
        this.template = " ";
        Component.prototype.initialize.call(this, options);
        if (!this.model) throw new Error("FormView#FieldBlock must have option model.");
        if (!options.field) throw new Error("FormView#Select must have option field.");
        this.data = options.field;
        this.data.cid = this.cid;
        this.attributes = this.attributes || {};
        this.attributes['name'] = this.data.name;
        this.listenTo(this.model, 'change:' + this.data.name, this.modelChange);
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

        this.model.set(name, val);

        return this;
    },

    // Set changes in model to HTML
    modelChange: function() {

        var val = this.model.get(this.data.name);

        // Search for input field
        $('input', this.$el).each(function(index, input) {
            $(input).val(val);
        });
        return this;
    }
});