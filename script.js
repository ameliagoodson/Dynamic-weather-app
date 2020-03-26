
//API KEY and HTML ELEMENTS
var date = $(".date")
var temp = $(".temp")
var humidity = $(".humidity")
var windSpeed = $(".windSpeed")
var UVindex = $(".UVindex")
var latCity;
var longCity;
var searches = JSON.parse(localStorage.getItem("saveNew")) || []

showSearchHistory()

var APIKey = "1b4512089e4c115253758abb4b509fb0";

//click event
$("#searchBtn").on('click', function (event) {
    //prevents the submit button from trying to submit a form when clicked
    event.preventDefault();

    //display 5-day forecast below
    $(".container-fluid").removeClass("hide")

    //grab the text from the input box
    var searchInp = $("#searchInp").val();

    getForecast(searchInp);
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


        console.log(filteredDays[0])
        //UPDATE CURRENT WEATHER INFORMATION 
        $(".cityName").text(searchInp)
        $(".current-icon").attr("src", "http://openweathermap.org/img/wn/" + filteredDays[0].weather[0].icon + ".png");
        $('.temp').text("Temperature: " + filteredDays[0].main.temp + "°C");
        $('.humidity').text("Humidity: " + filteredDays[0].main.humidity + "%");
        $('.windSpeed').text("Wind speed: " + filteredDays[0].wind.speed + " KMPH");
        //$('.UVindex').text("UV index: " + )


        //FUTURE WEATHER INFORMATION IN A LOOP TO MINIMISE REPETITION 
        var x;
        for (var i = 0; i < filteredDays.length; i++) {
            x = i + 1;
            $('#day' + x + '-date').text(filteredDays[i].dt_txt);
            $('#day' + x + '-temp').text("Temperature: " + filteredDays[i].main.temp + "°C");
            $('#day' + x + '-hum').text("Humidity: " + filteredDays[i].main.humidity + "%");
            $('#day' + x + '-description').text(filteredDays[i].weather[0].description);
            $('#day' + x + '-icon').attr("src", "http://openweathermap.org/img/wn/" + filteredDays[i].weather[0].icon + ".png")
        }

        //ADD PREVIOUS SEARCHES TO SIDEBAR
        var savedSearch = $(".savedSearches");
        savedSearch = searchInp;

        searches.push(savedSearch)

        //save more than one search     
        //returns something like "['Tokyo'.'Sydney']". It is the oposite of JSON.parse()   
        var citiesString = JSON.stringify(searches);
        localStorage.setItem("saveNew", citiesString);
        // $(".savedSearches").append(citiesString);
        showSearchHistory()
        //SAVE PREVIOUS SEARCHES TO SIDEBAR WITH LOCAL STORAGE
        // localStorage.setItem("save", savedSearch);
        // $(".savedSearches").append(savedSearch);
    })
}
// $(".savedSearches").append(localStorage.getItem("saveNew"))

function showSearchHistory() {
    if (searches.length > 0) {
        $(".savedSearches").empty();
        for (var i = 0; i < searches.length; i++) {
            var cityBtn = $("<button>");
            cityBtn.text(searches[i]);
            $(".savedSearches").append(cityBtn);
        }
    }
    // $('.savedSearches button').on('click', function() {
    //    console.log(this)
    //    console.log('test ')
    //     // getForecast()
    // }) 
};

function getCoordinates(searchInp) {
    //api.openweathermap.org/data/2.5/weather?q=tokyo&appid=1b4512089e4c115253758abb4b509fb0
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInp + "&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        //GET COORDINATES 
        latCity = response.coord.lat;
        longCity = response.coord.lon;

        console.log(latCity)
        console.log(longCity)
        getUVIndex(latCity, longCity);
    });


}
function getUVIndex(latCity, longCity) {
    var queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latCity + "&lon=" + longCity;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        $(".UVindex").text("UV index: " + response.value)

// function changeUVcol() {
        if (response.value < 4) {
            $(".UVindex").addClass("UVlow");
        }

        if (response.value > 4.1 && response.value < 8) {
            $(".UVindex").addClass("UVmed")
        };

        if (response.value > 9) {
            $(".UVindex").addClass("UVhigh")
        }
    });
console.log(response.value)

};