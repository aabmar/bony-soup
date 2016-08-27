'use strict';

var Button = require('bony/views/Button');

module.exports = Button.extend({
    className: 'btn btn-upload',
    template: 'x',

    initialize: function(options) {
        this.options = options = options || {};
        if (!options.key) throw new Error('options.key is required');
        this.text = options.text || { uploaded: 'Bytt', empty: 'Last opp' };
        this.template = this.getButtonText();
        Button.prototype.initialize.call(this, options);
        this.listenTo(this.model, 'change:' + this.options.key, this.updateButton);
    },

    updateButton: function() {
        this.trigger("change", this.model, this.options.key);
        this.dirty(function() {
            this.$el
                .addClass('dirty')
                .text(this.getButtonText());
        });
    },

    getButtonText: function() {
        return this.model.get(this.options.key) ? this.text.uploaded : this.text.empty;
    },

    click: function(e) {
        if (e && e.preventDefault) e.preventDefault();
        this.trigger("click", this.options.key, this);
    }
});
