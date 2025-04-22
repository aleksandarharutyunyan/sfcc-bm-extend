'use strict';
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var Logger = require('dw/system/Logger');
var System = require('dw/system/System');

/**
 * Gets order's Invoice or CreditMemo file so the customer can download it
 * @param {string} invoiceFileName Order's Invoice FileName
 * @returns {Object} File data
 */
function getInvoiceReceiptFileData(invoiceFileName) {
    const result = getDownloadInvoiceAPI(invoiceFileName);
    return result.object;
}

/**
 * Gets response from Download Invoice API
 * @param {string} invoiceFileName - Invoice File Name
 * @return {Object} the service response
 */
function getDownloadInvoiceAPI(invoiceFileName) {

    const service = LocalServiceRegistry.createService('extend.download.invoice', {
        /**
         * @param {dw.svc.HTTPService} svc - HTTP Service instance
         * @param {Object} args - Additional parameters
         * @returns {void}
         */
        createRequest: function (svc, args) {
            const credentials = svc.configuration.credential;
            var azureToken = System.getPreferences().getCustom().azureToken;
            svc.setRequestMethod('GET');
            svc.addHeader('Content-Type', 'application/pdf');
            let uri = svc.URL + '/' + invoiceFileName + '?' + azureToken;
            svc.setURL(uri);
        },
      
        /**
         * JSON parse the response text and return it
         *
         * @param {dw.svc.HTTPService} svc - HTTP Service instance
         * @param {dw.net.HTTPClient} client - HTTPClient class instance of the current service
         * @returns {Object} - Service response object
         */
        parseResponse: function (svc, client) {
            return getFileDataFromResponse(client);
        },

        /**
         * Allows filtering communication URL, request, and response log messages
         *
         * @param {string} msg - Original log message
         * @returns {string} - Message to be logged
         */
        filterLogMessage: function (msg) {
            if (msg && msg.indexOf('%PDF-') !== -1) {
                // Prevent logging the entire file content
                return 'Encoded PDF File Content (removed from logs)';
            }
            return msg;
        }
    });

    try {
        
        var serviceResult = service.call();
      
        return serviceResult;
    } catch (error) {
        Logger.error('Error in Download Invoice service: {0}', error);
        return { status: false, object: { response: {} } };
    }
}


/**
 * Gets the file-related data from the service response
 * @param {dw.net.HTTPClient} client - HTTPClient class instance of the current service
 * @returns {Object} - File data
 */
function getFileDataFromResponse(client) {
    const encoding = 'iso-8859-1';
    let contentDisposition = client.responseHeaders.get('Content-Disposition');
    //contentDisposition = contentDisposition.length > 0 ? contentDisposition[0] : 'attachment';
    let contentType = client.responseHeaders.get('Content-Type');
    contentType = contentType.length > 0 ? contentType[0] : 'application/pdf';
    contentType += '; charset=' + encoding;
    return {
        
        contentType: contentType,
        content: client.getText(encoding)
    };
}


module.exports = {
    getInvoiceReceiptFileData: getInvoiceReceiptFileData,
    getDownloadInvoiceAPI:getDownloadInvoiceAPI,
    getFileDataFromResponse:getFileDataFromResponse
};
