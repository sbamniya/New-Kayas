app.controller('barctrl',function($scope,$ionicPlatform,$cordovaBarcodeScanner){


$scope.scan=function()

{

 document.addEventListener("deviceready", function () {


    $cordovaBarcodeScanner

     .scan()

     .then(function(barcodeData) {

       // Success! Barcode data is here

       alert(JSON.stringify(barcodeData));

     }, function(error) {

       // An error occurred

     });



    // NOTE: encoding not functioning yet

    $cordovaBarcodeScanner

     .encode(BarcodeScanner.Encode.TEXT_TYPE, "http://www.ampersandacademy.com")

     .then(function(success) {

       // Success!

       alert(JSON.stringify(success));

     }, function(error) {

       // An error occurred

     });


 }, false);

}


})