# optimizelyWidget
A widget to display running Optimizely(X or Classic) tests on the page, set a test cookie, remove Optimizely cache - cookies and localstorage
The repo contains the source javascript and the bookmarklet.
The source.js can be used along with any js injecting add-on to be injected on selected pages for your convenience. Tampermonkey (Chrome) and GreasyMonkey(FF) can do the job.

## How to: ##
### Using "Set": ###
In the input field you can type the name of a cookie/url parameter that when clicked on "Set" there will be a cookie created with "the_name=1" and a url parameter will be added to the url ?the_name=1.

### Using "Remove": ###
In the input field type the name of the cookie you want to remove. Hitting th e button will also remove local storage as it is used by optimizely to store data as well as all Optimizely cookies so you can start fresh testing another variant

### Force view another variant: ###
Click on the link "activate" next to the variant's name on the widget
Note: tracking is disabled when variant is forced. Remove the url parameter "optimizelt_x={variationID}" if you want to test conversions.



