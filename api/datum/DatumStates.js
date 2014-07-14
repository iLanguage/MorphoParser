var Collection = require('./../Collection').Collection;
var DatumState = require('./../FieldDBObject').FieldDBObject;

/**
 * @class Collection of Datum validation states
 * @name  DatumStates
 * @description The DatumStates is a minimal customization of the Collection
 * to add an internal model of DatumState.
 *
 * @extends Collection
 * @constructs
 */
var DatumStates = function DatumStates(options) {
  console.log("Constructing DatumStates length: ", options.length);
  Collection.apply(this, arguments);
};

DatumStates.prototype = Object.create(Collection.prototype, /** @lends DatumStates.prototype */ {
  constructor: {
    value: DatumStates
  },

  /**
   *  The primary key < v2 was 'label' but we changed to use 'id' so that
   *  'label' could be used only for a human friendly (and customizable)
   *  label while the id must remain unchanged for glossing and other automation.
   * @type {Object}
   */
  primaryKey: {
    value: 'validationStatus'
  },

  INTERNAL_MODELS: {
    value: {
      item: DatumState
    }
  }

});
exports.DatumStates = DatumStates;