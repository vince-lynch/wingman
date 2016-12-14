angular.module('liveguardManager').factory('WebsitesService', ['$resource', function($resource) {
	return {
        listwebsites    :  $resource('https://live-guard.co.uk/manager/api/listwebsites/'),
    	removewebsite   : $resource('https://live-guard.co.uk/manager/api/removewebsite/')
    }
}]);