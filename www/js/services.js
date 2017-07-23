angular.module('PasswordLocker.services', ['PasswordLocker.config'])

.factory('DB', function($q, DB_CONFIG) {
    var self = this;
    self.db = null;

    self.init = function() {
        // Use self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name}); in production
        self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', -1);

        angular.forEach(DB_CONFIG.tables, function(table) {
            var columns = [];

            angular.forEach(table.columns, function(column) {
                columns.push(column.name + ' ' + column.type);
            });

            var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
            self.query(query);
            console.log('Table ' + table.name + ' initialized');
        });
    };

    self.query = function(query, bindings) {
        bindings = typeof bindings !== 'undefined' ? bindings : [];
        var deferred = $q.defer();

        self.db.transaction(function(transaction) {
            transaction.executeSql(query, bindings, function(transaction, result) {
                deferred.resolve(result);
            }, function(transaction, error) {
                deferred.reject(error);
            });
        });

        return deferred.promise;
    };

    self.fetchAll = function(result) {
        var output = [];

        for (var i = 0; i < result.rows.length; i++) {
            output.push(result.rows.item(i));
        }
        
        return output;
    };

    self.fetch = function(result) {
        return result.rows.item(0);
    };

    return self;
})
// Resource service example
.factory('Document', function(DB) {
    var self = this;
    
    self.alltitle = function() {
        return DB.query("SELECT Idkey,title FROM PasswordLocker")
        .then(function(result){
            return DB.fetchAll(result);
        });
    };

    self.all = function() {
        return DB.query("SELECT Idkey,title,desc FROM PasswordLocker")
        .then(function(result){
            return DB.fetchAll(result);
        });
    };
    
    self.getById = function(id) {
        return DB.query('SELECT keyword FROM PasswordLocker WHERE IdKey = ?', [id])
        .then(function(result){
            return DB.fetch(result);
        });
    };
      
    self.getBytitle = function(title) {
        return DB.query('SELECT keyword FROM PasswordLocker WHERE title = ?', [title])
        .then(function(result){
            return result;
        });
    };

    self.addOne = function(title,keyword,desc) {
        var idkey =generateUUID();
        idkey=String(idkey);
        console.log(idkey,title,keyword);
        return DB.query('INSERT INTO PasswordLocker (IdKey,title,desc,keyword) VALUES (?,?,?,?)', [idkey,title,desc,keyword]);

    };

    self.deleteOne =function(id){
        return DB.query("DELETE FROM PasswordLocker WHERE IdKey = ?",[id]);
        
    }

    return self;
})

;


    function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
    };