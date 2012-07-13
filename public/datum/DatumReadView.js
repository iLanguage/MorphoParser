define([
    "backbone", 
    "handlebars", 
    "confidentiality_encryption/Confidential",
    "datum/Datum",
    "datum/DatumFieldReadView",
    "datum/DatumStateReadView",
    "datum/DatumTagReadView",
    "app/UpdatingCollectionView",
    "libs/Utils"
], function(
    Backbone, 
    Handlebars, 
    Confidential,
    Datum,
    DatumFieldReadView,
    DatumStateReadView,
    DatumTagReadView,
    UpdatingCollectionView
) {
  var DatumReadView = Backbone.View.extend(
  /** @lends DatumReadView.prototype */
  {
    /**
     * @class The layout of a single Datum. It contains a datum state,
     *        datumFields, datumTags and a datum menu.
     * 
     * @property {String} format Value formats are "latex", "leftSide", or "centreWell".
     * 
     * @extends Backbone.View
     * @constructs
     */
    initialize : function() {
      // Create a DatumStateReadView
      this.stateView = new DatumStateReadView({
        model : this.model.get("state"),
      });
      this.stateView.format = "datum";
      
      // Create a DatumTagView
      this.datumTagsView = new UpdatingCollectionView({
        collection           : this.model.get("datumTags"),
        childViewConstructor : DatumTagReadView,
        childViewTagName     : "li",
      }),

      // Create the DatumFieldsView
      this.datumFieldsView = new UpdatingCollectionView({
        collection           : this.model.get("datumFields"),
        childViewConstructor : DatumFieldReadView,
        childViewTagName     : "li",
        childViewFormat      : "datum"
      });
    },

    /**
     * The underlying model of the DatumReadView is a Datum.
     */
    model : Datum,
    
    /**
     * Events that the DatumReadView is listening to and their handlers.
     */
    events : {
      "click .icon-lock" : "encryptDatum",
      "click .icon-unlock" : "decryptDatum",
      "click .datum_state_select" : "renderState",
      "click #clipboard" : "copyDatum",
      "dblclick" : function() {
        // Prepend Datum to the top of the DatumContainer stack
        var d = this.model.clone();
        d.id = this.model.id;
        d.set("_id", this.model.get("_id"));
        d.set("_rev", this.model.get("_rev"));
        appView.datumsView.prependDatum(d);
      }
    },

    /**
     * The Handlebars template rendered as the DatumReadView.
     */
    template : Handlebars.templates.datum_read_embedded,
    
    /**
     * The Handlebars template rendered as the DatumLatexView.
     */
    latexTemplate : Handlebars.templates.datum_read_latex,

    /**
     * Renders the DatumReadView and all of its partials.
     */
    render : function() {
      Utils.debug("DATUM render: " + this.el);
      
      if(this.model.get("datumFields").where({label: "utterance"})[0] == undefined){
        Utils.debug("DATUM fields is undefined, come back later.");
        return this;
      }
      if (this.format == "well") {        
        // Display the DatumReadView
        var jsonToRender = this.model.toJSON();
        jsonToRender.datumStates = this.model.get("datumStates").toJSON();
        $(this.el).html(this.template(jsonToRender));
        
        // Display the DatumTagsView
        this.datumTagsView.el = this.$(".datum_tags_ul");
        this.datumTagsView.render();
        
        // Display the DatumFieldsView
        this.datumFieldsView.el = this.$(".datum_fields_ul");
        this.datumFieldsView.render();
        // This bit of code makes the datum look like its rendered by
        // latex, could be put into a function, but not sure if thats
        // necessary...
      } else if (this.format == "latex") {
        //This gets the fields necessary from the model
        var judgement = this.model.get("datumFields").where({label: "judgement"})[0].get("value");
        var utterance = this.model.get("datumFields").where({label: "utterance"})[0].get("value");
        var gloss = this.model.get("datumFields").where({label: "gloss"})[0].get("value");
        var translation = this.model.get("datumFields").where({label: "translation"})[0].get("value");
        
        // makes the top two lines into an array of words.
        var utteranceArray = utterance.split(' ');
        var glossArray = gloss.split(' ');
        
        // Form an array of utterance and gloss segments for rendering
        var couplet = [];
        for (var i = 0; i < utteranceArray.length; i++) {
          couplet.push({
            utteranceSegment : utteranceArray[i],
            glossSegment : glossArray[i]
          });
        }
        
        var jsonToRender = {};
        jsonToRender.translation = translation
        jsonToRender.couplet = couplet;
        if (judgement !== "") {
          jsonToRender.judgement = judgement;
        }
        
        $(this.el).html(this.latexTemplate(jsonToRender));
      }
      
      return this;
    },
    
    renderState : function() {
      if (this.stausview != undefined) {
        this.stateView.render();
      }
    },
    
    /**
     * Encrypts the datum if it is confidential
     * 
     * @returns {Boolean}
     */
    encryptDatum : function() {
      // TODO Redo to make it loop through the this.model.get("datumFields")
      // console.log("Fake encrypting");
      var confidential = appView.corpusView.model.confidential;

      if (confidential == undefined) {
        appView.corpusView.model.confidential = new Confidential();
        confidential = appView.corpusView.model.confidential;
      }

      this.model.set("utterance", confidential.encrypt(this.model
          .get("utterance")));
      this.model.set("morphemes", confidential.encrypt(this.model
          .get("morphemes")));
      this.model.set("gloss", confidential.encrypt(this.model.get("gloss")));
      this.model.set("translation", confidential.encrypt(this.model
          .get("translation")));

      // this.model.set("utterance", this.model.get("utterance").replace(/[^
      // -.]/g,"x"));
      // this.model.set("morphemes", this.model.get("morphemes").replace(/[^
      // -.]/g,"x"));
      // this.model.set("gloss", this.model.get("gloss").replace(/[^
      // -.]/g,"x"));
      // this.model.set("translation", this.model.get("translation").replace(/[^
      // -.]/g,"x"));
      this.render();
      $(".icon-lock").toggleClass("icon-lock icon-unlock");

      // console.log(confidential);
      // this.model.set()
    },
    
    /**
     * Decrypts the datum if it was encrypted
     */
    decryptDatum : function() {
      // TODO Redo to make it loop through the this.model.get("datumFields")
      var confidential = appView.corpusView.model.confidential;
      this.model.set("utterance", confidential.decrypt(this.model
          .get("utterance")));
      this.model.set("morphemes", confidential.decrypt(this.model
          .get("morphemes")));
      this.model.set("gloss", confidential.decrypt(this.model.get("gloss")));
      this.model.set("translation", confidential.decrypt(this.model
          .get("translation")));
      this.render();
      $(".icon-lock").toggleClass("icon-lock icon-unlock");
    },
    
    //Functions relating to the row of icon-buttons
    /**
     * The LaTeXiT function automatically mark-ups an example in LaTeX code
     * (\exg. \"a) and then copies it on the clipboard so that when the user
     * switches over to their LaTeX file they only need to paste it in.
     */
    laTeXiT : function() {
      return "";
    },
    
    /**
     * The copyDatum function copies all datum fields to the clipboard.
     */
    copyDatum : function() {
      
      var text = $(".datum_field_input").val() || [];
     // $(".datum_fields_ul")[0].focus();
    //  $(".datum_fields_ul")[0].select();
      console.log(text);
 
      return "";
    }
  });

  return DatumReadView;
});
