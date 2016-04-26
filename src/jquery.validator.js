;(function($,window,document,undefined){
"use strict";
	//Create the default login
	var validator = "validator",
	defaults = {
		required : {},
		email : {}
	};

	//Constructor
	function Validator(element,options){
		this.element = element;
		this.$element = $(element);
		this.settings = $.extend({},defaults,options);
		this.options = options;
		this.defaults = defaults;
		this._name = validator;
		this.init();
	}

	//Avoid Plugin.prototype conflicts
	$.extend(Validator.prototype,{
		init : function(){
			var self = this;
			alert(self._name);
		},
		checkRequired : function(){

		}
		handleSubmit : function(e){

		}
	});

	$.fn[validator] = function(options){
		return this.each(function(){
			if ( !$.data( this, "plugin_" + validator ) ) {
					$.data( this, "plugin_" +
						validator, new Validator( this, options ) );
			}
		});
	}


})(jQuery,window,document);
