# coding=utf-8
from __future__ import absolute_import

import octoprint.plugin
import logging

class NfcPlugin(octoprint.plugin.StartupPlugin,
	octoprint.plugin.TemplatePlugin,
	octoprint.plugin.SettingsPlugin,
	octoprint.plugin.AssetPlugin):

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

#__plugin_name__ = "Hello World"

__plugin_implementation__ = NfcPlugin()

