define( [ "use!backbone" ], function(Backbone) {

  var Search = Backbone.Model.extend(

  /** @lends Search.prototype  */

  {
    /** 
     * @class Search progressively searches a corpus and updates a 
     *        search/data list view as a user types keywords in the 
     *        search box. Both intersection and union search is 
     *        possible. It highlights search keywords in the list view.  
     * 
     * @property {String} searchKeywords 
     * @property {DataList} 
     * 
     * 
     * 
     * @description The initialize function probably creates a link to 
     *              a corpus, or checks if a link is established. 
     * 
     * @extends Backbone.Model 
     * 
     * @constructs 
     * 
     */

    initialize : function() {
    },
    events : {
      "blur" : "saveKeyword"
    },
    defaults : {
      searchKeywords : ""
    },

    validate : function(attributes) {

    },
    loadSample : function(){
      this.set("searchKeywords","naya");
      console.log("Changing search keyword");
    },
    saveKeyword: function(){
      this.set("searchKeywords","hihi");
    }

  });

  return Search;
});
