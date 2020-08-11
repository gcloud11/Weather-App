$(document).ready(function () {


  //Some global variables
  var apiKey = "136f96d498f0da13a106531dfaeccd75"
  var savedSearch = [];
  var storedCities = JSON.parse(localStorage.getItem("history"))
  var cityList = $("#city-list")
  var userSearchInput
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + userSearchInput + "&appid=136f96d498f0da13a106531dfaeccd75";
  var fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + userSearchInput + "&appid=136f96d498f0da13a106531dfaeccd75";

  //Making save button functional
  $(".save-btn").on("click", function () {

    userSearchInput = $(".search-input").val();
    $(".welcome").hide();
    $(".card").removeClass("hide");
    $(".city").removeClass("hide");
    $(".5-Day").removeClass("hide");
    $("#inputVal").val("");

    apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + userSearchInput + "&appid=136f96d498f0da13a106531dfaeccd75";
    fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + userSearchInput + "&appid=136f96d498f0da13a106531dfaeccd75";



    //Setting saved searches to local storage
    savedSearch.push(userSearchInput);
    localStorage.setItem("history", JSON.stringify(savedSearch));
    // console.log(storedCities);
    cityList.empty();

    for (var i = 0; i < savedSearch.length; i++) {
      var cityIndex = $("<li>").text(savedSearch[i]).attr('data-city', savedSearch[i]);
      cityIndex.attr("class", "list-group-item");

      cityList.append(cityIndex);
    }


    //Calling function for all city related weather information    
    renderAll();

  });



  //Making the search history list clickable and redered all city related weather information
  
  $("#city-searches").on("click", ".list-group-item", function () {
    userSearchInput = $(this).attr('data-city');
    console.log(userSearchInput); 
    apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + userSearchInput + "&appid=136f96d498f0da13a106531dfaeccd75";
    renderAll();
  }
  );




  //Fetching city name, temp, humidity ect from api: open weather map
  function renderAll() {

    $.ajax({
      url: apiUrl,
      method: "GET"
    }).then(function (response) {
      console.log(response);

      var title = $("#title");
      var titleDate = moment().format("(MM/DD/YYYY)");
      title.text(response.name + titleDate) ; //title forecastInfo.weather[0].icon


      var tempKel = response.main.temp;
      // console.log(response.main.temp);
      var tempF = 1.8 * (tempKel - 273) + 32
      $("#temp").text(tempF.toFixed(1) + " F") //convert to F.

      $("#humid").text(response.main.humidity)//humid
      $("#wind").text(response.wind.speed + " MPH")//wind 




      //Fetching the UV Index         
      var long = response.coord.lon;
      var lat = response.coord.lat;
      var uvIndexUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=136f96d498f0da13a106531dfaeccd75&lat=" + lat + "&lon=" + long;

      $.ajax({
        url: uvIndexUrl,
        method: "GET"
      }).then(function (resp) {
        // console.log(resp);

        $("#index").text(resp.value)//index
        var uv = resp.value;

        if (uv >= 0 && uv <= 3.99) {
          $("#index").attr("style", "background-color: green");
        }
        else if (uv >= 4 && uv <= 8.99) {
          $("#index").attr("style", "background-color: yellow");
        }
        else if (uv >= 9 && uv <= 14.00) {
          $("#index").attr("style", "background-color: red");
        }
        else { $("#index").attr("style", "background-color: grey"); }

      });




      //Fetching the 5 day forecast and creating and appending elements      
      $.ajax({
        url: fiveDayUrl,
        Method: "GET"
      }).then(function (res) {
        // console.log(res);

        $("#forecastBelow").empty();
        var forecastList = res.list;

        for (var i = 0; i < forecastList.length; i++) {
          var forecastInfo = res.list[i];
          // console.log(forecastInfo);
          var forecastDateTime = forecastInfo.dt_txt;
          // console.log(forecastDateTime); 
          var forecastDiv = $("<div>")

          if (forecastDateTime.match("15:00:00")) {
            var forecastBlock = forecastDiv.attr("class", "forecastBox")
            // console.log(forecastBlock);
            var forecastDate = moment(forecastInfo.dt, "X").format(" MM/DD/YYYY");
            // console.log(forecastDate);
            var forecastImage = $("<img>").attr("src", "https://openweathermap.org/img/w/" + forecastInfo.weather[0].icon + ".png")
            // console.log(forecastImage);
            var kelTemp = forecastInfo.main.temp;
            // console.log(kelTemp);
            var kelToFar = 1.8 * (kelTemp - 273) + 32;
            // console.log(kelTemp);
            var fTemp = $("<p>").text("Temp: " + kelToFar.toFixed(1) + " F");
            // console.log(fTemp);
            // var decimal = fTemp.toFixed();
            // console.log(decimal);
            var hum = $("<p>").text("Humidity: " + forecastInfo.main.humidity + "%");
            // console.log(hum);

            forecastBlock.append(forecastDate, forecastImage, fTemp, hum);
            $("#forecastBelow").append(forecastBlock);

            //5-day forecast div CSS styling
            forecastDiv.attr("class", "card text-white bg-primary");
            forecastDiv.css("float", "left");
            forecastDiv.css("display", "in-line block");



          }
        }


      })
    })


  };

});




//Click save button and current city weather populates on right with that city's weather conditions. Before space is blank.

//Searched city is now saved under the search input on the browser. (Use local storage set & get?). Show last searched cities.

//Present future 5 day forecast for current city.

//Repeat fo all searched cities.










