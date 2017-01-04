$(function() {
    function NfcViewModel(parameters) {
        var self = this;
        console.log("My tag: inside HelloWorldViewModel")
        self.settings = parameters[0];

        // this will hold the URL currently displayed by the iframe
        self.currentUrl = ko.observable();

        // this will hold the URL entered in the text field
        self.newUrl = ko.observable();

        // this will be called when the user clicks the "Go" button and set the iframe's URL to
        // the entered URL
        self.goToUrl = function() {
            console.log("My tab: goToUrl is called")
            self.currentUrl(self.newUrl());
        };

        // This will get called before the HelloWorldViewModel gets bound to the DOM, but after its
        // dependencies have already been initialized. It is especially guaranteed that this method
        // gets called _after_ the settings have been retrieved from the OctoPrint backend and thus
        // the SettingsViewModel been properly populated.
        self.onBeforeBinding = function() {
            console.log("My tab: onBeforeBinding is called")
            self.newUrl(self.settings.settings.plugins.nfc.url());
            self.goToUrl();
        };
    }
    var lNum = "";
    var myMap = new Map();
	myMap.set('136,83,83,34', "PLA (Polylactic Acid)");
	myMap.set('136,83,98,157', "ABS (Acrylonitrile Butadiene Styrene)");
    function myTimeoutFunction() {
      $.ajax({
                    url: API_BASEURL + "plugin/nfc",
                    type: "GET",
                    dataType: "json",
		    // the backend doesn't check if the apikey is correct or not, weird.
		    headers: {"X-Api-Key": UI_API_KEY},
                    contentType: "application/json;charset=utf-8",
                    success : function(response, textStatus, jqXhr) {
			if (response.UID !== lNum && !!myMap.get(response.UID)){
				console.log("cNum:", response.UID);
				$(".icon").addClass('one');
				$(".help").text("New filament material detected:");
				$(".material").text(myMap.get(response.UID));
				setTimeout(function() {
					$(".icon").removeClass('one');
					$(".help").text("Configuration is updated");
				}, 2500);
			} else if (response.UID !== lNum && !myMap.get(response.UID)){
				$(".icon").addClass('one');
				$(".help").text("Unrecognized filament material detected");
				$(".material").text("");
				setTimeout(function() {
					$(".icon").removeClass('one');
					$(".help").text("Please change to valid filament or configure manually");
				}, 2500);
			} else {
				// do nothing
				//$(".icon").addClass('one');
				//setTimeout(function() {
				//	$(".icon").removeClass('one');
				//}, 1000);
			}                        
			lNum = response.UID;			
                    }
            });
    }
	console.log("apikey!!!!: ", UI_API_KEY);
    setInterval(myTimeoutFunction, 1000);

    // This is how our plugin registers itself with the application, by adding some configuration
    // information to the global variable OCTOPRINT_VIEWMODELS
    OCTOPRINT_VIEWMODELS.push([
        // This is the constructor to call for instantiating the plugin
        NfcViewModel,

        // This is a list of dependencies to inject into the plugin, the order which you request
        // here is the order in which the dependencies will be injected into your view model upon
        // instantiation via the parameters argument
        ["settingsViewModel"],

        // Finally, this is the list of selectors for all elements we want this view model to be bound to.
        ["#tab_plugin_nfc"]
    ]);
});
