function LocationIq()
{
    this.apiUrl="https://us1.locationiq.com/v1/autocomplete?key=pk.ae61caf7ea875341b84548ce1700348d&format=json&limit=5&q="
    this.param = ""
}

LocationIq.prototype.getListOfMatches = function (callback) {
    $.ajax({
        url: this.apiUrl+this.param,
        type: "GET",
        dataType: "json",
        success: function(data) {
            callback(data);
        },
        error: function(){
            callback(null);
        }
    })
}

function OpenWeather()
{
    this.currentWeather = "https://api.openweathermap.org/data/2.5/weather?appid=70183fe772720874c624c9f871eddbf8&units=metric&q="//PAMPLONA
    this.currentWeatherLatLon = "https://api.openweathermap.org/data/2.5/weather?appid=70183fe772720874c624c9f871eddbf8&units=metric" //&lat=-2&lon=40
    this.predictionWeather = "https://api.openweathermap.org/data/2.5/forecast?appid=70183fe772720874c624c9f871eddbf8&units=metric"
}

OpenWeather.prototype.getCurrentWeatherLatLon = function (lon, lat, callback){
    $.ajax({
        url: this.currentWeatherLatLon + "&lat=" + lat + "&lon="+ lon,
        type: "GET",
        dataType: "json",
        success: function(data){
            callback(data);
        },
        error: function(){
            callback(null);
        }
    })
}

OpenWeather.prototype.getCurrentWeather = function (param, callback) {
    $.ajax({
        url: this.currentWeather + param,
        type: "GET",
        dataType: "json",
        success: function(data){
            callback(data);
        },
        error: function(){
            callback(null);
        }
    })
}

OpenWeather.prototype.getPredictionWeather = function(lon, lat, callback) {
    $.ajax({
        url: this.predictionWeather+"&lon="+lon+"&lat="+lat,
        type: "GET",
        dataType: "json",
        success: function(data){
            callback(data);
        },
        error: function(callback){
            callback(null);
        }
    })
}

//Function to retrieve user GEO POSITION with a promt asking for persmision
function getLocation(openWeather) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                showPosition(position, openWeather);
            }, 
            null, 
            {
               enableHighAccuracy: true,
               timeout: 5000,
               maximumAge: 0
            }
        );
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
}

//This is the method triggered on allow GeoPosition --> Lat/Lon
function showPosition(position, openWeather) {
    openWeather.getCurrentWeatherLatLon(position.coords.longitude, position.coords.latitude, function(data){
        fillWidget(data, openWeather);
    })
}

//This is the method triggered on City Seacrh --> city
function getWeatherDataFromParam(city, openWeather){
    openWeather.getCurrentWeather(city, function(data){
        fillWidget(data, openWeather);
    })
}

function fillWidget(data, openWeather){
    function getBackground(status){
        switch (status) {
            case "snow":
            document.getElementById("wrapper-bg").style.backgroundImage =
            "url('https://mdbgo.io/ascensus/mdb-advanced/img/snow.gif')";
            break;
            case "broken clouds":
            document.getElementById("wrapper-bg").style.backgroundImage =
            "url('https://mdbgo.io/ascensus/mdb-advanced/img/clouds.gif')";
            break;
            case "scattered clouds":
            document.getElementById("wrapper-bg").style.backgroundImage =
            "url('https://mdbgo.io/ascensus/mdb-advanced/img/clouds.gif')";
            break;
            case "few clouds":
            document.getElementById("wrapper-bg").style.backgroundImage =
            "url('https://mdbgo.io/ascensus/mdb-advanced/img/clouds.gif')";
            break;
            case "mist":
            document.getElementById("wrapper-bg").style.backgroundImage =
            "url('https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif')";
            break;
            case "rain":
            document.getElementById("wrapper-bg").style.backgroundImage =
            "url('https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif')";
            break;
            case "shower rain":
            document.getElementById("wrapper-bg").style.backgroundImage =
            "url('https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif')";
            break;
            case "clear sky":
            document.getElementById("wrapper-bg").style.backgroundImage =
            "url('https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif')";
            break;
            case "thunderstorm":
            document.getElementById("wrapper-bg").style.backgroundImage =
            "url('https://mdbgo.io/ascensus/mdb-advanced/img/thunderstorm.gif')";
            break;
            default:
            document.getElementById("wrapper-bg").style.backgroundImage =
            "url('https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif')";
            break;
            }
    }
    if (data) {
        $("#widgetCity").text(data.name + ", " + data.sys.country);
        $("#widgetWeather").text(data.weather[0].description);
        $("#widgetTemperature").text(Math.round(data.main.temp)+"°");
        $("#widgetPressure").text(data.main.pressure);
        $("#widgetHumidity").text(data.main.humidity);
        $("#widgetWind").text(data.wind.speed);
        getBackground(data.weather[0].description);
        openWeather.getPredictionWeather(data.coord.lon, data.coord.lat, function(listData){
            fillWidgetBody(listData);
        })

    }else{
        //Handle error
    }
    $("#widgetTime").removeClass("d-none");
}

function fillWidgetBody(listData){

    function formatDateToInt(dateStr) {
        const dateAndTime = dateStr.split(" ");
        return parseInt(dateAndTime[0].split('-').join(''), 10);
    }
    
    function getDateAndTime(dateStr) {
        const [date, timePart] = dateStr.split(" ");
        const realDate = new Date(date);
        const time = timePart.split(":");
        return [realDate, `${time[0]}:${time[1]}`];
    }

    if (listData) {
        currentDate = formatDateToInt(listData.list[0].dt_txt);
        avgWeather = 0;
        numOfPredsPerDay = 0;
        indexFilled = 0;
        weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        for (index = 0; index < listData.list.length; index++) {
            $("#widgetTime"+index).text(Math.round(listData.list[index].main.temp)+"°");

            const newDateInt = formatDateToInt(listData.list[index].dt_txt);
            const [realDate, time] = getDateAndTime(listData.list[index].dt_txt);

            $("#widgetToday" + index + "Tmp").text(time);

            if (newDateInt > currentDate || index == listData.list.length - 1) {
                const dayIndex = (index === listData.list.length - 1) ? realDate.getDay() : realDate.getDay() - 1;
                $("#widgetDay" + indexFilled + "Date").text(weekdays[dayIndex]);

                $("#widgetDay" + indexFilled + "Temp").text(Math.round(avgWeather / numOfPredsPerDay) + "°");
                indexFilled += 1;
                avgWeather = 0;
                numOfPredsPerDay = 0;
                currentDate = newDateInt;
            }

            avgWeather += listData.list[index].main.temp;
            numOfPredsPerDay += 1
        }
    }else{
        //Handle Error
    }
}