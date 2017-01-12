app.controller('SettingsCtrl', function($scope, $ionicLoading, $compile, $cordovaGeolocation, $ionicPlatform, $ionicSideMenuDelegate) {
  
    console.log("settings page");
      
      $scope.login = function(){
      	AWS.config.region = 'us-east-1';
   var cognitoidentity = new AWS.CognitoIdentity();
 
   var params = {
     AccountId: 'xxxxxxxxx', // required
     IdentityPoolId: 'us-east-1:xxxxxxxxxxxxxxxxxxxxx', // required
   };
 
   cognitoidentity.getId(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     {
       var params = {
         IdentityId: data.IdentityId, // required
       };
       cognitoidentity.getOpenIdToken(params, function(err, e_data) {
         if (err) console.log(err, err.stack); // an error occurred
         else     {
 
          var params = {
            RoleArn: 'arn:aws:iam::xxxxxxxxxx:role/role_created_for_cognito', // required
            RoleSessionName: 'userId', // required
            WebIdentityToken: e_data.Token, // required
            DurationSeconds: 950,
            ProviderId: 'cognito-identity.amazonaws.com'
          };
 
          var sts = new AWS.STS();
 
          sts.assumeRoleWithWebIdentity(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          });
 
      
         }         // successful response
       });
     }          // successful response
 })
}
   
})