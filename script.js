
//API KEY and HTML ELEMENTS
var date = $(".date")
var temp = $(".temp")
var humidity = $(".humidity")
var windSpeed = $(".windSpeed")
var UVindex = $(".UVindex")
var latCity;
var longCity;
var searches = JSON.parse(localStorage.getItem("saveNew")) || []

var APIKey = "1b4512089e4c115253758abb4b509fb0";

//RELOAD LAST SAVED SEARCH ON PAGE RELOAD
var historyString = localStorage.getItem('saveNew');
if (historyString !== null) {
    const history = JSON.parse(historyString);
    console.log(history);
    var lastCity = history.pop();
    getForecast(lastCity)
    getCoordinates(lastCity)
}

//CLICK SEARCH BUTTON TO DISPLAY 5-DAY FORECAST AND CALL FUNCTIONS
$("#searchBtn").on('click', function (event) {
    //prevents the submit button from trying to submit a form when clicked
    event.preventDefault();

    //display 5-day forecast (previously hidden)
    $(".container-fluid").removeClass("hide")

    //grab the text from the input box
    var searchInp = $("#searchInp").val();

    //call the necessary functions
    getForecast(searchInp);
    addSearchHistory(searchInp);
    getCoordinates(searchInp);

})

function getForecast(searchInp) {
    // Construct our URLs
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInp + "&units=metric" + "&appid=" + APIKey;
    ////////////FINISH THIS

    //display date
    var currentDate = moment();
    $(".date").text("Today's date: " + currentDate.format("dddd, D MMMM YYYY, h:mm a"));

    //hit the queryURL with $ajax, then take the response data and display it in the temp div
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        //filter the timeslots in the array to select the 12pm slot only. Produces 5 objects from the array
        var filteredDays = response.list.filter(
            function (currentElement) {
                return currentElement.dt_txt.includes("12:00:00");
            }
        );

        //UPDATE CURRENT WEATHER INFORMATION 
        $(".cityName").text(searchInp)
        $(".current-icon").attr("src", "http://openweathermap.org/img/wn/" + filteredDays[0].weather[0].icon + ".png");
        $('.temp').text("Temperature: " + filteredDays[0].main.temp + "°C");
        $('.humidity').text("Humidity: " + filteredDays[0].main.humidity + "%");
        $('.windSpeed').text("Wind speed: " + filteredDays[0].wind.speed + " KMPH");


        //FUTURE WEATHER INFORMATION IN A LOOP TO MINIMISE REPETITION 
        function getForecast5() {
            var x;
            for (var i = 0; i < filteredDays.length; i++) {
                x = i + 1;
                $('#day' + x + '-date').text(filteredDays[i].dt_txt);
                $('#day' + x + '-temp').text("Temperature: " + filteredDays[i].main.temp + "°C");
                $('#day' + x + '-hum').text("Humidity: " + filteredDays[i].main.humidity + "%");
                $('#day' + x + '-description').text(filteredDays[i].weather[0].description);
                $('#day' + x + '-icon').attr("src", "http://openweathermap.org/img/wn/" + filteredDays[i].weather[0].icon + ".png")

            }
        }
        getForecast5()
    })
}

//ADD PREVIOUS SEARCHES TO SIDEBAR
function addSearchHistory(searchInp) {
    var savedSearch = $(".savedSearches");
    savedSearch = searchInp;

    searches.push(savedSearch)

    var citiesString = JSON.stringify(searches);
    localStorage.setItem("saveNew", citiesString);
    showSearchHistory()
}
//GET GEOGRAPHIC COORDINATES FOR PURPOSE OF GETTING UV INDEX
function getCoordinates(searchInp) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInp + "&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        latCity = response.coord.lat;
        longCity = response.coord.lon;

        getUVIndex(latCity, longCity);
    });

    //GET UV INDEX INFORMATION USING GEOGRAPHIC COORDINATES
}
function getUVIndex(latCity, longCity) {
    var queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latCity + "&lon=" + longCity;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        $(".UVindex").text("UV index: " + response.value)

        // change UV index colour
        if (response.value < 4) {
            $(".UVindex").addClass("UVlow");
        }

        if (response.value > 4.1 && response.value < 8) {
            $(".UVindex").addClass("UVmed")
        };

        if (response.value > 8.1) {
            $(".UVindex").addClass("UVhigh")
        }
    });
}
//DISPLAY SEARCH HISTORY ON SIDEBAR AND ADD BUTTON CONTAIING THAT PREVIOUS SEARCH
function showSearchHistory() {
    if (searches.length > 0) {
        $(".savedSearches").empty()
        for (var i = 0; i < searches.length; i++) {
            var cityBtn = $("<button>");
            cityBtn.text(searches[i]);
            $(".savedSearches").append(cityBtn);
        }

    }
    //Grab  city name from the this object. And send the city name as a parameter to the function getForecast
    $('.savedSearches button').on('click', function () {
        event.preventDefault()
        var searchedCity = ($(this).text())

        getForecast(searchedCity)
        getCoordinates(searchedCity)
        getUVIndex(searchedCity)
        getForecast5(searchedCity)
    })
}