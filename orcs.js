const gameState = {
    numTeams: 2,
    teamNames: [ "That's America's Axe", "I Can Axe This All Day" ],
    numRounds: 10,
    currentRound: 1,
    scores: [],
    gameBoardX: 1200,
    gameBoardY: 1200,
    startingOrcs: 12,
    teamOrcs: [],
    nameObjects: [ ],
    teamUp: 0,
}

function preload () {
    // load in background and orcs
    //this.load.image('bg',     'https://content.codecademy.com/projects/learn-phaser/cyoa/background.png');
    //this.load.image('knight', 'https://content.codecademy.com/projects/learn-phaser/cyoa/knight.png');
    this.load.image('orc0', 'images/orc.png');
    this.load.image('orc1', 'images/orc1.png');
    this.load.image('orc2', 'images/orc2.png');
    this.load.image('orc3', 'images/orc3.png');
    this.load.image('elf0', 'images/elf.png');
    this.load.image('elf1', 'images/elf1.png');

    //this.load.image('wizard', 'https://content.codecademy.com/projects/learn-phaser/cyoa/wizard.png');
}

function create() {

    initializePage(this);
    renderGameBoard(this);

}

function initializePage(scene) {
    // create options list and background
    // and saves them into gameState

    const borderBox = scene.add.rectangle(0, 0, gameState.gameBoardX, gameState.gameBoardY, 0x765C48)
    borderBox.setOrigin(0, 0);
    borderBox.setScale(1);
    borderBox.strokeColor = 0x000000;
    borderBox.isStroked = true;
    borderBox.lineWidth = 5;

    const logoBox = scene.add.rectangle (0, 1150, 1200, 50, 0x654321);
    logoBox.setOrigin(0, 0);
    logoBox.setScale(1);
    logoBox.strokeColor = 0x000000;
    logoBox.isStroked = true;
    logoBox.lineWidth = 3;

    scene.add.text(350, 1160, 'Axe Throwing Software by Stormraven Software',
        {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            color: '#ffffff',
            fontSize: '25px',
            stroke: '#000000',
            strokeThickness: 5,
        });

    const scoreBox = scene.add.rectangle (0, 0, 1200, 100, 0x654321);
    scoreBox.setOrigin(0, 0);
    scoreBox.setScale(1);
    scoreBox.strokeColor = 0x000000;
    scoreBox.isStroked = true;
    scoreBox.lineWidth = 3;

    var teamIndex = 0;

    for (teamIndex = 0; teamIndex < gameState.numTeams; teamIndex++) {
        gameState.scores[teamIndex] = [ ];
        gameState.teamOrcs[teamIndex] = gameState.startingOrcs;
    }

    // Create a "miss" box
    const missBox = scene.add.rectangle (1025, 10, 150, 75, 0xff0000);
    missBox.setOrigin(0, 0);
    missBox.setScale(1);
    missBox.strokeColor = 0xffffff;
    missBox.isStroked = true;
    missBox.lineWidth = 3;
    missBox.setInteractive();
    missBox.on('pointerover', function() {
        this.fillColor = 0x00ff00;
    })
    missBox.on('pointerout', function() {
        this.fillColor = 0xff0000;
    })
    missBox.on('pointerup', function() {
        registerShot(0);
        clearBoard(scene);
        renderGameBoard(scene);
    })

    const missLine = scene.add.text(1035, 12, 'MISS',
        {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            color: '#ffffff',
            fontSize: '50px',
            stroke: '#000000',
            strokeThickness: 5,
        });

    missLine.setOrigin(0, 0);

    const tagLine = scene.add.text(350, 1160, 'Axe Throwing Software by Stormraven Software',
        {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            color: '#ffffff',
            fontSize: '25px',
            stroke: '#000000',
            strokeThickness: 5,
        });

    tagLine.setOrigin(0, 0);
}

function renderGameBoard(scene) {
    var currentTeam = gameState.teamUp;

    renderScore( scene );

    if (gameState.currentRound <= gameState.numRounds) {

        //console.log ("Calling render Orcs with: " + gameState.teamOrcs[currentTeam]);
        renderOrcs(scene, gameState.teamOrcs[currentTeam]);
        renderElves(scene, 2);


        scene.physics.world.step(0);

        scene.physics.world.overlap(gameState.elves, gameState.orcs, function (elf, orc) {
            elf.destroy();
            orc.destroy();
            createElf( scene );
            createOrc( scene );
            console.log ("Overlap!");
        });
    }
    else {

        const gameOverLine = scene.add.text(450, 500, 'GAME OVER',
            {
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
                color: '#ffffff',
                fontSize: '55px',
                stroke: '#000000',
                strokeThickness: 5,
            });

        gameOverLine.setOrigin(0, 0);

        var teamIndex = 0;
        var winningScore = 0;
        var winningTeam = 0;

        for (teamIndex = 0; teamIndex < gameState.numTeams; teamIndex++) {
            var teamTotal = 0;
            var roundIndex = 0;
            for (roundIndex = 0; roundIndex < gameState.numRounds; roundIndex++) {
                if (gameState.scores[teamIndex][roundIndex] )
                    teamTotal += gameState.scores[teamIndex][roundIndex];
            }
            if (teamTotal > winningScore) {
                winningTeam = teamIndex;
                winningScore = teamTotal;
            }
        }

        const winningTeamLine = scene.add.text(150, 700, "WINNER: " + gameState.teamNames[ winningTeam ],
            {
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
                color: '#ffffff',
                fontSize: '55px',
                stroke: '#000000',
                strokeThickness: 5,
            });

        winningTeamLine.setOrigin(0, 0);

    }
}

function renderScore (scene) {
    var teamIndex = 0;

    for (teamIndex = 0; teamIndex < gameState.numTeams; teamIndex++) {
        var teamY = 10 + (40 * teamIndex);
        var teamTotal = 0;

        gameState.nameObjects[teamIndex] =
            scene.add.text(50,  teamY, gameState.teamNames[teamIndex],
                {
                    fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
                    color: '#ffffff',
                    fontSize: '20px',
                    stroke: '#000000',
                    strokeThickness: 2,
                }).setOrigin(0, 0);

        // Create a box for each of the score rounds for each team

        var roundIndex = 0;
        for (roundIndex = 0; roundIndex < gameState.numRounds; roundIndex++) {
            var scoreRect = scene.add.rectangle (350 + (50 * roundIndex), teamY, 50, 30, 0xffffff);
            scoreRect.isStroked = 1;
            scoreRect.strokeColor = '#000000';
            scoreRect.strokeWidth = 2;
            scoreRect.setOrigin(0, 0);

            var scoreText =  scene.add.text(365 + (50 * roundIndex), teamY, gameState.scores[teamIndex] [roundIndex],
                {
                    fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
                    color: '#000000',
                    fontSize: '20px',
                    stroke: '#000000',
                    strokeThickness: 3,
                });

            scoreText.setOrigin(0, 0);

            if (gameState.scores[teamIndex][roundIndex] )
                teamTotal += gameState.scores[teamIndex][roundIndex];

        }

        //console.log (teamTotal);

        // Create a total box

        var totalRect = scene.add.rectangle (900, teamY, 100, 30, 0xffffff);
        totalRect.isStroked = 1;
        totalRect.strokeColor = '#000000';
        totalRect.strokeWidth = 4;
        totalRect.setOrigin(0, 0);

        var totalText =  scene.add.text(925, teamY, teamTotal,
            {
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
                color: '#000000',
                fontSize: '20px',
                stroke: '#000000',
                strokeThickness: 3,
            });

        totalText.setOrigin(0, 0);
    }


}

function registerShot( points ) {
    gameState.scores[ gameState.teamUp ].push( points );
    if (points > 0) {
        gameState.teamOrcs[ gameState.teamUp] --;
    }
    nextTeam();

    //console.log (gameState);
}

function nextTeam() {
    gameState.teamUp++;
    if (gameState.teamUp >= gameState.numTeams) {
        gameState.teamUp = 0;
        gameState.currentRound++;
    }
}

function createElf (scene) {
    var zombieX = Phaser.Math.Between(150, 1050);
    var zombieY = Phaser.Math.Between(250, 1050);

    var whichElf = "elf" +  Math.floor (Math.random() * 2);

    var thisElf = gameState.elves.create (zombieX, zombieY, whichElf)
    thisElf.setOrigin(1, 1);
    thisElf.setScale(0.3);
    thisElf.setInteractive();

    thisElf.body.setSize (thisElf.width * (0.3), thisElf.height * 0.3, true);

    thisElf.on('pointerover', function()
    {
        this.strokeColor = 0xffffff; this.setBlendMode(Phaser.BlendModes.SCREEN)
    })

    thisElf.on('pointerout', function()
    {
        this.strokeColor = 0x000000; this.setBlendMode(Phaser.BlendModes.NORMAL)
    })

    thisElf.on('pointerup', function() {
        //console.log ("Orc Clicked!");
        registerShot(-2);
        clearBoard( scene );
        renderGameBoard (scene);
    })


    scene.physics.world.overlap(thisElf, gameState.orcs, function (elf, orc) {
        thisElf.destroy();
        console.log ("Overlap creating Elf!");
    });

    scene.physics.world.overlap(thisElf, gameState.elves, function (elf, orc) {
        thisElf.destroy();
        console.log ("Overlap creating Elf!");
    });

}

function renderElves( scene, number ) {

    var elfIndex = 2;
    if (gameState.elves)
        gameState.elves.destroy();

    gameState.elves = scene.physics.add.staticGroup();

    var keepGoing = true;

    while (keepGoing) {
        createElf(scene);

        elfIndex++;

        if (gameState.elves.countActive() >= number) {
            keepGoing = false;
        }
    }
}

function createOrc( scene ) {
    var zombieX = Phaser.Math.Between(150, 1050);
    var zombieY = Phaser.Math.Between(250, 1050);

    var whichOrc = "orc" +  Math.floor (Math.random() * 4);

    var thisOrc = gameState.orcs.create(zombieX, zombieY, whichOrc)
    thisOrc.setOrigin(1, 1);
    thisOrc.setScale(0.3);
    thisOrc.setInteractive();

    thisOrc.body.setSize (thisOrc.displayWidth , thisOrc.displayHeight , true);

    console.log (thisOrc);

    thisOrc.on('pointerover', function()
    {
        this.strokeColor = 0xffffff; this.setBlendMode(Phaser.BlendModes.SCREEN)
    })
    thisOrc.on('pointerout', function()
    {
        this.strokeColor = 0x000000; this.setBlendMode(Phaser.BlendModes.NORMAL)
    })
    thisOrc.on('pointerup', function() {
        //console.log ("Orc Clicked!");
        registerShot(1);
        clearBoard( scene );
        renderGameBoard (scene);
    })

    scene.physics.world.overlap(thisOrc, gameState.orcs, function (thisOrc, thatOrc) {
        thisOrc.destroy();
        console.log ("Overlap! creating Orc");
        //console.log ( thisOrc );
        //console.log (thatOrc);
    });


}

function renderOrcs( scene, number ) {
    //console.log ("inside renderOrcs, number = " + number);

    var orcIndex = 0;
    var orcCount = 0;

    if (gameState.orcs)
        gameState.orcs.destroy();

    gameState.orcs = scene.physics.add.staticGroup();

    var keepGoing = true;

    while (keepGoing) {
        createOrc( scene );

        orcIndex++;

        if (gameState.orcs.countActive() >= number) {
            keepGoing = false;
        }
    }

    console.log (  (gameState.orcs.countActive() ) );

}

function clearBoard(scene) {

    gameState.orcs.destroy(true);
    gameState.elves.destroy (true );

    var teamIndex = 0;

    for (teamIndex = 0; teamIndex < gameState.numTeams; teamIndex++) {
        if (gameState.nameObjects[teamIndex]) {
            gameState.nameObjects[teamIndex].destroy();
        }

    }

}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-game',
    backgroundColor: 0Xffffff,
    width: 1200,
    height: 1200,
    scene: {
        preload,
        create,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            enableBody: true,
            debug: false,
        }
    }
};

const game = new Phaser.Game(config);