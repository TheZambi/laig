/**
 * MyGameScore
 * @constructor
 */
class MyGameScore extends CGFobject {
	constructor(scene, player, colors) {
        super(scene);
        this.player = player;
        this.colors = colors;
        this.rectangle = new MyRectangle(scene,0.5,-0.5,-0.5,0.5);
        this.marker = new MyCylinder(scene,20,20,0.5,0.5,0.5);

        this.greenAppearance = new CGFappearance(scene);
        this.greenAppearance.setAmbient(0,0.5,0,1);
        this.greenAppearance.setDiffuse(0,0.5,0,1);
        this.greenAppearance.setSpecular(0,0.5,0,1);

        this.orangeAppearance = new CGFappearance(scene);
        this.orangeAppearance.setAmbient(1,0.31,0,1);
        this.orangeAppearance.setDiffuse(1,0.31,0,1);
        this.orangeAppearance.setSpecular(1,0.31,0,1);

        this.purpleAppearance = new CGFappearance(scene);
        this.purpleAppearance.setAmbient(0.47,0.32,0.66,1);
        this.purpleAppearance.setDiffuse(0.47,0.32,0.66,1);
        this.purpleAppearance.setSpecular(0.47,0.32,0.66,1);

        this.greyAppearance = new CGFappearance(scene);
        this.greyAppearance.setAmbient(0.50,0.50,0.50,1);
        this.greyAppearance.setDiffuse(0.50,0.50,0.50,1);
        this.greyAppearance.setSpecular(0.50,0.50,0.50,1);

        if(player == 0)
        {
            this.alliances = new CGFappearance(this.scene);
            this.alliances.loadTexture('./scenes/images/player0Alliances.png');
        }
        if(player == 1)
        {
            this.alliances = new CGFappearance(this.scene);
            this.alliances.loadTexture('./scenes/images/player1Alliances.png');
        }
        this.bottomBox = new MyOpenBox(scene);
    }

    displayBase()
    {
        this.scene.pushMatrix();
        this.scene.scale(8,0.5,3.4);

        
        this.scene.defaultAppearance.apply();

        this.bottomBox.display();
        this.scene.translate(0,0.5,0);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.alliances.apply();
        this.rectangle.display();

        this.scene.popMatrix();
    }

    updateColors(colors)
    {
        this.colors = colors;
    }

    displayColorsWon()
    {
        var opponent = (this.player + 1) % 2;
        for(let i = 0; i < this.colors.length; i++)
        {
            this.scene.pushMatrix();
            this.scene.translate((i-1)*2.66,0.3,0); //i-1 because the marker starts in the middle so the offset is necessary.
            this.scene.rotate(-Math.PI/2,1,0,0);

            if(this.colors[i] == this.player)
            {
                switch(i)
                {
                    case 0:
                        this.orangeAppearance.apply();
                        break;
                    case 1:
                        this.purpleAppearance.apply();
                        break;
                    case 2:
                        this.greenAppearance.apply();
                        break;
                }
                
                this.marker.display();
            }
            else if (this.colors[i] == opponent){
                this.greyAppearance.apply();
                this.marker.display();
            }
            this.scene.popMatrix();

        }
    }
	
    display()
    {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2,0,1,0);
        this.scene.translate(0,0.35,0);

        this.displayBase();
        this.displayColorsWon();

        this.scene.popMatrix();

    }

}

