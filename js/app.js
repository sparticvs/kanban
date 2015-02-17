(function(){

    var app = angular.module("kanban", ['ngDragDrop']);

    app.controller("TaskController", function($scope) {

        $scope.dirty_array = false;

        if(localStorage["categories"] !== undefined) {
            $scope.categories = angular.fromJson(localStorage["categories"]);
        } else {
            $scope.categories = [
                {category: "Backlog", state: "backlog", max: -1, class: "list-group-item-info", showfilter: true},
                {category: "On Deck", state: "ondeck", max: -1, class: "list-group-item-danger", showfilter: false},
                {category: "In Progress", state: "wip", max: 3, class: "list-group-item-warning", showfilter: false},
                {category: "Done", state: "done", max: -1, class: "list-group-item-success", showfilter: false}
            ];
        }

        if(localStorage["tasks"] !== undefined) {
            $scope.tasks = angular.fromJson(localStorage["tasks"]);
        } else {
            $scope.tasks = [
                {task: "Add Data Persistence", state: "backlog"},
                {task: "Take a screenshot", state: "ondeck"},
                {task: "Push to GitHub", state: "wip"},
                {task: "Build かん", state: "done"}
            ];
        }

        $scope.doSave = function() {
            if(!$scope.dirty_array) {
                return;
            }

            var tasks = $scope.tasks.filter(function(el) {
                return el.state !== "deleted";
            });

            localStorage.setItem("categories", angular.toJson($scope.categories));
            localStorage.setItem("tasks", angular.toJson(tasks));

            $scope.dirty_array = false;
        };

        $scope.buildExport = function() {
            var exp = {};
            exp.categories = $scope.categories;
            exp.tasks = $scope.tasks;

            return angular.toJson(exp);
        };

        $scope.doLoad = function() {
            $scope.tasks = angular.fromJson(localStorage["tasks"]);
            $scope.categories = angular.fromJson(localStorage["categories"]);
        };

        window.onbeforeunload = function(e) {
            var sc = angular.element($("body")).scope();
            sc.doSave();
        };

        window.setInterval(function() {
            var sc = angular.element($("body")).scope();
            sc.doSave();
        }, 2*60*1000);
       
        this.toggler = {};
        $scope.newTask = "";
        $scope.filename = "";

        $scope.toggleState = function(event, ui, category) {
            var filtered = $scope.tasks.filter(function(el) {
                return el.state === category.state;
            });
          
            if((filtered.length < category.max || category.max === -1)) {
                this.toggler.state = category.state;
            }

            var ndx = $scope.tasks.map(function(t) {return t.task;}).indexOf(this.toggler.task);
            $scope.tasks.push(this.toggler);
            $scope.tasks.splice(ndx, 1);
            $scope.dirty_array = true;
            this.toggler = {};
        };

        $scope.deleteTask = function(event, ui) {
            var ndx = $scope.tasks.map(function(t) {return t.task;}).indexOf(this.toggler.task);
            $scope.tasks.splice(ndx, 1);
            $scope.dirty_array = true;
            this.toggler = {};
        };

        $scope.addNewTask = function() {
            var taskObj = {};
            taskObj.task = $scope.newTask;
            taskObj.state = "backlog";
            $scope.newTask = "";
            $scope.tasks.push(taskObj);
            $scope.dirty_array = true;
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

        $scope.archiveTasks = function() {
            var stuff = confirm('Are you sure you want to archive everything?');
            if(stuff) {
                $scope.tasks.forEach(function(e, i, a) {
                    if(e.state === 'done') {
                        e.state = 'archive';
                    }
                });
                $scope.dirty_array = true;
            }
        };

        $scope.edit = function(cat, index) {
            var leader = "#"+cat+"_"+index;
            $(leader+"_text").toggleClass("hidden");
            $(leader+"_input").toggleClass("hidden");
            if(!$(leader+"_input").hasClass("hidden")) {
                $(leader+"_input").focus();
            } else {
                $scope.dirty_array = true;
            }
        };

        $scope.showAddLabelModal = function(task) {
            var taskObj = task;
            $('#addLabelBtn').on('click', function() {
                // Add the Label to the Task Object
            });

            $('#addLabelModal').modal('show');
        };

        $scope.garbage = function(task) {
            if(confirm('Delete this task?')) {
                task.state = "deleted";
                $scope.dirty_array = true;
            }
        };

        $scope.exportJson = function() {
            var data = "text/json;charset=utf-8,"+encodeURIComponent($scope.buildExport());
            $('<a href="data:' + data + '" download="data.json">Export</a>')[0].click();
        };

        $scope.importJson = function() {
            
        };

        $scope.inputHandler = function(e, cat, index) {
            switch(e.keyCode) {
                case 13:
                case 27:
                    $scope.edit(cat, index);
                    break;
            }
        };

    });

})();
