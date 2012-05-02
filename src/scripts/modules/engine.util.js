define(function() {
    return {
        coinFlip: function() {
            return this.random([true,false]);
        },
        // Pick a random property from an object, or a random index from an array
        random: function (object) {
            if (object instanceof Array) {
                var length = object.length;
                var randomIndex = Math.floor(Math.random() * length);

                return object[randomIndex];
            } else if (typeof object == 'object') {
                var properties = [];

                for (var propertyName in object) {
                    if (object.hasOwnProperty(propertyName)) {
                        properties.push(propertyName);
                    }
                }

                var length = properties.length;
                var randomIndex = Math.floor(Math.random() * length);

                return properties[randomIndex];
            }

            return null;
        },
        propability: function (factor) {
            var randomNumber = Math.floor(Math.random() * 100);
            return (randomNumber < factor * 100);
        },
        pointToIndex: function (canvas, tileSize, mapWidth, pos) {
            // TODO: Refactor the 50 out
            var col = (((canvas.width / 2) - (tileSize.width / 2) + (pos.y * 2)) - pos.x) / 2;
            var row = ((pos.x + col) - tileSize.height) - (canvas.width / 2) + (tileSize.width / 2);

            row = Math.round(row / tileSize.height);
            col = Math.round(col / tileSize.height);

            return row * mapWidth + col;
        },
        rowColToIndex: function(row, col) {
            return (row * _currentMap.width + col);
        },
        rowColToPoint: function (canvasWidth, tileSize, row, col) {
            var point = {
                x: ((row - col) * tileSize.height) + Math.floor((canvasWidth / 2) - (tileSize.width / 2)),
                y: Math.floor( (row + col) * (tileSize.height / 2) )
            };

            return point;
        },
        entityRowColToPoint: function(canvasWidth, tileSize, row, col, entity) {
            var pos = {
                x: ((row - col) * tileSize.height) + Math.floor((canvasWidth / 2) - (tileSize.width / 2)),
                y: Math.floor( (row + col) * (tileSize.height / 2) )
            };

            if (entity) {
                if (entity.width != tileSize.width) {
                    pos.x += tileSize.width / 2 - entity.width / 2;
                }

                if (entity.height != tileSize.height) {
                    pos.y -= entity.height - tileSize.height / 2;
                }
            }

            return pos;
        },
        indexToRowCol: function (mapWidth, index) {
            return { row: Math.floor(index / mapWidth), col: index % mapWidth };
        },
        indexToPoint: function(canvasWidth, mapWidth, tileSize, index) {
            var rowCol = this.indexToRowCol(mapWidth, index);
            return this.rowColToPoint(canvasWidth, tileSize, rowCol.row, rowCol.col);
        },
    }
});
