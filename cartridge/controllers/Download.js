'use strict';

var server = require('server');

server.get('Invoice', function (req, res, next) {
  var Logger = require('dw/system/Logger');
  var URLUtils = require('dw/web/URLUtils');
  var filename = req.querystring.filename;
    
  var redirectURL = URLUtils.https('Download-Notfound', 'filename', filename);
    try {
        if(!filename) {
          res.redirect(redirectURL);
        }
        var invoiceHTTPQuery =   require('~/cartridge/scripts/downloadInvoice');
        var fileData = invoiceHTTPQuery.getInvoiceReceiptFileData(filename);
        if (fileData) {
            res.setHttpHeader(dw.system.Response.CONTENT_DISPOSITION, 'attachment; filename=\"' + filename + '\"');
            res.setContentType(fileData.contentType);
            res.print(fileData.content);
        }else{
          res.redirect(redirectURL);
        }
        
    }catch (err) {
      Logger.error('Cant access requested file({0}) from Impex: {1}.\n{2}\n{3}', filename, orderID, err.message, err.stack);
      res.redirect(redirectURL);
    }
  return next();
});

server.get('Start', function (req, res, next) {
  res.render('invoice');
  return next();
});

server.get('Notfound', function (req, res, next) {
  var filename = req.querystring.filename?req.querystring.filename:'';
  res.render('notfound',{
    filename : filename
  });
  return next();
});
  

module.exports = server.exports();
