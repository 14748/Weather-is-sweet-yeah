$(document).ready(function() {
    var arrLang = {
        "en-gb": {
            "INDEX": "Time",
            "CONTACT": "Contact Us",
            "SEARCH": "Search",
            "NAME": "Your Name",
            "EMAIL": "Your Email",
            "MESSAGE": "Your Message",
            "CONTACTBUTTON": "Send Message",
            "CURRLOCATION": "Use Current Location",
            "HUMIDITY": "Humidity",
            "PRESSURE": "Pressure",
            "WIND": "Wind",
            "MONDAY": "Monday",
            "TUESDAY": "Tuesday",
            "WEDNESDAY": "Wednesday",
            "THURSDAY": "Thursday",
            "FRIDAY": "Friday",
            "SATURDAY": "Saturday",
            "SUNDAY": "Sunday",
            "SNOW": "Snow",
            "CLOUDS": "Clouds",
            "MIST": "Mist",
            "RAIN": "Rain",
            "Drizzle": "Drizzle",
            "CLEAR": "Clear Sky",
            "THUNDERSTORM": "Thunderstorm",
            "SMOKE": "Smoke",
            "HAZE": "Haze",
            "DUST": "Dust",
            "FOG": "Fog",
            "SAND": "Sand",
            "SQUALL": "Squall",
            "TORNADO": "Tornado",
            "DRIZZLE": "Shower Rain"
            
        },
        "es-es": {
            "INDEX": "Tiempo",
            "CONTACT": "Contacto",
            "SEARCH": "Buscar",
            "NAME": "Nombre",
            "EMAIL": "Email",
            "MESSAGE": "Mensaje",
            "CONTACTBUTTON": "Enviar Mensaje",
            "CURRLOCATION": "Usar Localizacion Actual",
            "HUMIDITY": "Humedad",
            "PRESSURE": "Presion",
            "WIND": "Viento",
            "MONDAY": "Lunes",
            "TUESDAY": "Martes",
            "WEDNESDAY": "Miércoles",
            "THURSDAY": "Jueves",
            "FRIDAY": "Viernes",
            "SATURDAY": "Sábado",
            "SUNDAY": "Domingo",
            "SNOW": "Nieve",
            "CLOUDS": "Nublado",
            "MIST": "Niebla",
            "RAIN": "Lluvia",
            "Drizzle": "Lluvia ligera",
            "CLEAR": "Despejado",
            "THUNDERSTORM": "Tormenta",
            "SMOKE": "Humo",
            "HAZE": "Bruma",
            "DUST": "Polvo",
            "FOG": "Niebla",
            "SAND": "Arena",
            "SQUALL": "Chubasco",
            "TORNADO": "Tornado",
            "DRIZZLE": "Lluvia ligera"
        }
    };
    

    function applyLanguage(langKey) {
        $(".lang").each(function(index, element) {
            var key = $(this).attr("key");
            if (!arrLang[langKey] || !arrLang[langKey][key]) return;
    
            if ($(this).is("input") || $(this).is("textarea")) {
                $(this).attr("placeholder", arrLang[langKey][key]);
            } else if ($(this).is("a")) {
                if($(this).children().length > 0) {
                    var children = $(this).children().detach();
                    $(this).text(arrLang[langKey][key]);
                    $(this).prepend(children);
                } else {
                    $(this).text(arrLang[langKey][key]);
                }
            } else {
                if ($(this).children().length > 0) {

                    var children = $(this).children().detach();
                    $(this).text(arrLang[langKey][key]);
                    
                    $(this).append(children);
                } else {
                    $(this).text(arrLang[langKey][key]);
                }
            }
        });
    }
    
    

    function getCurrentLanguage() {
        var currentImg = $("#lang").attr("src");
        if (currentImg.includes("us.png")) {
            return "en-gb";
        } else if (currentImg.includes("esp.png")) {
            return "es-es";
        }
        return null;
    }

    function setStoredLanguage(langKey) {
        localStorage.setItem("currentLang", langKey);
    }
    
    function getStoredLanguage() {
        return localStorage.getItem("currentLang");
    }
    

    
    $("#langHolder").on('click', function() {
        var currentLang = getCurrentLanguage();
        var newLang, newImg;

        if (currentLang === "en-gb") {
            newLang = "es-es";
            newImg = "esp.png";
        } else {
            newLang = "en-gb";
            newImg = "us.png";
        }

        $("#lang").attr("src", "./assets/img/" + newImg);
        applyLanguage(newLang);
        
        setStoredLanguage(newLang);
    });

    function applyInitialLanguage() {
        var storedLang = getStoredLanguage();
        
        if(storedLang) {
            applyLanguage(storedLang);
            var newImg = storedLang === "en-gb" ? "us.png" : "esp.png";
            $("#lang").attr("src", "./assets/img/" + newImg);
        } else {
            applyLanguage(getCurrentLanguage());
        }
    }

    function reloadTranslations() {
        applyLanguage(getCurrentLanguage());
    }
    
    window.reloadTranslations = reloadTranslations;

    applyLanguage(getCurrentLanguage());
});
