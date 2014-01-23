dronestream
===========

Google map of all reported US drone strikes since the first one in 2002.  JSON data provided publicly by the Dronestream project (http://dronestre.am/), and can be viewed downloaded at http://api.dronestre.am/data.

Some quick notes:

* The map auto-centers around all locations
* The data can be filtered by year and/or country
* Clicking on a particular marker reveals an info window with additional information about the respective drone strike
* index.php has very little server-side code (4 lines), so this page is easily ported to the language/platform of choice (originally created to host within a WordPress site, so that is the reason for PHP)
