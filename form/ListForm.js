var Component = require('bony/Component');
var Button = require('bony/views/Button');
var Input = require('bony/views/form/Input');

module.exports = Component.extend({
    className: "form_container",
    initialize: function(options) {
        Component.prototype.initialize.call(this, options);

        this.form = new Form({
            collection: this.collection,
            rowClass: this.options.rowClass
        });
        this.addComponent(this.form);

        var buttonAdd = new Button({
            template: "Add Row"
        });
        this.buttonSave = new Button({
            template: "Save"
        });
        var toolbar = new Component({
            tagName: "section",
            className: "toolbar"
        });
        toolbar.addComponent(buttonAdd);
        toolbar.addComponent(this.buttonSave);
        this.addComponent(toolbar);

        this.listenTo(buttonAdd, "click", this.newRow);
        this.listenTo(this.buttonSave, "click", this.save);

        var me = this;
        me.listenTo(me.form, "change", function(){
            me.buttonSave.dirty(function(){
                me.buttonSave.$el.addClass("dirty");
            });
        });
        me.listenTo(me.form, "sync", function(){
            me.buttonSave.dirty(function(){
                me.buttonSave.$el.removeClass("dirty");
            });
        });
    },

    newRow: function(){
        this.collection.add({});
    },

    save: function(){
        this.form.save();
    }
});

var Form = require('bony/views/form/Form').extend({
    className: "form grid",
    _add: function(model){
        var row = new this.options.rowClass({
            model: model,
            template: this.itemTemplate
        });
        this.addComponent(row);

        this.listenTo(model, "sync", function(){
            this.trigger("sync");
        });

        this.listenTo(model, "sync", function(){
            $(".dirty", this.$el).removeClass("dirty");
            this.trigger("sync");
        });
        
        for(var i = 0; i < row.components.length; i++){
            var comp = row.components[i];
            // if(!(comp instanceof Input)) continue;
            this._listenTo(comp);
        }
    },

    _listenTo: function(comp){
        var me = this;
        me.listenTo(comp, "change", function(){
            me.trigger("change");
        });
        // me.listenTo(comp, "sync", function(){
        //     me.trigger("sync");
        // });
    },

    _remove: function(i){
        this.removeComponent(i);
    },

    _reset: function(){
        this.clearComponents();
    },

    save: function(){
        for(var i = 0; i < this.collection.length; i++){
            this.collection.at(i).save();
        }
    }

});
