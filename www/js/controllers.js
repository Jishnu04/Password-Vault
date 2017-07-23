angular.module('PasswordLocker.controllers', [])

.controller('DashCtrl', function($scope,Document,$crypto) {

  $scope.resultpassword="";
  $scope.showpwd=false;

  $scope.$on("$ionicView.beforeEnter", function(event, data){
   $scope.$applyAsync(function () {
      Document.alltitle().then(function(documents){
        $scope.resultpassword="";
        $scope.showpwd=false;
        $scope.documents = documents;
      });
    });
  });

  $scope.Ac={
    'selectedId':"",
    'providedkey':""
   }

  $scope.doRetrieve =function(){
    Document.getById($scope.Ac.selectedId)
      .then(function(res){
          $scope.resultpassword = $crypto.decrypt(res.keyword, $scope.Ac.providedkey);
           if($scope.resultpassword=='')
            $scope.resultpassword="Wrong Key";

          $scope.Ac={
            'selectedId':"",
            'providedkey':""
          }
          $scope.showpwd=true;

      });
   }
  
  $scope.erasepwd=function(){
    $scope.resultpassword="";
    $scope.showpwd=false;
  }
})

.controller('AddCtrl', function($scope,Document,$crypto,$ionicPopup,$state) {

$scope.register ={'title':"",
                  'password':"",
                  'desc':"",
                  'rsecretkey':"",
                  'secretkey':""};

$scope.addAccount =function(){
  
  console.log($scope.register);

  if($scope.register.secretkey==$scope.register.rsecretkey)
  {
    var encrypted = $crypto.encrypt($scope.register.password, $scope.register.secretkey);

    Document.addOne($scope.register.title,encrypted,$scope.register.desc).then(function(documents){
        $scope.register ={'title':"",
                  'password':"",
                  'rsecretkey':"",
                  'secretkey':""};
             $ionicPopup.alert({
                    title: 'Account Added Successfully!',
                  });
             $state.go('tab.dash');

    });

  }
  else{
     $ionicPopup.alert({
     title: 'Key Mismatch!',
   });
  }

}

})


.controller('AccountCtrl', function($scope,Document,$ionicPopup,$crypto,$ionicModal,$timeout) {
  
  $scope.documents=[];
  
  $scope.$on("$ionicView.beforeEnter", function(event, data){
   $scope.$applyAsync(function () {
      Document.all().then(function(documents){
        $scope.documents = documents;
      });
    });
  });

    $scope.loginData={'key':"",
                      'pwd':"",
                      'removeId':""};
  $ionicModal.fromTemplateUrl('templates/help.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.helpmodal = modal;
  });


  $ionicModal.fromTemplateUrl('templates/authenicate.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.loginmodal = modal;
  });

  $scope.deleteAc =function(id){
                  Document.deleteOne(id).then(function(doc){
                      $scope.$applyAsync(function () {
                      $scope.documents.forEach(function(pt,index){
                          if(pt.IdKey==id){
                            $scope.documents.splice(index,1);
                          }
                        });
                      });
                      console.log("At Remove Ac:",doc);
                     $ionicPopup.alert({
                           title: 'Account Removed',
                         })
                          .then(function(){
                            $scope.closeLogin();
                          });
                       
                    });
  }

  $scope.openLogin = function(id){
        $scope.loginData.removeId=id;
       $timeout(function(){
          $scope.loginmodal.show();
        },0);
    }

  $scope.closeLogin = function() {
      $timeout(function(){
    $scope.loginmodal.hide();
},100);
}

  $scope.doLogin =function(callback){
          
          Document.getBytitle("Locker")
          .then(function(res){
            if(res.rows.length==0)
                $ionicPopup.alert({
                     title: 'Set Password for App (Refer Help) !',
                   });
            else{ 
              $scope.resultpwd = $crypto.decrypt(res.rows.item(0).keyword, $scope.loginData.key);
               if($scope.resultpwd==$scope.loginData.pwd){
                return callback($scope.loginData.removeId);
               }
              else{
              $ionicPopup.alert({
                     title: 'Wrong Input (Refer Help) !',
                   });

              }
            }
          });

  }
      
        
  });




