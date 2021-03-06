        var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameFrame', { preload: preload, create: create, update: update });

        var mainState;

        var background;
        var player;
        var cursors;
        var bullets;
        var bulletTime = 0;
        var fire;
        var explosion;

        var enemies;

        var score = 0;
        var scoreString = '';
        var scoreText;
        // var winText;

        function preload() {

            game.load.image('background', 'assets/background.png');
            game.load.image('player', 'assets/ship.png');
            game.load.image('bullet', 'assets/bullet.png');
            game.load.image('enemy', 'assets/enemy.png');
            game.load.spritesheet('explosion', 'assets/explode.png', 128, 128);

        }

        function create() {

            game.add.sprite(0, 0, 'background');

            background = game.add.tileSprite(0, 0, 800, 800, 'background');

            player = game.add.sprite(100, game.world.height - 300, 'player');

            game.physics.enable(player, Phaser.Physics.ARCADE);

            player.body.collideWorldBounds=true;

            cursors = game.input.keyboard.createCursorKeys();

            bullets = game.add.group();
            bullets.enableBody = true;
            bullets.physicsBodyType = Phaser.Physics.ARCADE;
            bullets.createMultiple(1000, 'bullet');
            bullets.setAll('anchor.x', 1);
            bullets.setAll('anchor.y', 0.5);
            bullets.setAll('outOfBoundsKill', true);
            bullets.setAll('checkWorldBounds', true);

            fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            enemies = game.add.group();
            enemies.enableBody = true;
            enemies.physicsBodyType = Phaser.Physics.ARCADE;

            // explosions
            explosions = game.add.group();
            explosions.createMultiple(20, 'explosion');
            explosions.forEach(setupEnemies, this);

            createEnemies();

            function createEnemies(){
                for(var x = 0; x < 4; x++){
                    for(var y = 0; y < 5; y++){
                        var enemy = enemies.create(x*70,y*75,'enemy');
                        enemy.anchor.setTo(0.5,0.5);
                    }
                }

                enemies.y = 100;
                enemies.x = 900;

                // Enemy movement loop
                var tween = game.add.tween(enemies).to({x:-350}, 5000, Phaser.Easing.Linear.None, true, 0, 500, false);

                tween.onLoop.add(attack,this);

            }

            function setupEnemies(enemy){
                enemy.anchor.x = 0.5;
                enemy.anchor.y = 0.5;
                enemy.animations.add('explosion');
            }

            function attack(){
                enemies.x += 8;
            }            

            // score
            scoreString = 'Score : ';
            scoreText = game.add.text(10, 10, 'Score: 0',{fontsize: '32px', fill: '#fff'});
            
            // winText = game.add.text(game.world.centerX,game.world.centerY,'You Win!'{fontsize: '32px', fill: '#fff'});
            // winText.anchor.setTo(0.5, 0.5);
            // winText.visible = false;

        }

        function update() {

            // player starting speed
            player.body.velocity.x = 0;

            player.body.velocity.y = 0;

            // background loop
            background.tilePosition.x -= 1;

            // key commands
            if(cursors.left.isDown){
                player.body.velocity.x = -180;
            }
            if(cursors.right.isDown){
                player.body.velocity.x = 180;
            }
            if(cursors.up.isDown){
                player.body.velocity.y = -180;
            }
            if(cursors.down.isDown){
                player.body.velocity.y = 180;
            }

            if(fireButton.isDown){
                fireBullet();
            }

            // bullet to enemy physics
            game.physics.arcade.overlap(bullets,enemies,collisionHandler,null,this);
            // player to enemy physics
            game.physics.arcade.overlap(enemies,player,enemyHitsPlayer,null,this);

            if(score == 2000){
                scoreText.visible = true;
            }

        }

        // bullet firing speed and function
        function fireBullet(){
            if(game.time.now > bulletTime)
                bullet = bullets.getFirstExists(false);
                    if(bullet){
                        // controls bullet firing place
                        bullet.reset(player.x + 25,player.y + 10);
                        bullet.body.velocity.x = 500;
                        bulletTime = game.time.now + 40;
                    }
        }

        //bullet collision 
        function collisionHandler(bullet,enemy){
            bullet.kill();
            enemy.kill();
            score += 100;
            scoreText.text = scoreString + score;

            // enemy explodes
            var explosion = explosions.getFirstExists(false);
            explosion.reset(enemy.body.x, enemy.body.y);
            explosion.play('explosion', 20, false, true);
        }

        // player enemy collision
        function enemyHitsPlayer (player,enemy){
            player.kill();
            enemy.kill();
            // player explodes
            var explosion = explosions.getFirstExists(false);
            explosion.reset(player.body.x, player.body.y);
            explosion.play('explosion', 20, false, true);            
        }


        game.state.add('mainState',mainState);
        game.state.start('mainState');