const backgroundMap = {
    "Snow": "https://mdbgo.io/ascensus/mdb-advanced/img/snow.gif",
    "Clouds": "https://mdbgo.io/ascensus/mdb-advanced/img/clouds.gif",
    "Mist": "https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif",
    "Rain": "https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif",
    "Drizzle": "https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif",
    "Clear": "https://th.bing.com/th/id/R.5c72d24fb1d31f573e3cd53ea975d5e1?rik=nXKTr6aYj22jTA&pid=ImgRaw&r=0",
    "Thunderstorm": "https://mdbgo.io/ascensus/mdb-advanced/img/thunderstorm.gif",
    "Smoke": "https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif",
    "Haze": "https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif",
    "Dust": "https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif",
    "Fog": "https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif",
    "Sand": "https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif",
    "Squall": "https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif",
    "Tornado": "https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif"
};

const imageMap = {
    "Snow": "13d@2x.png",
    "Clouds": "03d@2x.png",
    "Mist": "50d@2x.png",
    "Rain": "10d@2x.png",
    "Drizzle": "09d@2x.png",
    "Clear": "01d@2x.png",
    "Thunderstorm": "11d@2x.png",
    "Smoke": "50d@2x.png",
    "Haze": "50d@2x.png",
    "Dust": "50d@2x.png",
    "Fog": "50d@2x.png",
    "Sand": "50d@2x.png",
    "Squall": "50d@2x.png",
    "Tornado": "50d@2x.png"
};

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
            callback(null, data);
        },
        error: function(jqXHR){
            callback(`Status: ${jqXHR.status}, ${jqXHR.responseJSON.error}`, null);
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
            callback(null, data);
        },
        error: function(jqXHR){
            callback(`Status: ${jqXHR.responseJSON.cod}, ${jqXHR.responseJSON.message}`, null);
        }
    })
}

OpenWeather.prototype.getCurrentWeather = function (param, callback) {
    $.ajax({
        url: this.currentWeather + param,
        type: "GET",
        dataType: "json",
        success: function(data){
            callback(null, data);
        },
        error: function(jqXHR){
            callback(`Status: ${jqXHR.responseJSON.cod}, ${jqXHR.responseJSON.message}`, null);
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
    openWeather.getCurrentWeatherLatLon(position.coords.longitude, position.coords.latitude, function(error, data){
        fillWidget(error, data, openWeather);
    })
}

//This is the method triggered on City Seacrh --> city
function getWeatherDataFromParam(city, openWeather){
    openWeather.getCurrentWeather(city, function(error, data){
        fillWidget(error, data, openWeather);
    })
}

function fillWidget(error, data, openWeather){
        function getBackground(status) {
            $("#widgetTime").addClass("text-white");
        
            if (backgroundMap[status]) {
                $("#wrapper-bg").css("background-image", `url('${backgroundMap[status]}')`);
            } else {
                $("#wrapper-bg").css("background-image", "url('https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif')");
            }
    
            if (imageMap[status]) {
                $("#imgStatus").attr("src", "./assets/img/" + imageMap[status]);
            } else {
                $("#imgStatus").attr("src", "./assets/img/");
            }
    
            var keyFormat = status.toUpperCase();
            $("#widgetWeather").attr("key", keyFormat).addClass("lang")
        };
    
    if (data) {
        $("#widgetCity").text(data.name + ", " + data.sys.country);
        $("#widgetWeather").text(data.weather[0].main);
        $("#widgetTemperature").text(Math.round(data.main.temp)+"°");
        $("#widgetPressure").text(data.main.pressure);
        $("#widgetHumidity").text(data.main.humidity);
        $("#widgetWind").text(data.wind.speed);
        getBackground(data.weather[0].main);
        openWeather.getPredictionWeather(data.coord.lon, data.coord.lat, function(listData){
            fillWidgetBody(listData);
        })
        $("#widgetTime").removeClass("d-none");

    }else{
        showToast("OpenWeatherAPI: " + error);
    }
    
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
        const uppercaseWeekdays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        
        
        for (index = 0; index < listData.list.length; index++) {
            $("#widgetTime"+index).text(Math.round(listData.list[index].main.temp)+"°");

            const newDateInt = formatDateToInt(listData.list[index].dt_txt);
            const [realDate, time] = getDateAndTime(listData.list[index].dt_txt);

            $("#widgetToday" + index + "Tmp").text(time);

            if (newDateInt > currentDate || index == listData.list.length - 1) {
                const dayIndex = (index === listData.list.length - 1) 
                                    ? realDate.getDay() 
                                    : (realDate.getDay() - 1 + 7) % 7;
                const targetElement = $("#widgetDay" + indexFilled + "Date");
                targetElement.attr("key", uppercaseWeekdays[dayIndex]);
                targetElement.addClass("lang");

                $("#widgetDay" + indexFilled + "Temp").text(Math.round(avgWeather / numOfPredsPerDay) + "°");
                indexFilled += 1;
                avgWeather = 0;
                numOfPredsPerDay = 0;
                currentDate = newDateInt;
            }

            avgWeather += listData.list[index].main.temp;
            numOfPredsPerDay += 1
        }
        window.reloadTranslations();
    }
}

function showToast(message) {
    var toastHTML = `
    <div class="toast custom-alert" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="2000">
    <a class="btn" data-bs-dismiss="toast" aria-label="Close">
                <i class="bi bi-x-circle-fill"></i>
            </a>
        <div class="toast-body">
            <strong class="me-auto">Error: </strong>
            ${message}
            
        </div>
    </div>`;




    $('#toastContainer').append(toastHTML);
    var toast = $('.toast').last();

    toast.on('hidden.bs.toast', function () {
        $(this).remove();
    });

    toast.toast('show');
}

$(function() {
    var autocompleteApi = new LocationIq();
    var openWeather = new OpenWeather();
    var canMakeRequest = true;
    var isEnglish = true;

    $('#menuBtn').on('click', function() {
        var classes = $('#sidebar').attr("class");
        if (classes) {
            var classList = classes.split(/\s+/);
            console.log(classList);
            classList.forEach(element => {
                if (element == "d-none"){
                    $('#sidebar').removeClass(element);

                    //TODO: make sass for #f6f8fa and simplify this
                    $('body').removeClass("bg-white"); 
                    $('body').css('background-color', '#f6f8fa'); 
                }
            });
        }
    });

    $('#sidebarHide').on('click', function(){
        $('#sidebar').addClass("d-none");
        $('body').addClass("bg-white"); 
    });

    $('#searchInput').on('focus', function() {
        $(this).addClass("no-bottom-radius");
        $('#span-search-icon').addClass("no-bottom-radius");
        $('#useLocation').removeClass("d-none");
    });

    $('#searchInput').on('blur', function() {
        setTimeout(function(){
            $(this).removeClass("no-bottom-radius");
            $('#span-search-icon').removeClass("no-bottom-radius");
            $('#useLocation').addClass("d-none");
        }, 200);
        
    });
    

    $('#searchInput').on('input', function() {
        if (!canMakeRequest) {
            return;
        }

        var inputValue = $(this).val();
        if (inputValue.length < 2) {
            $(".apiGeneratedDiv").remove();
        }

        if(inputValue.length >= 2){
            canMakeRequest = false;

            setTimeout(function() {
                canMakeRequest = true
                autocompleteApi.param = inputValue;
                autocompleteApi.getListOfMatches(function(error, data){
                    if (data) {
                        $('#span-location-icon').addClass("starighten-borders");
                        $('#currentLocationP').addClass("starighten-borders");
                        console.log(data);
                        $(".apiGeneratedDiv").remove();
                        for (let index = 0; index < data.length; index++) {
                            var content = "";
                            if (index == data.length - 1) {
                                content = `<div class="apiGeneratedDiv d-flex flex-column">
                                <p class="form-control outline-none m-0 brx-0 disable-top-border apiGenerated" aria-describedby="span-location-icon">
                                    ${data[index].address.name + ", " +  data[index].address.state + ", " + data[index].address.country + ", " + data[index].address.country_code}
                                </p>
                                </div>`;
                            }else{
                                content = `<div class="apiGeneratedDiv d-flex flex-column">
                                <p class="form-control outline-none m-0 brx-0 disable-top-border starighten-borders apiGenerated" aria-describedby="span-location-icon">
                                ${data[index].address.name + ", " +  data[index].address.state + ", " + data[index].address.country + ", " + data[index].address.country_code}
                                </p>
                                </div>`;
                            }
                                
                            console.log(data[index].display_name);
    
                            $("#useLocation").append(content);
                            
                        }
                    }else{
                        showToast("Autocomplete(LocationIQ api): " + error);
                        $('#span-location-icon').removeClass("starighten-borders");
                        $('#currentLocationP').removeClass("starighten-borders");
                    }
                });
            }, 200); 
        }
    });

    $('#currentLocationP').on('click', function(){
        getLocation(openWeather);
    });

    $(document).on('click', '.apiGenerated', function() {
       var autoComplete = $(this).text();
       var autoCompleteNoWhiteSpace = $.trim(autoComplete);
       var autoCompletionArray = autoCompleteNoWhiteSpace.split(",");
       console.log(autoCompletionArray[0]);
       $("#searchInput").val(autoCompletionArray[0]);
       getWeatherDataFromParam(autoCompletionArray[0], openWeather);
    });
     
    $('#currentLocationP').hover(function(){
        $(this).css('cursor','pointer');
        $('#currentLocationP').addClass('bg-shaygrade'); 
        $('#span-location-icon').addClass('bg-shaygrade'); 
    }, function(){
        $(this).css('cursor','auto');
        $('#currentLocationP').css('background-color', '#ffff'); 
        $('#currentLocationP').removeClass('bg-shaygrade'); 
        $('#span-location-icon').removeClass('bg-shaygrade'); 
    });
    
});