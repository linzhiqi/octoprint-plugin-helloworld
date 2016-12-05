# coding=utf-8
from __future__ import absolute_import

import octoprint.plugin
import logging
import MFRC522

class NfcPlugin(octoprint.plugin.StartupPlugin,
	octoprint.plugin.TemplatePlugin,
	octoprint.plugin.SettingsPlugin,
	octoprint.plugin.AssetPlugin,
	octoprint.plugin.SimpleApiPlugin):

	MIFAREReader = MFRC522.MFRC522()
	lNum = ""

	def on_after_startup(self):
		self._logger.info("Hello World! (more: %s)" % self._settings.get(["url"]))

	def get_settings_defaults(self):
		return dict(url="https://en.wikipedia.org/wiki/Hello_world")

	def get_template_configs(self):
		self._logger.info("My tag: inside HelloWorldPlugin.get_template_configs")
		return [
			dict(type="navbar", custom_bindings=False),
			dict(type="settings", custom_bindings=False)
		]

	def get_assets(self):
		self._logger.info("My tag: inside HelloWorldPlugin.get_assets")
		return dict(
			js=["js/nfc.js"]
		)

	def on_api_get(self, request):
		# Scan for cards    
		(status,TagType) = MIFAREReader.MFRC522_Request(MIFAREReader.PICC_REQIDL)

		# If a card is found
		if status == MIFAREReader.MI_OK:
			print "Card detected"
	    
		# Get the UID of the card
		(status,uid) = MIFAREReader.MFRC522_Anticoll()

		# If we have the UID, continue
		if status == MIFAREReader.MI_OK:
			lNum = uid
			return flask.jsonify(UID=uid)
		else:
			return flask.jsonify(UID=lNum)
#__plugin_name__ = "Hello World"

__plugin_implementation__ = NfcPlugin()

