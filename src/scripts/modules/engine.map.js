define(
    ['modules/engine.events', 'modules/engine.game', 'modules/loader.assets', 'modules/engine.debug'],
    function (eventEngine, gameEngine, assetLoader, debugEngine) {
    var maps = { // should load maps from server
        levelOne: {
            data: "GGGGGGGGGGGGGGDGGGGGGGGGG",
            width: 5,
            tileDimensions: {
                height: 64,
                width: 128
            },
            treeFactor: .05,
            enemyFactor: 6,
            enemies: [],
            enemyTemplates: [
                {
                    name: 'Kit',
                    imagePath: "images/kit_from_firefox.png",
                    image: null,
                    size: { width: 56, height: 80 },
                    front: { x: 0, y: 0 },
                    back: { x: 56, y: 80 }
                },
                {
                    name: 'Gnu',
                    imagePath: "images/gnu_from_gnu.png",
                    image: null,
                    size: { width: 56, height: 80 },
                    front: { x: 0, y: 0 },
                    back: { x: 56, y: 80 }
                },
                {
                    name: 'Android',
                    imagePath: "images/droid_from_android.png",
                    image: null,
                    size: { width: 56, height: 80 },
                    front: { x: 0, y: 0 },
                    back: { x: 56, y: 80 }
                },
                {
                    name: 'Sara',
                    imagePath: "images/sara_from_opengameart.png",
                    image: null,
                    size: { width: 56, height: 80 },
                    front: { x: 0, y: 0 },
                    back: { x: 56, y: 80 }
                },
                {
                    name: 'Tux',
                    imagePath: "images/tux_from_linux.png",
                    image: null,
                    size: { width: 56, height: 80 },
                    front: { x: 0, y: 0 },
                    back: { x: 56, y: 80 }
                },
                {
                    name: 'Wilber',
                    imagePath: "images/wilber_from_gimp_0.png",
                    image: null,
                    size: { width: 56, height: 80 },
                    front: { x: 0, y: 0 },
                    back: { x: 56, y: 80 }
                }
            ],
            tiles: {
                "G": 'images/grass.png',
                "D": 'images/dirt.png'
            },
            entities: {
                tiles: {
                    "G": [
                        'images/tree.png'
                    ]
                },
                buildables:{

                },
                home: {
                    texture: 'images/icecream.png',
                    row: 1,
                    col: 4
                }
            },
            behavior: {
            }
        }
    };
    var _currentMap = null;
    return {
        _getElligibleEvents: function() {
            var _e = [];
            for(var d in this.events.names) {
                if( this.events.names.hasOwnProperty(d) ) {
                    _e.push( this.events.names[d] );
                }
            }
            return _e;
        },
        getTileImage: function(cellPos) {
            var image = new Image();
            image.src = _currentMap.tiles[_currentMap.data.substr(cellPos,1)];
            return image;
        },
        getCurrentMap: function() {
            return _currentMap;
        },
        setCurrentLevel: function(name) {
            _currentMap = maps[name] || _currentMap;
            
            var length = _currentMap.enemyTemplates.length;
            var enemyTemplates = _currentMap.enemyTemplates;
            var enemies = _currentMap.enemies;
            
            while(!assetLoader.doneYet) {}
            
            for (var i = 0; i < _currentMap.enemyFactor; i++) {
                var enemyIndex = Math.floor(Math.random() * length);
            
                enemyTemplates[enemyIndex].image = assetLoader.getAsset(enemyTemplates[enemyIndex].imagePath);
                
                var enemy = {
                    enemyTemplate: enemyTemplates[enemyIndex],
                    life: 20
                };
                
                enemies[i] = enemy;
            }
            
            eventEngine.pub(this.events.LEVEL_LOADED);
            return this; // for chaining
        },
        getDataIndex: function( pos ) {
            return ((pos.y/_currentMap.tileDimensions.height)*_currentMap.width) + (pos.x/_currentMap.tileDimensions.width);
        },
        getTileType: function( pos ) {
            return _currentMap.data.substr( this.getDataIndex(pos), 1 );
        },
        getPosFromDataIndex: function(index) {
            return {
                x: (index%_currentMap.width) * _currentMap.tileDimensions.width,
                y: ( index < _currentMap.width ? 0 : Math.floor(index / _currentMap.width) ) * _currentMap.tileDimensions.height
            };
        },
        translatePosition: function(row, col, entity) {
            var tile    = _currentMap.tileDimensions;
            var canvas  = gameEngine.getCanvas();
            var pos = {
                x: ((row - col) * tile.height) + Math.floor((canvas.width / 2) - (tile.width / 2)),
                y: Math.floor( (row + col) * (tile.height / 2) )
            };

            if (entity) {
                if (entity.width != tile.width) {
                    pos.x += tile.width / 2 - entity.width / 2;
                }
                
                if (entity.height != tile.height) {
                    pos.y -= entity.height - tile.height;
                }
            }

            return pos;
        },
        translatePositionEntity: function(row, col, entity) {
            var tile    = _currentMap.tileDimensions;
            var canvas  = gameEngine.getCanvas();
            var pos = {
                x: ((row - col) * tile.height) + Math.floor((canvas.width / 2) - (tile.width / 2)),
                y: Math.floor( (row + col) * (tile.height / 2) )
            };

            if (entity) {
                if (entity.width != tile.width) {
                    pos.x += tile.width / 2 - entity.width / 2;
                }
                
                if (entity.height != tile.height) {
                    pos.y -= entity.height - tile.height / 2;
                }
            }

            return pos;
        },
        rowColToIndex: function(row, col) {
            return (row * _currentMap.width + col);
        },
        tileLoop: function(fn) {
            var index = 0;
            
            for (var startPosition = 0; startPosition < _currentMap.width; startPosition++) {
                for (var row = startPosition; row < _currentMap.width; row++) {
                    var index = this.rowColToIndex(row, startPosition);
                    fn.call(this, row, startPosition, index);
                }
                
                for (var col = startPosition + 1; col < _currentMap.width; col++) {
                    var index = this.rowColToIndex(startPosition, col);
                    fn.call(this, startPosition, col, index);
                }
            }
        },
        renderTo: function(canvas, context) {
            context.clearRect (0, 0, canvas.width, canvas.height);
            
            this.tileLoop(function(row, col, index) {
                var img     = this.getTileImage(index),
                    pos     = this.translatePosition( row, col );

                context.drawImage(img, pos.x, pos.y, img.width, img.height);
                
                eventEngine.pub(this.events.TILE_RENDER, this, [index, row, col, pos]);
                eventEngine.pub(this.events.BUILDING_RENDER, this, [index, row, col, pos]);
                eventEngine.pub(this.events.DEFENSE_RENDER, this, [index, row, col, pos]);
                eventEngine.pub(this.events.PLAYER_RENDER, this, [index, row, col, pos]);
                eventEngine.pub(this.events.EFFECT_RENDER, this, [index, row, col, pos]);
                
                var enemy = _currentMap.enemies[index];
                
                if (enemy) {
                    var pos = this.translatePositionEntity(row, col, enemy.enemyTemplate.size);
                    context.drawImage(enemy.enemyTemplate.image, enemy.enemyTemplate.front.x, enemy.enemyTemplate.front.y, enemy.enemyTemplate.size.width, enemy.enemyTemplate.size.height, pos.x, pos.y, enemy.enemyTemplate.size.width, enemy.enemyTemplate.size.height);
                }
            });
        },
        tileTypes: {
            "G": {
                isBuildable: true,
                isWalkable: true
            },
            "W": {
                isBuildable: false,
                isWalkable: false
            },
            "S": {
                isBuildable: true,
                isWalkable: false
            },
            "D": {
                isBuildable: true,
                isWalkable: true
            }
        },
        events: {
            LEVEL_LOADED: "levelLoaded",
            
            TILE_RENDER: "tileRender",
            BUILDING_RENDER: "buildingRender",
            DEFENSE_RENDER: "defenseRender",
            PLAYER_RENDER: "playerRender",
            EFFECT_RENDER: "effectRender"
        }
    };
});
