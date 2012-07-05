define([ 
    "use!backbone", 
    "use!handlebars", 
    "text!user/user_read_link.handlebars",
    "text!user/user_read_modal.handlebars",
    "text!user/user_read_fullscreen.handlebars",
    "corpus/Corpus",
    "corpus/Corpuses",
    "user/User",
    "libs/Utils"
], function(
    Backbone, 
    Handlebars, 
    userLinkTemplate,
    userModalTemplate,
    userFullscreenTemplate, 
    Corpus,
    Corpuses,
    User
) {
  var UserReadView = Backbone.View.extend(
  /** @lends UserReadView.prototype */
  {
    /**
     * @class The layout of a single User. This view is used in the activity
     *        feeds, it is also embedable in the UserEditView.
     *        
     * @property {String} format Must be set when the view is initialized. Valid
     *           values are "link" "modal" and "fullscreen".
     * 
     * @description Starts the UserView.
     * 
     * @extends Backbone.View
     * @constructs
     */
    initialize : function() {
      Utils.debug("USER init: " + this.el);
      
      this.model.bind('change', this.render, this);
    },

    /**
     * The underlying model of the UserReadView is a User.
     */
    model : User,
    
    classname : "user",
    
    /**
     * The Handlebars template rendered as the UserReadLinkView.
     */
    linkTemplate : Handlebars.compile(userLinkTemplate),
    
    /**
     * The Handlebars template rendered as the UserReadModalView.
     */
    modalTemplate : Handlebars.compile(userModalTemplate),
    
    /**
     * The Handlebars template rendered as the UserReadFullscreenView.
     */
    fullscreenTemplate : Handlebars.compile(userFullscreenTemplate),
    
    /**
     * Renders the UserReadView.
     */
    render : function() {
      
      Utils.debug("USER render: " + this.el);
      if (this.model == undefined) {
        Utils.debug("\User model was undefined");
        return this;
      }
      Utils.debug("\tRendering user: " + this.model.get("username"));

      if (this.format == "fullscreen") {
        this.setElement($("#user-fullscreen"));
        $(this.el).html(this.fullscreenTemplate(this.model.toJSON()));
      } else if (this.format == "modal") {
        this.setElement($("#user-modal"));
        $(this.el).html(this.modalTemplate(this.model.toJSON()));
      } else if (this.format == "link") {
        $(this.el).html(this.linkTemplate(this.model.toJSON()));
      }

      return this;
    },
    
    
    
    /**
     * Initializes the public User.
     */
    
    loadPublic : function(){
      var oldprefs = this.model.get("prefs");
//      this.model = new User({
//        "username" : "public",
//        "password" : "",
//        "email" : "",
//        "firstname" : "Anonymous",
//        "lastname" : "User",
//        "gravatar" : "./../user/public_gravatar.png",
//        "researchInterest" : "",
//        "affiliation" : "",
//        "description" : "",
//        "subtitle" : "",
//        "corpuses" : ["5028B933-72BB-4EA4-ADF8-67C2A5ABC968"],
//        "dataLists" : [],
//        "prefs" : oldprefs,
//        "teams" : []
//      });

//      this.model.id = "E144FA24-BAF4-48F9-9800-62E7A7E93CF4";
//      this.model.fetch();
      this.model.set ({
          "username" : "public",
          "password" : "",
          "email" : "",
          "firstname" : "Anonymous",
          "lastname" : "User",
          "gravatar" : "./../user/public_gravatar.png",
          "prefs" : oldprefs,
        });
//      var n = new Corpus({title: "test corpus filled in userview", titleAsUrl: "test"});
//      this.model.get("corpuses").push(n.id);
//      var d = new DataList({});
//      this.model.get("dataLists").push(d.id); 
//      var self = this;
//      this.model.save(
//          null,
//          {
//            success : function() {
//              self.model.get("corpuses").push(n.id);
//            },
//            error : function() {
//              alert("Unable to create new corpus.");
//            }
//          }
//      );
    }
  });

  return UserReadView;
});