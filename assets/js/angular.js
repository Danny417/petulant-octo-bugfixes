var app = angular.module('app', []);
app.controller('nodeCtrl', function($scope, $log, $http) {
	$scope.nodeList = [];
$scope.sets = [];
$scope.node = {};
$scope.selectNode = "Select Node";
$scope.logs = [];
$scope.selectingNode = function(name) {
  $scope.selectNode = name;
};
$scope.runTest = function() {
  $scope.logs = [];
  var actions = [],
	  action;
  angular.forEach(angular.element('#sortable li'), function(value, key) {
	action = {hostname:$scope.selectNode};
	action.name = angular.element(value).attr('name');
	angular.forEach(angular.element(value).children('input'), function(value, key) {
	  action[angular.element(value).attr('name')] = angular.element(value).val();
	});
	actions.push(action);
  });
  $http.post('/testAction', actions).
	success(function(data, status) {
	  $log.debug(data);
	}).
	error(function(data, status) {
	  $log.debug(data);
	});
};
$scope.showUpload = function() {
  angular.element("#upload").modal('show');
};
$scope.shutdown = function(key) {
  $http.post('/shutdown', {node: key}).
	success(function(data, status) {
	  $log.debug(data);
	}).
	error(function(data, status) {
	  $log.debug(data);
	});
};
$scope.filterBySet = function(set) {
  var result = {};
  angular.forEach(set, function(hostname) {
	var value = $scope.nodeList[hostname];
	if ( hostname !== "" && (
	  $scope.searchText == null ||
	  $scope.searchText === '' ||
	  (!!value.ip && value.ip.indexOf($scope.searchText) > -1) ||
				(!!value.hostname && value.hostname.indexOf($scope.searchText) > -1))) {
					result[hostname] = value;
			}
  });
  return result;
};
	$scope.filterByText = function(items) {
		if($scope.searchText == null || $scope.searchText === '') return items;
		var result = {};
		angular.forEach(items, function(value, key) {
			if ((!!value.ip && value.ip.indexOf($scope.searchText) > -1) ||
						(!!value.hostname && value.hostname.indexOf($scope.searchText) > -1)) {
					result[key] = value;
			}
		});
		return result;
	};
$scope.hexDecode = function(str){
  return str.match(/.{1,2}/g).map(function(v){
	return String.fromCharCode(parseInt(v, 16));
  }).join('');
}
$scope.hexEncode = function(str){
	var hex = "",
		i;
	for (i=0; i<str.length; i++) {
		hex += str.charCodeAt(i).toString(16);
	}
	return hex;
}
$scope.thisKVStore = function(node) {
  if(!node || !node.kvstore) return {};
  var result = {};
  for(var i = 0; i < node.kvstore.length; i++) {
	if(!node.kvstore[i].status || node.kvstore[i].hostname === '127.0.0.1'
	  || node.kvstore[i].hostname === node.hostname || node.kvstore[i].hostname === node.ip) {
	  for(var key in node.kvstore[i].kvstore) {
		result[key] = node.kvstore[i].kvstore[key];
	  }
	}
  }
  return result;
};
$scope.showDetail = function(key) {
  angular.element(".modal-title").text(key);
  $scope.node = key;
  angular.element("#detail").modal('show');
};
$scope.showLog = function(key) {
  angular.element(".modal-title").text(key);
  $scope.node = key;
  angular.element("#log").modal('show');
}
});