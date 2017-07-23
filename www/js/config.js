angular.module('PasswordLocker.config', [])
.constant('DB_CONFIG', {
    name: 'DB',
    tables: [
      {
            name: 'PasswordLocker',
            columns: [
                {name: 'IdKey', type: 'string'},
                {name: 'title', type: 'text'},
                {name: 'desc', type: 'text'},
                {name: 'keyword', type: 'text'},
            ]
        }
    ]
});