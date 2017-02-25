/*jshint browserify: true */
"use strict";

var bony = require("bony");
var Component = bony.Component;
var Handlebars = require("handlebars");

/**
 * Class for showing one row inside a TableView.
 *
 * Private Class for TableView, not ment to be used standalone.
 *
 * Options:
 *
 * - cols
 * - titles
 *
 * Emits:
 *
 * - click
 * 
 */
module.exports = Component.extend({

    tagName: "tr",
    events: {
        "click": "click"
    },
    initialize: function(options) {
        Component.prototype.initialize.call(this, options);
        options = options || {};

        if (!this.model) throw new Error("Row must have option row.");
        if (!options.cols) throw new Error("Row must have option row");
        // Move title array to data
        this.data.cols = options.cols;
        this.data.titles = options.titles || options.cols;
        this.lookup = options.lookup || false;
        this.transform = options.transform || false;
        this.listenTo(this.model, "change", this.dirty);
    },

    click: function(){
        this.trigger("click", this.model);
    },
    render: function() {

        this.data.list = [];

        for(var i = 0; i < this.data.cols.length; i++){
            var col = this.data.cols[i];
            var title = this.data.titles[i];
            var value = this.model.get(col);

            // Lookup values from other collections
            if(this.lookup && this.lookup[col]){
                var lookup = this.lookup[col];
                let newValue = "";
                if(!Array.isArray(lookup.field)) lookup.field = [lookup.field];
                var lookupModel = lookup.collection.get(value);
                if(lookupModel){
                    for(var j = 0; j < lookup.field.length; j++){
                        if(newValue.length > 0) newValue += " / ";
                         newValue += lookupModel.get(lookup.field[j]);
                    }
                }
                if(newValue) value = newValue;
                else value = "!failed lookup!!";
            }

            if(this.transform && this.transform[col]){
                var transform = this.transform[col];
                if(typeof transform === "function"){
                    value = transform(value);
                }
            }

            this.data.list.push({
                name: col,
                title: title,
                value: value
            });

        }

        var html = this.template(this.data);
        this.$el.html(html);

        return this;
    },

    template: Handlebars.compile(`
        {{#list}}<td>{{value}}</td>{{/list}}
    `)
});
