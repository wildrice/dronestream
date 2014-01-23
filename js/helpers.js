/****************************************************************************************************
 * HELPER FUNCTIONS
 ****************************************************************************************************/

/**********
 * dynamically adds a script tag to either the head or body element and sets the source JS
 */
function createScriptElement(src, appendToHead) {

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    if(appendToHead) {
        document.head.appendChild(script);
    } else {
        document.body.appendChild(script);
    }

}

/**********
 * returns the selected option's value or text of the requested select box
 */
function getSelectBoxData(selID, getValue) {

    var el = document.getElementById(selID);
    var val;
    if(getValue) {
        // get the value of the select box option
        val = el.options[el.selectedIndex].value;
    } else {
        // get the text of the select box option
        val = el.options[el.selectedIndex].text;
    }

    return val;

}

/**********
 * returns a date formatted to DayOfWeek, Month Day, Year (i.e., Wednesday, October 6, 1971)
 */
function formatDate(theDate) {

    var d_names = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];

    var m_names = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    var d = new Date(theDate);
    var curr_day = d.getDay();
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();

    return d_names[curr_day] + ', ' + m_names[curr_month] + ' ' + curr_date + ', ' + curr_year;

}
