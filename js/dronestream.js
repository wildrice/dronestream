/************************************************************************************************************************
 * ORDER OF FUNCTION CALLS TO MAINTAIN A CLEAR UNDERSTANDING OF THE LOGICAL FLOW
 *
 * 1. loadScripts()         - execution of direct function call once the window completes the loading of everything
 * 2. getDroneStreamJSON()  - execution of callback once the first script src is set
 * 3. initializeMap()       - execution of callback once the JSON is loaded into local var
 * 4. setMarkers()          - execution of direct function call once the locations info is parsed from the JSON local var
 *
 *
 * DRONESTREAM DATA REFERENCE FOR THE STRIKE ARRAY WITHIN THE DATA OBJECT
 *
 * _id: drone strike ID
 * number:              number of the drone strike in chronological sequence
 * country:             country in which the strike occurred
 * date:                date on which the strike occurred
 * town:                town in which the strike occurred
 * location:            location in which the strike occurred
 * deaths:              the number of reported deaths for this strike
 * deaths_min:          the minimum number of suspected deaths due to this strike
 * deaths_max:          the maximum number of suspected deaths due to this strike
 * civilians:           number of civilians impacted due to this strike
 * injuries:            number of injured people due to this strike
 * children:            number of children harmed due to this strike
 * tweet_id:            the twitter tweet ID
 * bureau_id:           the Bureau of Investigative Journalism (BIJ) ID from their database
 * bij_summary_short:   the summary of this strike from the BIJ
 * bij_link:            the URL to the BIJ page of information about this strike
 * target:              primary terrorist target
 * lat:                 latitude
 * lon:                 longitude
 * articles:            array of related articles about this strike
 * names:               array of names of people involved in this strike
 *
 ************************************************************************************************************************/

// var to hold the JSON from the dronestream project data
var droneStreamJSON = {};

// initial call to unleash the goodness
window.onload = loadScript;

// loads the scripts needed (asynchronously) for the dronestream JSON and the google maps
function loadScript() {

    // load the dronestream JSON data - makes a call to the getDroneStreamJSON function
    createScriptElement('http://api.dronestre.am/data?callback=getDroneStreamJSON', true);
}

/**********
 * get the drone stream JSON, and create the script dynamically for the gmaps
 */
function getDroneStreamJSON(data) {

    // check the drone stream status and set the JSON variable if so
    if(data.status.toLowerCase() === 'ok') {
        droneStreamJSON = data;
    } else {
        droneStreamJSON = false;
    }

    // load the gmapi script - makes a call to the initializeMap function
    createScriptElement('https://maps.googleapis.com/maps/api/js?sensor=false&callback=initializeMap', false);
}

/**********
 * initialize the map
 */
function initializeMap() {

    // get the year and country select box values for filtering (0 and 0 are the defaults)
    var year = getSelectBoxData('selYear', true);
    var country = getSelectBoxData('selRegion', true);

    // set the map options
    var mapOptions = {
        zoom: 3,
        center: new google.maps.LatLng(23.424076, 53.847818)    // UAE lat/long
    };

    // make a new map for the map-canvas div
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // if we have a JSON drone stream, then set the map markers
    if(droneStreamJSON) {
        setMarkers(map, droneStreamJSON.strike, year, country);
    }
}

/**********
 * set up and configure the map markers
 */
function setMarkers(map, locations, year, country) {

    var boolYear = true, boolCountry = true;
    var strikeCount = 0, minDeaths = 0, maxDeaths = 0;
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < locations.length; i++) {

        var mapLocation = locations[i];

        // use the year value to determine if further filtering is required for the map
        if(year != 0) {
            var d = new Date(mapLocation.date);
            var mapLocationYear = d.getFullYear();

            //alert('mapLocationYear = ' + mapLocationYear + ' :: year = ' + year);

            if(mapLocationYear == year) {
                boolYear = true;
            } else {
                boolYear = false;
            }
        }

        // use the country value to determine if further filtering is required for the map
        if(country != 0) {
            if(mapLocation.country == country) {
                boolCountry = true;
            } else {
                boolCountry = false;
            }
        }

        // only if the year and country match does the location get mapped
        if(boolYear && boolCountry) {

            // update the stats for this filtering of data (i.e., strike count, min deaths, max deaths)
            strikeCount++;
            minDeaths += (isNaN(parseInt(mapLocation.deaths_min, 10))) ? 0 : parseInt(mapLocation.deaths_min, 10);
            maxDeaths += (isNaN(parseInt(mapLocation.deaths_max, 10))) ? 0 : parseInt(mapLocation.deaths_max, 10);
            //minDeaths += mapLocation.deaths_min;
            //maxDeaths += mapLocation.deaths_max;

            // set up the content for the info window
            var iwDeaths = mapLocation.deaths;
            var iwDate = formatDate(mapLocation.date);
            var iwNumber = mapLocation.number;
            var iwSummary = (mapLocation.bij_summary_short.length > 0)
                ? mapLocation.bij_summary_short
                : 'No summary available.';
            var iwLink = (mapLocation.bij_link.length > 0)
                ? '[ <a href="' + mapLocation.bij_link + '" target="_blank">read more</a> ]'
                : 'No article link available.';
            var iwCountry = mapLocation.country;
            var iwLocation = (mapLocation.location.length > 0)
                ? mapLocation.location + ', '
                : '';
            var iwTown = (mapLocation.town.length > 0)
                ? mapLocation.town
                : '';
            var iwCivilians = (mapLocation.civilians.length > 0)
                ? mapLocation.civilians
                : '0';

            var infoWindowHTML = '<div class="gmap-info-window-content">' +
                '<h2>' + iwDeaths + ' killed on ' + iwDate + '</h2>' +
                '<p><strong>Drone Strike:</strong> ' + iwNumber + '</p>' +
                '<hr />' +
                '<p>' + iwSummary + '</p>' +
                '<p>' + iwLink + '</p>' +
                '<hr />' +
                '<p><strong>Country: </strong>' + iwCountry +
                '<br /><strong>Location: </strong>' + iwLocation + iwTown +
                '<br /><strong>Deaths: </strong>' + iwDeaths + ' people (' + iwCivilians + ' civilians)</p>' +
                '</div>';

            var myLatLng = new google.maps.LatLng(mapLocation.lat, mapLocation.lon);
            var marker = new google.maps.Marker({
                html: infoWindowHTML,
                position: myLatLng,
                map: map,
                zIndex: strikeCount
            });

            // create the info window for the current marker
            var infoWindow = new google.maps.InfoWindow();
            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.setContent(this.html);
                infoWindow.open(map, this);
            });

            // if more than one marker, extend the map to include the markers through the loop;
            // otherwise, center and zoom for one marker
            if(locations.length > 1 && strikeCount > 0) {
                bounds.extend(myLatLng);
            } else {
                map.setCenter(myLatLng);
                map.setZoom(6);
            }
        }

    }   // end locations loop

    // center and zoom the map to include all markers, if more than one marker
    if( locations.length > 1 ) {
        map.fitBounds(bounds);
    }

    // update the dronestream-stats span with the resulting stats from the filtered strikes
    var theDeaths = (minDeaths === maxDeaths) ? maxDeaths : minDeaths + '-' + maxDeaths;
    var dronestreamStatsSpan = document.getElementById('dronestream-stats');
    dronestreamStatsSpan.innerHTML = 'Number of US drone strikes: ' + strikeCount + ' reported' +
        ' (approximately ' + theDeaths + ' deaths)';

}

