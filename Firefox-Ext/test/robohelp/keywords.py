import os
import os.path as path
from selenium.webdriver import FirefoxProfile
from sikuli.Sikuli import click, type, wait

FIREFOX_BINARY = "/Applications/Firefox.app/Contents/MacOS/firefox"

os.environ["PATH"] = os.environ["PATH"] + os.pathsep + path.dirname(FIREFOX_BINARY)


class AddonProfile(FirefoxProfile):

  def __init__(self):
    super(AddonProfile, self).__init__()
    self.add_extension(path.join(path.dirname(path.dirname(__file__)), "res", "addon.xpi"))


class AddonKeywords(object):

  res_dir = path.join(path.dirname(__file__), "res")
  addon_profile = AddonProfile()

  def get_addon_profile_dir(self):
    return self.addon_profile.profile_dir

  def click_image(self, image_name):
    click(self._get_image_path(image_name))

  def type_input(self, text):
    type(text)

  def wait_until_image_appears(self, image_name):
    wait(self._get_image_path(image_name))

  def _get_image_path(self, image_name):
    return path.join(self.res_dir, image_name)
