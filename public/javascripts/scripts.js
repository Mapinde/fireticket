$(function () {
    $('#datetimepicker7').datetimepicker({
        format: 'DD/MM/YYYY HH:mm',
        outclose: true
    });
    $('#datetimepicker8').datetimepicker({
        useCurrent: false,
        format: 'DD/MM/YYYY HH:mm'
    });
    $("#datetimepicker7").on("change.datetimepicker", function (e) {
        $('#datetimepicker8').datetimepicker('minDate', e.date);
    });
    $("#datetimepicker8").on("change.datetimepicker", function (e) {
        $('#datetimepicker7').datetimepicker('maxDate', e.date);
    });

    // Hide and show price and quantity
    // Bilhete Crianca
    $("#kidPrice").hide();
    $("#kidQuantity").hide();
    $("#kidCheck").click(function() {
        if($(this).is(":checked")) {
            $("#kidPrice").show();
            $("#kidQuantity").show();
        } else {
            $("#kidPrice").hide();
            $("#kidQuantity").hide();
        }
    });

    // Bilhete Adultos
    $("#adultPrice").hide();
    $("#adultQuantity").hide();
    $("#adultCheck").click(function() {
        if($(this).is(":checked")) {
            $("#adultPrice").show();
            $("#adultQuantity").show();
        } else {
            $("#adultPrice").hide();
            $("#adultQuantity").hide();
        }
    });

    // Bilhete Promocional
    $("#promoPrice").hide();
    $("#promoQuantity").hide();
    $("#promoCode").hide();
    $("#promoCheck").click(function() {
        if($(this).is(":checked")) {
            $("#promoPrice").show();
            $("#promoQuantity").show();
            $("#promoCode").show();
        } else {
            $("#promoPrice").hide();
            $("#promoQuantity").hide();
            $("#promoCode").hide();
        }
    });

    // Bilhete Normal
    $("#normalPrice").hide();
    $("#normalQuantity").hide();
    $("#normalCheck").click(function() {
        if($(this).is(":checked")) {
            $("#normalPrice").show();
            $("#normalQuantity").show();
        } else {
            $("#normalPrice").hide();
            $("#normalQuantity").hide();
        }
    });

    // Bilhete VIP
    $("#vipPrice").hide();
    $("#vipQuantity").hide();
    $("#vipCheck").click(function() {
        if($(this).is(":checked")) {
            $("#vipPrice").show();
            $("#vipQuantity").show();
        } else {
            $("#vipPrice").hide();
            $("#vipQuantity").hide();
        }
    });

    // Bilhete Free
    $("#freeQuantity").hide();
    $("#freeCheck").click(function() {
        if($(this).is(":checked")) {
            $("#freeQuantity").show();

        } else {
            $("#freeQuantity").hide();

        }
    });
});

$(document).ready(function() {
    $('#example').DataTable();
});

