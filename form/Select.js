/*jshint browserify: true */
"use strict";

var bony = require("bony");
var Handlebars = require("handlebars");
var FieldBlock = require("./FieldBlock");
var $ = require("jquery");

module.exports  = FieldBlock.extend({
    initialize: function(options, args) {
        FieldBlock.prototype.initialize.call(this, options);
        var name = this.attributes.name;

        // Set fields to data object to make it accessible to the template
        this.data.options = this.data.lookup.collection.toJSON();
        this.data.renderLookup = this.renderLookup;
        if(!Array.isArray(this.data.lookup.field)) this.data.lookup.field = [this.data.lookup.field];
        var tpl = `
            <label for="{{cid}}">{{label}}</label>
            <select id="{{cid}}" type="{{type}}" name="${this.data.name}" value = "${this.model.get(this.data.name) || ""}" {{#disabled}}disabled{{/disabled}} >
                <option>--SELECT--</option>
                {{#@root.options}}
                <option {{#eq "${this.model.get(this.data.name)||""}" id}}selected{{/eq}} value="{{id}}">${this.renderLookup()}</option>
                {{/@root.options}}
            </select>
        `;

        this.listenTo(this.model, 'change:' + this.data.name, this.modelChange);
        this.template = Handlebars.compile(tpl);
    },
    renderLookup: function(){
        var fields = this.data.lookup.field;
        var s = "";
        for(var i = 0; i < fields.length; i++){
            if(s.length > 0) s += " ";
            s += "{{" + fields[i] + "}}";
        }
        return s;
        
    },

  // Set changes in model to HTML
  modelChange: function() {
    var val = this.model.get(this.data.name);

    // Search for select field
    $('select', this.$el).each(function(index, input) {
      $(input).val(val);
    });
    return this;
  }
});