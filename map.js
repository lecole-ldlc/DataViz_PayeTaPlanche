var URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQny4aobPl0WBH4qnx8jQSmaBQp_hpldR998M9Ojkf_t2TFGHkkhH-zt3hhnpH65RV8QNDSPZC5YpFd/pub?gid=879140185&single=true&output=csv'
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};

var all_options = {};
var color_scale = d3.scaleOrdinal(d3.schemeCategory20);

var star0 = '<div class="stars"><span class="star"></span><span class="star"></span><span class="star"></span><span class="star"></span><span class="star"></span></div>';
var star05 ='<div class="stars"><span class="star half"></span><span class="star"></span><span class="star"></span><span class="star"></span><span class="star"></span></div>';
var star1 ='<div class="stars"><span class="star on"></span><span class="star"></span><span class="star"></span><span class="star"></span><span class="star"></span></div>';
var star15 ='<div class="stars"><span class="star on"></span><span class="star half"></span><span class="star"></span><span class="star"></span><span class="star"></span></div>';
var star2 ='<div class="stars"><span class="star on"></span><span class="star on"></span><span class="star"></span><span class="star"></span><span class="star"></span></div>';
var star25 ='<div class="stars"><span class="star on"></span><span class="star on"></span><span class="star half"></span><span class="star"></span><span class="star"></span></div>';
var star3 ='<div class="stars"><span class="star on"></span><span class="star on"></span><span class="star on"></span><span class="star"></span><span class="star"></span></div>';
var star35 ='<div class="stars"><span class="star on"></span><span class="star on"></span><span class="star on"></span><span class="star half"></span><span class="star"></span></div>';
var star4 ='<div class="stars"><span class="star on"></span><span class="star on"></span><span class="star on"></span><span class="star on"></span><span class="star"></span></div>';
var star45 ='<div class="stars"><span class="star on"></span><span class="star on"></span><span class="star on"></span><span class="star on"></span><span class="star half"></span></div>';
var star5 ='<div class="stars"><span class="star on"></span><span class="star on"></span><span class="star on"></span><span class="star on"></span><span class="star on"></span></div>';

var prix1 ='<i class="fas fa-euro-sign"></i>';
var prix2 ='<i class="fas fa-euro-sign"></i><i class="fas fa-euro-sign"></i>';
var prix3 ='<i class="fas fa-euro-sign"></i><i class="fas fa-euro-sign"></i><i class="fas fa-euro-sign"></i>';
var prix4 ='<i class="fas fa-euro-sign"></i><i class="fas fa-euro-sign"></i><i class="fas fa-euro-sign"></i><i class="fas fa-euro-sign"></i>';

d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};
d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};


d3.csv(URL, function (error, data) {
    //1. load data and throw error if there is one
    if (error) throw error;

    //2. define reset and draw functions

    //default to location - declare variables, reset_data and draw charts
    var label = {type: "Type de Bars", arrond: "Arrondissement", prixyelp: "Prix", noteyelp: "Note Yelp", valide:"Testé par PtP"};
    var label_classes = {type: "primary", arrond: "warning", prixyelp: "danger", noteyelp: "success", valide: "dark"};
    var search_opt = ['type', 'arrond', 'prixyelp', 'noteyelp', 'valide'];
    var options_list = [];

    data.columns.forEach(function (c) {
        all_options[c] = [];
    });

    options_list = {};
    search_opt.forEach(function (d) {
        options_list[d] = d3.nest()
            .key(function (a) {
                return a[d];
            })
            .entries(data)
            .map(function (a) {
                return a.key
            });
        options_list[d].sort()
    });
    console.log(options_list);

    function draw_list(search_opt) {


        search_opt.forEach(function (o, i) {
            var titleListe = '<div class="card">';
            titleListe += '<div class="card-header" role="tab" id="heading' + i + '">';
            titleListe += '<h5 class="mb-0">';
            titleListe += '<a class="collapsed" data-toggle="collapse" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">' + label[o] + '</a> <a href="#" class="colorize" data-filter="' + o + '"><i class="fas fa-paint-brush float-right"></i></a></h5></div>';
            titleListe += '<div id="collapse' + i + '" class="collapse';
            if (i === 0) {
                titleListe += ' show'
            }
            titleListe += '" role="tabpanel" aria-labelledby="heading' + i + '" data-parent="#accordion">';
            titleListe += '<div id="contentlist' + i + '" class="card-body card-right"></div></div></div>';
            $("#accordion").append(titleListe);

            all_options[o].sort();

            var radio_string = "";
            for (var j = 0; j < options_list[o].length; j++) {
                radio_string += "<label class='custom-control custom-checkbox' for='" + options_list[o][j] + "'><input type='checkbox' class='custom-control-input' id='" + options_list[o][j];
                radio_string += "' name='" + o + "' value='" + options_list[o][j];
                radio_string += "'><span class='custom-control-indicator'></span><span class='custom-control-description'>" + options_list[o][j];
                radio_string += "</span></label><br>";
            }
            var contentlist = '#contentlist' + i;
            $(contentlist).html(radio_string);
            //set the on_change event to redraw charts whenever a checkbox option is selected
            $('input[name="' + o + '"]').change(function () {
                console.log($(this));
                var name = $(this)[0].name;
                var option = $(this)[0].value;

                if (all_options[name].contains(option)) {
                    // Supprimer du filtre
                    var index = all_options[name].indexOf(option);
                    all_options[name].splice(index, 1);
                } else {
                    all_options[name].push(option);
                }

                selectedBars();
            });

            $(".colorize").click(function (e) {
                var key = $(this).attr("data-filter");
                colorizeBars(key);
            });

        });


    }


    function check_length(my_val, len_no) {

        //ensures a string is only as long as len_no and adds .. after to
        //indicate string has been cropped
        if (my_val.length > len_no) {
            my_val = my_val.slice(0, len_no) + ".."
        }
        return my_val;
    }


    function draw_charts() {
        //draws the charts (functions in effective_plots.js)
        draw_list(search_opt, options_list);

    }


    //reset_data();
    draw_charts();
    new_draw_map(data, options_list, search_opt);


    function apply_filters(data, search_opt, filter_by) {
        //used by both bars, line and donut
        //filters the data by values in filter_by if a filtering list exists

        if (filter_by === undefined) {
            filter_by = []
        }

        var my_data;

        if (filter_by.length > 0) {
            my_data = data.filter(function (d) {
                d[search_opt] = check_length(d[search_opt], 20);
                return filter_by.indexOf(d[search_opt]) > -1;
            });
        } else {
            my_data = data;
        }
        return my_data;

    }


    function new_draw_map(data, options_list, search_opt, filter_by) {

        //1. Set the list title
        //document.getElementById('map_title').innerHTML = "Map for selected " + search_opt.toUpperCase();

        //2. Apply filters
        my_data = apply_filters(data, search_opt, filter_by);

        var bound = new google.maps.LatLngBounds();
        for (m in my_data) {
            long = +my_data[m].longitude;
            lat = +my_data[m].latitude;
            if (isNaN(my_data[m].longitude)) {
                my_data.splice(m, 1)
            } else {
                bound.extend(new google.maps.LatLng(lat, long));
            }
        }
        var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        d3.selectAll('#map')
            .attr("width", width - 200);

        // Create the Google Map w/o poi
        var map = new google.maps.Map(d3.select("#map").node(), {
            zoom: 14,
            center: new google.maps.LatLng(45.7642037, 4.8376517),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [
                {featureType: 'poi', stylers: [{visibility: "off"}]}]
        });


        //map.fitBounds(bound);

        var overlay = new google.maps.OverlayView();

        // Add the container when the overlay is added to the map.
        overlay.onAdd = function () {
            var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
                .attr("class", "effective");

            // Draw each marker as a separate SVG element.
            // We could use a single SVG, but what size would it have?
            overlay.draw = function () {
                var projection = this.getProjection(),
                    padding = 5;


                var tooltip = d3.select("body")
                    .append("div")
                    .attr("class", "tooltip_map")
                    .html("");

                var marker = layer.selectAll("svg")
                    .data(my_data)
                    .each(transform) // update existing markers
                    .enter().append("svg")
                    .each(transform)
                    .attr("class", "marker")
                    .attr("data-animation", "jump");


                // Add a circle.
                marker.append("circle")
                    .attr("r", 7)
                    .attr("cx", padding + 5)
                    .attr("cy", padding + 5)
                    .style("stroke", "none")
                    .on("mouseover", function (d) {
                        //sets tooltip.  t_text = content in html
                        tooltip.style("visibility", "hidden");
                        t_text = d.nom ;
                        tooltip.html(t_text);
                        d3.select(this).style("cursor", "pointer");
                        tooltip.style("visibility", "visible");
                        tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
                    })
                    .on("mousemove", function () {

                    })
                    .on("mouseout", function () {
                        tooltip.style("visibility", "hidden");
                        d3.select(this).style("cursor", "default");


                    })
                    .on("click", function (d) {

                        var infos = '<h4 class="card-title" data-animation="flip">'+ d.nom +'</h4>';
                        infos += '<h6 class="card-subtitle mb-2 text-muted">'+ d.type +'</h6>';
                        if (d.noteyelp === "non renseigné"){
                            infos += 'Pas de note</br>'
                        }else if (d.noteyelp === "0"){
                            infos += star0
                        }else if (d.noteyelp === "0,5"){
                            infos += star05
                        }else if (d.noteyelp === "1"){
                            infos += star1
                        }else if (d.noteyelp === "1,5"){
                            infos += star15
                        }else if (d.noteyelp === "2"){
                            infos += star2
                        }else if (d.noteyelp === "2,5"){
                            infos += star25
                        }else if (d.noteyelp === "3"){
                            infos += star3
                        }else if (d.noteyelp === "3,5"){
                            infos += star35
                        }else if (d.noteyelp === "4"){
                            infos += star4
                        }else if (d.noteyelp === "4,5"){
                            infos += star45
                        }else if (d.noteyelp === "5"){
                            infos += star5
                        }
                        if (d.prixyelp === "€"){
                            infos += prix1 
                        }else if (d.prixyelp === "€€"){
                            infos += prix2 
                        }else if (d.prixyelp === "€€€"){
                            infos += prix3 
                        }else if (d.prixyelp === "€€€€"){
                            infos += prix4 
                        }else {
                            infos += "Aucun Prix renseigné"
                        }
                        if (d.wifi === "Oui"){
                            infos += '&nbsp;&nbsp;<i class="fas fa-wifi" title="Wifi"></i>';
                        }else{
                            infos += '&nbsp;&nbsp;Pas de Wifi'
                        }
                        infos += '<p class="card-text">'+ d.adresse + '</p>';
                        infos += '<a target="_blank" href="https://www.google.fr/maps/place/' + d.adresse + '" class="card-link">Voir sur Maps</a>';





                        if (d.blog !== ""){
                            infos += '<a target="_blank" href="'+ d.blog +'" class="card-link">Article du Blog</a>';
                        }

                        $('#infosBar').html(infos)


                    });

                function transform(d) {
                    d = new google.maps.LatLng(+d.latitude, +d.longitude);
                    d = projection.fromLatLngToDivPixel(d);
                    return d3.select(this)
                        .style("left", (d.x - padding) + "px")
                        .style("top", (d.y - padding) + "px");
                }
            };
        };

        // Bind our overlay to the map
        overlay.setMap(map);


    }


    function selectedBars() {


        var nnofilter = 0;
        var ncrit = 0;
        var filters = [];
        $.each(all_options, function (k, v) {
            if (all_options[k].length === 0) {
                nnofilter += 1;
            } else {
                filters.push({list: all_options[k], key: k});
            }
            ncrit += 1;
        });
        console.log(filters);
        var nfilter = ncrit - nnofilter;
        console.log(ncrit, nnofilter, nfilter);
        if (nfilter === 0) {
            $("#filterList").html('Aucun filtre sélectionné');
        } else {
            var fstring = "";
            filters.forEach(function (e) {
                e.list.forEach(function (e2) {
                    fstring += '<span class="badge badge-' + label_classes[e.key] + ' filter_label" data-name="' + e.key + '" data-option="' + e2 + '">' + e2 + ' <i class="fas fa-times"></i> </span>';
                })

            });

            $("#filterList").html(fstring);
            $(".filter_label").click(function (){
                var name = $(this).attr("data-name");
                var option = $(this).attr("data-option");
                console.log(name, option);
                removeFilter(name, option);
                $('input[id="'+option+'"]').prop('checked', false);
            });
        }

        d3.selectAll("circle")
            .each(function (d) {
                var self = this;
                //console.log(d);
                if (nfilter === 0) {
                    d3.select(self).transition().duration(1000).attr("r", 6);
                } else {
                    var nmatch = 0;
                    $.each(all_options, function (k) {
                        if (all_options[k].contains(d[k])) {
                            nmatch += 1;
                        }
                    });
                    if (nmatch === nfilter) {
                        d3.select(self).transition().duration(1000).attr("r", 10);
                    } else if (nmatch === 1) {
                        d3.select(self).transition().duration(1000).attr("r", 2);
                    } else {
                        d3.select(self).transition().duration(1000).attr("r", 2);
                    }
                }
            });

        d3.selectAll("marker")
            .each(function (d) {
                var self = this;
                //console.log(d);
                if (nfilter === 0) {

                } else {
                    var nmatch = 0;
                    $.each(all_options, function (k) {
                        if (all_options[k].contains(d[k])) {
                            nmatch += 1;
                        }
                    });
                    if (nmatch === nfilter) {
                        d3.select(this).moveToFront();
                    } else if (nmatch === 1) {
                    } else {
                        d3.select(this).moveToBack();
                    }
                }
            });

    }

    function removeFilter(name, option) {

        if (all_options[name].contains(option)) {
            // Supprimer du filtre
            var index = all_options[name].indexOf(option);
            all_options[name].splice(index, 1);
        } else {
            all_options[name].push(option);
        }

        selectedBars();
    }

    function colorizeBars(key) {

        d3.selectAll("circle")
            .each(function (d) {
                var self = this;
                d3.select(self).transition().duration(1000).style("fill", color_scale(d[key]));
            });
        $('#legend').html("");
        console.log(options_list[key].length);
        for (var o=0; o < options_list[key].length; o++){
            console.log(options_list[key][o]);
            $('#legend').append('<span class="badge badge-color" style="background-color:' + color_scale(options_list[key][o]) + ';">' + options_list[key][o] + ' </span></br>');

        }
    }


});

function snow() {
    $('.snowflake').html('*')
}
function iddqd() {
    $('.snowflake').html('<img src="http://i.imgur.com/vxt873m.png" height="42" width="42">')
}
