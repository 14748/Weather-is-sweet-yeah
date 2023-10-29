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