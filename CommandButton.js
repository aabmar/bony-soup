/**
 *     @module
 *     jshint browserify: true
 */

"use strict";

var Handlebars = require("handlebars");
var Backbone = require("backbone");
var bony = require("bony");
var Component = bony.Component;
var $ = require("jquery");

/**
 * @class CommandButton
 * Button made for running back end commands.
 *
 * [Image](images/components.CommandButton.png)
 * 
 * Command endpoints need to be on this format:
 *
 * /url/something/:id
 * 
 * Options:
 *
 * - url: URL to end point. Insert parameters with ':parameterName'. Parameters are collected from model
 *          Can be either string or a function returning a string (useful for dynamic lookup from model)
 * - sendData: Data to be posted.
 * - alert: Show alert? Default true. String or true shows alert box. false prevents alert.
 * - model: Model to get parameters for the URL from.
 * - title: Button title. Default "CMD"
 * - method: 'get'|'post'|'put'|'patch'|'delete'
 * - success: callback function to call when (if) done
 * - error: callback functio called if operation fails
 *
 *
 * ### Example
 *
 * ```
 *     var keywordButton = new CommandButton({
 *          url: "/rpc/inventory/:id/new_keyword",
 *          model: model,
 *          success: function() {
 *              model.fetch();
 *          },
 *          title: "Make New Keyword",
 *          alert: "Are you sure? User will not be able to use existing device anymore."
 *      });
 * ```
 *
 * 
 */
module.exports = bony.Component.extend({
    tagName: "button",
    className: "button",
    events: {
        "click": "click"
    },
    initialize: function(options) {
        bony.Component.prototype.initialize.call(this, options);

        if(!options.url) throw new Error("CommandButton needs option 'url'");

        options = options || {};
        this.method = options.method || 'patch';
        this.data.sendData = options.sendData;
        this.data.alert = (options.alert === false ? false : (options.alert ? options.alert : "Are you sure??") );
        this.data.title = options.title || "CMD";
        this.success = options.success || function(){};
        this.error = options.error || this.error;
        this.attributes = this.attributes || {};
        this.attributes.type = "button";
        this.url = this.options.url;
    },

    click: function(){
        var doAlert = this.data.alert;
        var model = this.model;

        // Should we display an alert box?
        if(doAlert){
            var confirmed = confirm(doAlert);
            if(!confirmed) return;
        }

        //
        //  FORMAT URL
        //  

        // - Get parameters from URL
        var url = (typeof this.url === 'function' ? this.url() : this.url);
        var r = /:([a-z0-9A-Z]+)/g;
        var matches = new Array();
        var match;
        var i = 0;
        while( (match = r.exec(url))){
            var m = match[1];
            matches[i++] = m;
        }

        // Get values from model and put them into the URL
        for(i = 0; i < matches.length; i++){
            var key = matches[i];
            var val = model.get(key);
            url = url.replace(":" + key, encodeURI(val));
        }

        // Call the enpoint using AJAX and the correct HTTP method
        var success = this.success;
        var error = this.error;

        var params = {
            method: this.method,
            error: function(a, b){
                if(error) return error(a, b);
                alert("Operation failed");
                console.error(a, b);
            }
            
        }

        if(success) params.success = success;
        if(this.data.sendData) params.data = this.data.sendData;


        $.ajax(url, params);
    },

    template: Handlebars.compile(`{{title}}`),
    
});
