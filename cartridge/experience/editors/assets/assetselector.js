
'use strict';

var ContentMgr = require('dw/content/ContentMgr');

// Searches in the first sub-category of the root. Not looking recursively
function getSubCategoryFolder(parentFolder, folderID) {
  var subFolders = parentFolder.getSubFolders().iterator();

  while (subFolders.hasNext()) {
    var subFolder = subFolders.next();

    if (subFolder.ID === folderID) return subFolder;
  }

  return null;
}

module.exports.init = function (editor) {
  var CustomObjectMgr = require('dw/object/CustomObjectMgr');
  var siteLibrary = ContentMgr.getSiteLibrary();
  var folderID = editor.configuration.get('folder') || 'root';

  var folder = siteLibrary.getRoot();

  if (folderID !== 'root') {
    folder = getSubCategoryFolder(folder, folderID);
  }

  var assets = CustomObjectMgr.getCustomObject('contentAssetsForPD', folder.ID);

  editor.configuration.put('assets', assets ? assets.custom.json : {});
};
