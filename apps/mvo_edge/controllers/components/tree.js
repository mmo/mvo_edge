// ==========================================================================
// Project:   MvoEdge.tree
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals MvoEdge */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
MvoEdge.treeController = SC.ArrayController.create(
/** @scope MvoEdge.treeController.prototype */ {

  /**
	Sets the currently selected treeNode.

	@property {Object}
	@default undefined
  */
  treeSelection: undefined,
  
  /**
	Updates the masterController if the currently selected thumbnail has been changed.
	
	@observes treeSelection
  */
  treeSelectionDidChange: function() {
    var selectedTreeNode = this.get('treeSelection');
    if (selectedTreeNode) {
		var hasObject = this.get('hasObjectId');
		if (hasObject === false) {
			var objectIds = selectedTreeNode.get('objectIds');
			var objectId = objectIds.firstObject();
			if (objectId) {
				console.info('Tree --> Change masterController');
				MvoEdge.masterController.changeSelection(objectId);
			}
		} else {
			console.info('The currently treeNode has already the same objectId.');
		}
    }
  }.observes('treeSelection'),

  /**
    Returns true if the coreDocumentNode's guid is already in the currently selected treeNode.
	
	@property {Boolean} treeSelection
  */
  hasObjectId: function() {
    var selectedTreeNode = this.get('treeSelection');
	var hasObject = NO;
	var masterSelection = MvoEdge.masterController.get('selectedObjectId');
	if (masterSelection && selectedTreeNode) {
		var objectIds = selectedTreeNode.get('objectIds');
		if (objectIds) {
			var sizeObjectIds = objectIds.get('length');
			// Iterate on objectIds
			for (var i = 0; i < sizeObjectIds; i++) {
				if (objectIds[i] === masterSelection) {
					hasObject = YES;
					break;
				}
			}
		}
	}
	return hasObject;
  }.property('treeSelection'),

  /**
    Updates treeNode selection by observing changes in master controller's object selection.

	@observes MvoEdge.masterController.selectedObjectId
  */
  masterObjectSelectionDidChange: function() {
    var masterSelection = MvoEdge.masterController.get('selectedObjectId');
	if (masterSelection) {
		// Check if the currently selected treeNode has the objectId 'masterSelection'
		var hasObj = this.get('hasObjectId');
		if (hasObj === false) {
			// Retrieve the good treeNode with masterSelection
			this.setTreeSelection(masterSelection);
		} else {
			console.info('It is not necessary to change the currently selected treeNode.');
		}
    }
  }.observes('MvoEdge.masterController.selectedObjectId'),

  /**
	Changes the currently selected treeNode, given the coreDocumentNode's guid.
	
	@param {String} coreDocumentNodeId the guid of an object of type {@link MvoEdge.CoreDocumentNode}
  */
  setTreeSelection: function(coreDocumentNodeId) {
	var treeNodes = MvoEdge.store.findAll(MvoEdge.Tree);
	if (treeNodes) {
		var sizeTreeNodes = treeNodes.get('length');
		var hasTreeNode = NO;
		// Iterate on MvoEdge.Tree store 
		for (var i = 0; i < sizeTreeNodes; i++) {
			var treeNode = treeNodes.objectAt(i);
			var listObjectIds = treeNode.get('objectIds');
			if (listObjectIds) {
				var sizeObjectIds = listObjectIds.get('length');
				// Iterate on objectIds
				for (var j = 0; j < sizeObjectIds; j++) {
					// Check if the objectId is equal to coreDocumentNodeId
					if (listObjectIds[j] === coreDocumentNodeId) {
						console.info('Change treeSelection');
						this.set('treeSelection',treeNode);
						hasTreeNode = YES;
						break;
					}
				}
			}
			if (hasTreeNode === true) {
				break;
			}
		}
	}
  }

});