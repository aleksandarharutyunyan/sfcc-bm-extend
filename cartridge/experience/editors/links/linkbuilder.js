
'use strict';

/**
 *    Allows to select users search criterial like sorting rule and filters (refinements)
 */
module.exports.init = function (editor) {
  var Resource = require('dw/web/Resource');
  var URLUtils = require('dw/web/URLUtils');

  var linkTabs = [
    {
      id: 'product',
      name: Resource.msg('link.tab.product', 'pdeditor', 'Product'),
      link: '<a href="[\"Product-Show\", \"pid\", \"{FIELD_VALUE}\"]">{LINK_NAME}</a>'
    },
    {
      id: 'category',
      name: Resource.msg('link.tab.category', 'pdeditor', 'Category'),
      link: '<a href="[\"Search-Show\", \"cgid\", \"{FIELD_VALUE}\"]">{LINK_NAME}</a>'

    },
    {
      id: 'page',
      name: Resource.msg('link.tab.page', 'pdeditor', 'Page'),
      link: '<a href="[\"Page-Show\", \"cid\", \"{FIELD_VALUE}\"]">{LINK_NAME}</a>'

    },
    {
      id: 'searchterms',
      name: Resource.msg('link.tab.searchterms', 'pdeditor', 'Search-Terms'),
      link: '<a href="[\"Search-Show\", \"q\", \"{FIELD_VALUE}\"]">{LINK_NAME}</a>'

    },
    {
      id: 'popup',
      name: Resource.msg('link.tab.popup', 'pdeditor', 'Popup'),
      link: '<a href="#{FIELD_VALUE}" data-toggle="modal" data-target="#{FIELD_VALUE}">{LINK_NAME}</a>'
    },
    {
      id: 'custom',
      name: Resource.msg('link.tab.custom', 'pdeditor', 'Custom'),
      link: '<a href="{FIELD_VALUE}">{LINK_NAME}</a>'
    }
  ];

  editor.configuration.put('linkTabs', JSON.stringify(linkTabs));
};
