/**
 *     @module
 *     jshint browserify: true
 */

"use strict";

var Backbone = require("backbone");
var bony = require("bony");
var $ = require("jquery");
var Button = require("./Button");

var Component = bony.Component;

var Input = require("./form/Input");
var Link = require("./form/Link");
var DateInput = require("./form/DateInput");
var TextArea = require("./form/TextArea");
var Select = require("./form/Select");

/**
 * @class FormView
 *
 * The FormView class is ment for editing a Backbone Model. You give the class a description structure
 * on creation, and it will build the form for you. It supports the basic HTML form types, and supports
 * lookup to collections.
 *
 * ### Example
 * 
 * ```
 *  var form = new FormView({
 *    model: model,
 *    structure: [
 *      {name: "id", label: "ID", type: "text", disabled: true, validation: /^.+$/},
 *      {name: "name", label: "Name", type: "text", validation: /^.+$/},
 *      {name: "value", label: "Value", type: "number", validation: /^[0-9]+$/},
 *      {name: "supplier_sku", label: "SKU", type: "text", validation: /^.+$/}
 *    ],
 *  });
 *  this.addComponent(form);
 * ```
 *
 * ### Supported field types
 *
 * * text
 *     * name
 *     * label
 *     * disabled
 *     * validation
 * * number
 *     * name
 *     * label
 *     * disabled
 *     * validation
 * * link
 *     * name
 *     * label
 *     * disabled
 * * date
 *     * name
 *     * label
 *     * disabled
 *     * validation
 * * datetime
 *     * name
 *     * label
 *     * disabled
 *     * validation
 * * datetime-local
 *     * name
 *     * label
 *     * disabled
 *     * validation
 * * textarea
 *     * name
 *     * label
 *     * disabled
 *     * validation
 * * select
 *     * name
 *     * label
 *     * disabled
 *     * validation
 * 
 */
module.exports = Component.extend({
    tagName: 'form',
    className: 'superform',
    events: {
        "change": "formChange"
    },
    initialize: function(options) {
        Component.prototype.initialize.call(this, options);
        if (!this.model) throw new Error("ItemView must have parameter model.");
        if (!options.structure) throw new Error("ItemView must have parameter structure.");
        this.structure = options.structure;

        // TODO: remove HACK: only for dev test
        window.model = this.model;
        var model = this.model;

        // Make sure we have the latest data
        if(!this.model.isNew()) this.model.fetch();
        var changed = this.changed = {};

        // Add Input fields to form
        for (var i = 0; i < this.structure.length; i++) {
            this.addInput(this.structure[i]);
        }

        // Buttons
        this.saveButton = new Button({
          template: "Save"
        });

        var cancel = new Button({
          template: "Back Without Save"
        });

        this.listenTo(this.saveButton, "click", this.save);
        this.listenTo(cancel, "click", this.cancel);
        this.addComponent(this.saveButton);
        this.addComponent(cancel);

        // Go back to previous page on Save
        this.listenTo(this.model, "sync", e =>{
            this.saveButton.$el.removeClass("highlight");
            // window.history.back();
        });

        // Show error
        this.listenTo(this.model, "error", model => {
            alert("ERROR: Data was not saved!")
        });

        this.listenTo(this.model, "change", (ch, b) =>{
            console.log("CHANGE: ", ch, model.changed);
            for(var key in model.changed){
                changed[key] = model.changed[key];
            }

        });
    },

    formChange: function(){
        this.saveButton.$el.addClass("highlight");
    },

    save: function(){
        var model = this.model;
        var collection = this.collection;
        model.save({}, {
            // patch: true,
            success: function(){
                if(collection){
                    if(!collection.get(model.get("id"))){
                        collection.add(model);
                    }
                }
            }
        });
    },

    addInput: function(field) {

        var input;

        switch (field.type) {
            case 'text':
            case 'number':
                var input = new Input({
                    field: field,
                    model: this.model
                });
                break;
            case 'link':
                var input = new Link({
                    field: field,
                    model: this.model
                });
                break;
            case 'date':
            case 'datetime':
            case 'datetime-local':
                var input = new DateInput({
                    field: field,
                    model: this.model
                });
                break;
            case 'textarea':
                var input = new TextArea({
                    field: field,
                    model: this.model
                });
                break;
            case 'select':
                var input = new Select({
                    field: field,
                    model: this.model
                });
                break;
        }

        if(input){
            this.addComponent(input);
        }
    },

    cancel: function(){
        var me = this;

        if(this.model.collection){
            this.model.collection.fetch({
                success: function(){
                    window.history.back();
                }
            });
            return;            
        }
        window.history.back();
    }
});
