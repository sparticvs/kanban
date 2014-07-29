(function(){
    var app = angular.module("kanban", ['ngDragDrop']);

    app.controller("TaskController", function($scope) {

        $scope.categories = [
            {category: "Backlog", state: "backlog", max: -1, class: "list-group-item-info", },
            {category: "On Deck", state: "ondeck", max: -1, class: "list-group-item-danger"},
            {category: "In Progress", state: "wip", max: 3, class: "list-group-item-warning"},
            {category: "Done", state: "done", max: -1, class: "list-group-item-success"}
        ];

        $scope.tasks = [
            {task: "Add Data Persistence", state: "backlog"},
            {task: "Take a screenshot", state: "ondeck"},
            {task: "Push to GitHub", state: "wip"},
            {task: "Build かん", state: "done"}
        ];
       
        this.toggler = {};
        $scope.newTask = "";

        $scope.toggleState = function(event, ui, category) {
            var filtered = $scope.tasks.filter(function(el) {
                return el.state === category.state;
            });
            if(filtered.length < category.max || category.max === -1) {
                this.toggler.state = category.state;
            }

            var ndx = $scope.tasks.map(function(t) {return t.task;}).indexOf(this.toggler.task);
            $scope.tasks.push(this.toggler);
            $scope.tasks.splice(ndx, 1);
            this.toggler = {};
        };

        $scope.deleteTask = function(event, ui) {
            var ndx = $scope.tasks.map(function(t) {return t.task;}).indexOf(this.toggler.task);
            $scope.tasks.splice(ndx, 1);
            this.toggler = {};
        };

        $scope.addNewTask = function() {
            var taskObj = {};
            taskObj.task = $scope.newTask;
            taskObj.state = "backlog";
            $scope.newTask = "";
            $scope.tasks.push(taskObj);
        };

        $scope.acceptTask = function(el) {
            var i = 0;
            for(i = 0; i < $scope.categories.length; i++) {
                var filtered = $scope.tasks.filter(function(el) {
                    return el.state === $scope.categories[i].state;
                });
                if($scope.categories[i].max === -1) {
                    continue;
                } else if (filtered.length >= $scope.categories[i].max) {
                    return false;
                }
            }
            return true;
        };

    });

})();
