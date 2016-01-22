(function() {

	'use strict';

	angular
		.module('app', [])
		.controller('ListCtrl', ListCtrl)
		.controller('FormCtrl', FormCtrl)
		.factory('Data',Data);

	function FormCtrl(Data,$scope) {
		var vm = this;

		vm.form_data = {},
		vm.save = save;
		vm.cancel = cancel;

		$scope.$on('new_form_data',function(event,data) {
			vm.form_data = data;
		});

		$scope.$watch(angular.bind(vm.form_data,function() {
			vm.disable_save = true;

			if (vm.form_data.name && vm.form_data.band) {
				vm.disable_save = false;
			}

		}));

		function save() {
			Data.save(vm.form_data);
			vm.cancel();
		}

		function cancel() {
			vm.form_data = {};
		}
	}

	function ListCtrl(Data,$rootScope) {
		var vm = this;
		vm.musicians = Data.musicians;
		vm.edit = edit;
		vm.delete = deleteM;

		function edit(musician) {
			var form_data = Data.copy(musician);
			$rootScope.$broadcast('new_form_data',form_data);
		}

		function deleteM(musician) {
			var idx = Data.musicians.indexOf(musician);
			Data.musicians.splice(idx,1);
		}
	}

	function Data() {
		var service = {
			musicians: [{
				id: 1,
				name: 'Jimmy Page',
				band: 'Led Zeppelin'
			}, {
				id: 2,
				name: 'Geezer Butler',
				band: 'Black Sabbath'
			}, {
				id: 3,
				name: 'Tom Araya',
				band: 'Slayer'
			}, {
				id: 4,
				name: 'Robin Crosby',
				band: 'Ratt'
			}],
			copy: copy,
			save: save
		};

		return service;

		function copy(musician) {
			var idx = this.musicians.indexOf(musician);
			musician.idx = idx;
			return angular.copy(musician);
		}

		function save(musician) {
			if (musician.id) { // existing record so update the model
				var idx = musician.idx;
				service.musicians[idx] = musician;
			}
			else { // new record so add to the model
				var id;
				Math.max.apply(Math, service.musicians.map(function(o) {
					// used to get the last id in the model and increase it by 1
					id = o.id + 1
				}));
			
				musician.id = id;
				service.musicians.push(musician);
			}
		}
	}

})();
