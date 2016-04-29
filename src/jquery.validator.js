;(function($,window,document,undefined){
"use strict";
	//Create the default login
	var validator = "validator",
	defaults = {
		required : {},
		email : {},
		number : {},
		equalTo:{},
		min : {},
		max : {},
		requiredError : '{label} is a required field',
		emailError : 'Please input correct type email with {label}',
		confirmError : 'This {name} is not the same with {label}',
		minLengthError : 'At least we have {label} characters',
		maxLengthError : 'The {label} characters is max',
		ajax : true// Ajax true or false //develop later
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
			self.$element.on('submit',$.proxy(self.handleSubmit,self));
			var $inputRequired = self.$element.find(':input');
			// Init span error class
			$.each($inputRequired,function(key,value){
				$(value).after("<span class='error'></span>");
			});

			var numberType = self.settings.number;
			$.each(numberType,function(key,value){
				self.setNumber(key);
			})
		},
		checkRequired : function(name){
			var self = this;
			var inputVal = $("textare[name='"+name+"'],input[name='"+name+"']").val();
			var $input = $("textare[name='"+name+"'],input[name='"+name+"']");
			// set error message blank
			$input.next().html('');
			//
			var label = $input.attr("data-label");
			if (inputVal==='') {
				self.addError(name,label,'','required');
				return false;
			}else{
				return true;
			}
		},
		checkEmail : function(name){
			var self = this;
			var inputVal = $("textare[name='"+name+"'],input[name='"+name+"']").val();
			var $input = $("textare[name='"+name+"'],input[name='"+name+"']");
			var label = $input.attr("data-label");
			if(self.checkRequired(name)){
				if(!(/^([_a-z0-9-]+)(\.[_a-z0-9-]+)*@([a-z0-9-]+)(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(inputVal.toLowerCase()))) {
					self.addError(name,label,'','email');
					return false;
				}else{
					return true;
				}
			}
		},
		checkConfirm : function(name,equalInput){
			var self = this;
			var inputVal = $("textare[name='"+name+"'],input[name='"+name+"']").val();
			var labelInput = $("textare[name='"+name+"'],input[name='"+name+"']").attr("data-label");
			var compareVal = $("textare[name='"+equalInput+"'],input[name='"+equalInput+"']").val();
			var labelCompareInput = $("textare[name='"+equalInput+"'],input[name='"+equalInput+"']").attr("data-label");
			if(self.checkRequired(name) && self.checkRequired(equalInput)){
				if(inputVal != compareVal){
					self.addError(name,labelInput,labelCompareInput,'confirm');
					return false;
				}else{
					return true;
				}
			}else{
				return false;
			}
		},
		checkMin : function(name,min){
			var self = this;
			var inputVal = $("textare[name='"+name+"'],input[name='"+name+"']").val();
			if(self.checkRequired(name)){
				if(inputVal.length < parseInt(min)){
					self.addError(name,min,'','min');
					return false;
				}else{
					return true;
				}
			}
		},
		checkMax : function(name,max){
			var self = this;
			var inputVal = $("textare[name='"+name+"'],input[name='"+name+"']").val();
			if(self.checkRequired(name)){;
				if(inputVal.length > parseInt(max)){
					return false;
				}else{
					return true;
				}
			}
		},
		setNumber : function(name){
			var self = this;
			var $input = $("textare[name='"+name+"'],input[name='"+name+"']");
			$input.val('0');
			$input.keydown(function(e){
					// Allow: backspace, delete, tab, escape, enter and .
        			if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             		// Allow: Ctrl+A, Command+A
            		(e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
            		 // Allow: home, end, left, right, down, up
            		(e.keyCode >= 35 && e.keyCode <= 40)) {
                 	// let it happen, don't do anything
                 	return;
        		}
        		// Ensure that it is a number and stop the keypress
        		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            		e.preventDefault();
        		}
			});
		},
		formatMsg : function (label,label2,type){
			var message = '';
			if(type ==='required'){
				message = this.settings.requiredError.replace('{label}',label);
			}else if(type ==='email'){
				message = this.settings.emailError.replace('{label}',label);
			}else if(type ==='confirm'){
				message = this.settings.confirmError.replace('{label}',label2).replace('{name}',label);
			}else if(type ==='min'){
				message = this.settings.minLengthError.replace('{label}',label);
			}else if(type ==='max'){
				message = this.settings.maxLengthError.replace('{label}',label);
			}
			return message;
		},
		addError : function(name,label,label2,type){
			var self = this;
			var $input = $("textare[name='"+name+"'],input[name='"+name+"']");
			var error = self.formatMsg(label,label2,type);
			$input.next().html(error);
		},
		handleSubmit : function(e){
			var self = this;
			var required = self.settings.required;
			var emailType = self.settings.email;
			var confirmType = self.settings.equalTo;
			self.isValid = false;
			var minType = self.settings.min;
			var maxType = self.settings.max;
			// Checked required
			$.each(required,function(key,value){
				if(value){
					self.isValid = self.checkRequired(key);
				}
			});

			$.each(minType,function(key,value){
				self.isValid = self.checkMin(key,value);
			});

			$.each(maxType,function(key,value){
				self.isValid = self.checkMax(key,value);
			});

			$.each(emailType,function(key,value){
				if(value){
					self.isValid = self.checkEmail(key);
				}
			});

			$.each(confirmType,function(key,value){
				self.isValid = self.checkConfirm(key,value);
			});

			console.log(self.isValid);


			if(self.isValid){
				alert("Submit Form");
			}else{
				e.preventDefault();
			}
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
