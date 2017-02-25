/*jshint browserify: true */
"use strict";

var bony = require("bony");
var Component = bony.Component;
var Handlebars = require("handlebars");
var RowView = require("./RowView");

/**
 * TableView
 * =========
 *
 * Render a collection as a table.
 *
 * Options:
 *
 *  - cols : Array of columns to render. Mandatory.
 *  - titles: Array of titles for columns. Not mandatory.
 *  - clickPageName: String with name to page to go to if clicked. No post slash. Not mandatory
 *  - clickPageField: Field to use with clickPageName. Not mandatory. Default "id"
 * 
 */
module.exports = Component.extend({
    tagName: "table",
    className: "list",
    initialize: function(options) {
        Component.prototype.initialize.call(this, options);
        options = options || {};
        this.data = {};
        if (!this.collection) throw new Error("TableView must have option collection.");
        if (!options.cols) throw new Error("TableView must have option cols");


        // TODO: remove HACK: only for dev test
        window.collection = this.collection;

        // Move title array to data
        this.data.cols = options.cols;
        this.data.titles = options.titles || options.cols;
        this.data.link = options.clickPageName;
        this.data.linkField = options.clickPageField || "id";

        this.lookup = options.lookup || false;
        this.transform = options.transform || false;
        this.filter = options.filter || false;

        this.listenTo(this.collection, "add", this._add);
        this.listenTo(this.collection, "remove", this._remove);
        this.listenTo(this.collection, "reset", this._reset);

        var headList = [];
        for(var i = 0; i < this.data.cols.length; i++) {
            headList.push({
                title: this.data.titles[i],
                name: this.data.cols[i]
            });
        }

        var head = new Component({
            tagName: 'thead',
            data: {list: headList},
            template: Handlebars.compile(`
                <tr>{{#list}}
                    <th>{{title}}</th>
                    {{/list}}
                </tr>
            `)
        });
        this.addComponent(head);

        this.tbody = new Component({
            tagName: 'tbody'
        });

        this.addComponent(this.tbody);

        // Add initial models
        this.collection.each(this._add, this);

    },

    _add: function(model) {

        if(this.filter) {
            var show = this.filter(model);
            if(!show) return;
        }

        var item = new RowView({
            model: model,
            cols: this.data.cols,
            titles: this.data.titles,
            lookup: this.lookup,
            transform: this.transform
        });
        this.tbody.addComponent(item);

        if(this.data.link){
            var field = this.data.linkField;
            console.log("linking ", this.data.link);
            this.listenTo(item, "click", function(){
                window.location.hash = this.data.link + "/" + model.get(field);
            });
        }
    },

    _remove: function(i) {
        this.tbody.removeComponent(i);
    },

    _reset: function() {
        this.tbody.clearComponents();
        // Add initial models
        this.collection.each(this._add, this);
    },

});

