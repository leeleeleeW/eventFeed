angular.module('app', [])
.controller('eventFeedController', function($scope, $http) {
$scope.events = [];
$scope.newEvent = {};
$scope.priorityCounts = { low: 0, normal: 0, high: 0 };



$scope.submitEvent = function() {
  if (!$scope.newEvent.type || !$scope.newEvent.message || !$scope.newEvent.priority) {
    $scope.errorMessage = 'All fields are required.';
    return;
  }
  $http.post('/events', $scope.newEvent).then(function() {
    $scope.newEvent = {};
    $scope.errorMessage = '';
  }, function(error) {
    if (error.status === 429) {
      $scope.errorMessage = 'Buffer full of high-priority events. Cannot add new event.';
    } else {
      $scope.errorMessage = 'Error submitting event: ' + (error.data.error || error.statusText);
    }
  });
};

$http.get('/events').then(function(response) {
  $scope.events = response.data;
  console.log('Events loaded:', $scope.events);
}, function(error) {
  console.error('Error loading events:', error);
  $scope.errorMessage = 'Failed to load events.';
});

var eventSource = new EventSource('/events/stream');
eventSource.onmessage = function(event) {
  var data = JSON.parse(event.data);
  console.log('New event received:', data);
  $scope.$apply(function() {
    $scope.events.unshift(data);
  });
};

eventSource.onerror = function(error) {
  console.error('EventSource error:', error);
};

$scope.$watch('events', function() {
  $scope.priorityCounts = { low: 0, normal: 0, high: 0 };
  if ($scope.events && $scope.events.length > 0) {
    $scope.events.forEach(function(event) {
      if (event.priority) {
        $scope.priorityCounts[event.priority]++;
      }
    });
  }
  console.log('Counts updated:', $scope.priorityCounts);
}, true);
});