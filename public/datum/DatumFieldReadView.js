define([ 
     "backbone",
     "handlebars", 
     "datum/DatumField"
  ], function(
      Backbone, 
      Handlebars,
      DatumField
) {
  var DatumFieldReadView = Backbone.View.extend(
  /** @lends DatumFieldReadView.prototype */
  {
    /**
     * @class This is the view of the Datum Field Model. The Datum Field is a
     *        drop down field that has the most frequent ones first, and at the
     *        bottom an option to create a new one.
     * 
     * @property {String} format Valid values are "corpus", "datum", and "session".
     * 
     * @extends Backbone.View
     * @constructs
     */
    initialize : function() {
      Utils.debug("DATUM FIELD init");
    
      // If the model changes, re-render
      this.model.bind('change', this.render, this);
    },
    
    /**
     * The underlying model of the DatumFieldReadView is a DatumField.
     */
    model : DatumField,

    events : {
      "click .icon-question-sign" : "showHelpConvention"
    },    
    
    
    /**
     * The Handlebars template rendered as the DatumFieldSettingsReadView.
     */
    templateSettings : Handlebars.templates.datum_field_settings_read_embedded,
    
    /**
     * The Handlebars template rendered as the DatumFieldValueReadView.
     */
    templateValue : Handlebars.templates.datum_field_value_read_embedded,
    
    /**
     * Renders the DatumFieldReadView.
     */
    render : function() {
      Utils.debug("DATUM FIELD READ render");
     
      if (this.format == "corpus") {
        $(this.el).html(this.templateSettings(this.model.toJSON()));
        
        // Select the correct values from the model
        this.$el.children(".choose-field").val(this.model.get("label"));
      } else if (this.format == "datum") {
        var jsonToRender = this.model.toJSON();
        jsonToRender.helpText = true;
        $(this.el).html(this.templateValue(jsonToRender));
      } else if (this.format == "session") {
        var jsonToRender = this.model.toJSON();
        jsonToRender.helpText = false;
        $(this.el).html(this.templateValue(jsonToRender));
      }
      
      return this;
    },
    
    /**
     * Show help convention in popover  
     */
    showHelpConvention : function() {
        this.$el.children(".help-conventions").popover("show");
    }
    
  });

  return DatumFieldReadView;
});