$(document).ready(function () {

    var socket = io();

    var opts = {
        angle: 0.15, // The span of the gauge arc
        lineWidth: 0.44, // The line thickness
        radiusScale: 1, // Relative radius
        pointer: {
            length: 0.6, // // Relative to gauge radius
            strokeWidth: 0.035, // The thickness
            color: '#000000' // Fill color
        },
        limitMax: true, // If false, max value increases automatically if value > maxValue
        limitMin: true, // If true, the min value of the gauge will be fixed
        colorStart: '#6FADCF', // Colors
        colorStop: '#8FC0DA', // just experiment with them
        strokeColor: '#E0E0E0', // to see which ones work best for you
        generateGradient: true,
        highDpiSupport: true, // High resolution support

    };
    var target = document.getElementById('can_volt'); // your canvas element
    var vgauge = new Gauge(target).setOptions(opts); // create sexy gauge!
    //vgauge.setTextField(document.getElementById("vgauge-value")); //*
    vgauge.maxValue = 5; // V set max gauge value
    vgauge.setMinValue(0); // Prefer setter over gauge.minValue = 0
    vgauge.animationSpeed = 32; // set animation speed (32 is default value)
    vgauge.set(0); // set actual value
/**/
    var target = document.getElementById('can_amp'); // your canvas element
    var agauge = new Gauge(target).setOptions(opts); // create sexy gauge!
    //agauge.setTextField(document.getElementById("agauge-value")); //*
    agauge.maxValue = 5; // max A
    agauge.setMinValue(0); // Prefer setter over gauge.minValue = 0
    agauge.animationSpeed = 32; // set animation speed (32 is default value)
    agauge.set(0); // set actual value

    socket.on('update', function (rjdata) {
        //console.log(rjdata);
        try {
            var jdata = JSON.parse(rjdata);
            vgauge.set(jdata.volage);
            agauge.set(jdata.current);
            $('#wat').text(jdata.power);
            
            $('#vgauge-value').html(jdata.volage.toString());   //*
            $('#agauge-value').html(jdata.current.toString());  //*
            
            console.info("V "+jdata.volage+"\nA "+jdata.current);
            
        } catch (err) {
            console.error(err);
            for (var i in rjdata) {
                //console.info(i + ": " + rjdata[i] + "\n");
            }
        }


    });

});