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

    function myTimeoutFunction() {
      $.ajax({
                    url: API_BASEURL + "plugin/nfc",
                    type: "GET",
                    dataType: "json",
		    headers: {"X-Api-Key": "C6A337C4314F4D98AC12000A5FEAD2E0"},
                    contentType: "application/json;charset=utf-8",
                    success : function(response, textStatus, jqXhr) {
                        console.log("response:", response);
                    }
            });
    }

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
