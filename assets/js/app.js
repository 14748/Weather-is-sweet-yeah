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
