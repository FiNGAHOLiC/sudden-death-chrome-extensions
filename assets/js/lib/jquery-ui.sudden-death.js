;(function($, win, doc, undefined) {

    $.widget('ui.suddendeath', {
        options: {
          api: 'http://kuso-api.papix.net/sudden-death',
          selectorInput: '.js-sudden_death-input',
          selectorSubmit: '.js-sudden_death-submit',
          selectorResult: '.js-sudden_death-result'
        },
        widgetEventPrefix: 'suddendeath.',
        widgetEventSuffix: '.suddendeath',
        _create: function(){
          this._setup();
          this._eventify();
        },
        _setup: function(){
          var o = this.options, $elem = this.element;
          this._$input = $elem.find(o.selectorInput).trigger('focus');
          this._$submit = $elem.find(o.selectorSubmit);
          this._$result = $elem.find(o.selectorResult);
          this._wordSearched;
        },
        _eventify: function(){
          this.element.on('submit', $.proxy(function(e){
            var word = this._$input.val();
            e.preventDefault();
            if (word && word !== this._wordSearched) {
              this._wordSearched = word;
              this._setWord(word);
            }
          }, this));
        },
        _setWord: function(word){
          $.when(this._getAA(word), this._delay()).then($.proxy(function(res){
              this._$submit.prop('disabled', false);
              this._setResult(res);
          }, this), $.proxy(function(){
              this._$submit.prop('disabled', false);
          }, this));
        },
        _getAA: function(word){
          return $.Deferred($.proxy(function(defer){
            this._$submit.prop('disabled', true);
            $.get(this.options.api, {
              word: word
            }).done($.proxy(function(res){
              defer.resolve(res);
            }, this)).fail($.proxy(function(res){
              defer.reject(res);
            }, this));
          }, this));
        },
        _delay: function(){
          return $.Deferred(function(defer){
            setTimeout(function(){
              defer.resolve();
            }, 1000);
          });
        },
        _setResult: function(res){
          this._$result.val(res);
        }
    });

}(jQuery, window, this.document));