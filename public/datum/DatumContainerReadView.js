define([
    "use!backbone", 
    "use!handlebars",
    "text!datum/datum_container_read_embedded.handlebars",
    "text!datum/datum_container_read_fullscreen.handlebars",
    "datum/Datum",
    "datum/Datums",
    "datum/DatumReadView",
    "app/UpdatingCollectionView"
], function(
    Backbone,
    Handlebars,
    datumContainerEmbeddedTemplate,
    datumContainerFullscreenTemplate,
    Datum,
    Datums,
    DatumReadView,
    UpdatingCollectionView
) {
  var DatumContainerReadView = Backbone.View.extend(
  /** @lends DatumContainerReadView.prototype */
  {
    /**
     * @class The area where Datum appear. The number of datum that appear
     * is in UserPreference.
     * 
     * @property {String} format Valid values are "centreWell" or "fullscreen".
     * 
     * @extends Backbone.View
     * @constructs
     */
    initialize : function() {
      // Create a DatumTagView
      this.datumsView = new UpdatingCollectionView({
        collection           : this.model,
        childViewConstructor : DatumReadView,
        childViewTagName     : "li",
        childViewClass       : "well"
      });
      
      this.updateDatums();
      
      // Listen for changes in the number of Datum to display
      app.get("authentication").get("user").get("prefs").bind("change:numVisibleDatum", this.updateDatums, this);
    },
    
    model : Datums,
    
    events : {
      "click .icon-resize-small" : 'resizeSmall',
      "click .icon-resize-full" : "resizeFullscreen"
    },
    
    templateEmbedded : Handlebars.compile(datumContainerEmbeddedTemplate),
    
    templateFullscreen : Handlebars.compile(datumContainerFullscreenTemplate),
    
    render : function() {
      if (this.format == "centreWell") {
        // Display the DatumContainerEditView
        this.setElement($("#datums-embedded"));
        $(this.el).html(this.templateEmbedded({}));
        
        // Display the DatumFieldsView
        this.datumsView.el = this.$(".datum-embedded-ul");
        this.datumsView.render();
      } else if (this.format == "fullscreen") {
        // Display the DatumContainerEditView
        this.setElement($("#datum-container-fullscreen"));
        $(this.el).html(this.templateFullscreen({}));
        
        // Display the DatumFieldsView
        this.datumsView.el = this.$(".datum-embedded-ul");
        this.datumsView.render();
      }
    },
    
    resizeSmall : function() {
      this.format = "centreWell";
      this.render();
      window.app.router.showDashboard();
    },
    
    resizeFullscreen : function() {
      this.format = "fullscreen";
      this.render();
      window.app.router.showFullscreenDatumContainer();
    },
    
    updateDatums : function() {
      var previousNumberOfDatum = this.model.length;
      var nextNumberOfDatum = app.get("authentication").get("user").get("prefs").get("numVisibleDatum");
        
      // Get the current Corpus' Datum based on their date entered
      var self = this;
      (new Datum()).getAllDatumIdsByDate(function(rows) {
        // If there are no Datum in the current Corpus
        if ((rows == null) || (rows.length <= 0)) {
          // Remove all currently displayed Datums
          for (var i = 0; i < previousNumberOfDatum; i++) {
            self.model.pop();
          }
        } else {
          // If the user has increased the number of Datum to display in the container
          if (nextNumberOfDatum > previousNumberOfDatum) {
            for (var i = previousNumberOfDatum; i < nextNumberOfDatum; i++) {
              // Add the next most recent Datum from the Corpus to the bottom of the stack, if there is one
              var d = new Datum();
              d.id = rows[i].value;
              d.fetch({
                success : function() {
                  // Add the new, blank, Datum
                  self.model.add(datum);
                }
              });
            }
          // If the user has decrease the number of Datum to display in the container
          } else if (nextNumberOfDatum < previousNumberOfDatum) {
            // Pop the excess Datum from the bottom of the stack
            for (var i = nextNumberOfDatum; i < previousNumberOfDatum; i++) {
              self.model.pop();
            }
          }
        }
      })
    }
  });
  
  return DatumContainerReadView;
});