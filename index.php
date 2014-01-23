<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="css/dronestream.css"/>
    <script type="text/javascript" src="js/helpers.js"></script>
    <script type="text/javascript" src="js/dronestream.js"></script>
</head>
<body>
<div id="menu">
    <h1>Dronestream</h1>
    <span id="dronestream-filters">
        <select id="selYear" name="selYear">
            <option value="0">--- All Years ---</option>
            <?php
            $current_year = date('Y');
            for( $i = $current_year; $i >= 2002; $i-- ) {
                echo '<option value="' . $i . '">' . $i . '</option>';
            }
            ?>
        </select>
        &nbsp;
        <select id="selRegion" name="selRegion">
            <option value="0">--- All Regions ---</option>
            <option value="Pakistan-Afghanistan Border">Pakistan-Afghanistan Border</option>
            <option value="Pakistan">Pakistan</option>
            <option value="Somalia">Somalia</option>
            <option value="Yemen">Yemen</option>
        </select>
        &nbsp;<button id="btnFilter" name="btnFilter" onclick="initializeMap();">Filter</button>
    </span>
    <span id="dronestream-stats"></span>
    <span id="dronestream-attribution">
        <a href="http://dronestre.am/" target="_blank" title="visit the Dronestream project website">dronestre.am</a>
        &nbsp;&bull;&nbsp;
        <a href="http://api.dronestre.am/data" target="_blank" title="get the Dronestream project raw JSON data">view raw data</a>
    </span>
</div>
<div id="map-canvas"></div>
</body>
</html>
