/*jshint browserify: true */
"use strict";
var bony = require("bony");
var Handlebars = require("handlebars");
var FieldBlock = require("./FieldBlock");

module.exports = FieldBlock.extend({

    initialize: function(options, args) {
        FieldBlock.prototype.initialize.call(this, options);
        // HACK: Remember to remove
        window.link = this;
        var template;

        // Show the field value itself, or look it up through another collection.
        if (this.data.lookup) {
            if (!Array.isArray(this.data.lookup.field)) this.data.lookup.field = [this.data.lookup.field];
            
            // Find correct model from the lookup collection.
            var lookupFieldValue = this.model.get(this.data.name);
            var lookupModel = this.data.lookup.collection.get(lookupFieldValue);
            this.data.lookup.item = (lookupModel ? lookupModel.toJSON() : {});

            template = `
                <label for="{{cid}}">{{label}}</label>
                <a id="{{cid}}" type="button" class="button" href="{{#item}}${options.field.link}{{/item}}">{{#lookup.item}}${this.renderLookup()}{{/lookup.item}}</a>
            `;
        } else {
            var template = `
            <label for="{{cid}}">{{label}}</label>
            {{#item}}<a id="{{cid}}" type="button" class="button" href="${options.field.link}">{{${this.data.name}}}</a>{{/item}}
        `;
        }
        this.template = Handlebars.compile(template);
    },

    renderLookup: function() {
        var fields = this.data.lookup.field;
        var s = "";
        for (var i = 0; i < fields.length; i++) {
            if (s.length > 0) s += " ";
            s += "{{" + fields[i] + "}}";
        }
        return s;
    }
});