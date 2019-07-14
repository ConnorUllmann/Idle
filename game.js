function Game(world)
{
    Entity.call(this, 0, 0, world);

    this.mouseSelectedResourceIO = null;

    let resourceISO1 = new Resource(100, 150, this, ResourceType.ISOPHINE);
    let resourceISO2 = new Resource(150, 150, this, ResourceType.ISOPHINE);
    let resourceISO3 = new Resource(200, 150, this, ResourceType.ISOPHINE);
    
    let resourceMET1 = new Resource(100, 200, this, ResourceType.METOSION);
    let resourceMET2 = new Resource(150, 200, this, ResourceType.METOSION);
    let resourceMET3 = new Resource(200, 200, this, ResourceType.METOSION);

    let resourceALT1 = new Resource(100, 250, this, ResourceType.ALTROSIA);
    let resourceALT2 = new Resource(150, 250, this, ResourceType.ALTROSIA);
    let resourceALT3 = new Resource(200, 250, this, ResourceType.ALTROSIA);

    let resourceOBE1 = new Resource(100, 300, this, ResourceType.OBERNINE);
    let resourceOBE2 = new Resource(150, 300, this, ResourceType.OBERNINE);
    let resourceOBE3 = new Resource(200, 300, this, ResourceType.OBERNINE);

    let resourceEIN1 = new Resource(100, 350, this, ResourceType.EINORITE);
    let resourceEIN2 = new Resource(150, 350, this, ResourceType.EINORITE);
    let resourceEIN3 = new Resource(200, 350, this, ResourceType.EINORITE);

    let resourceGenA = new ResourceGenerator(300, 150, this, ResourceType.ISOPHINE);
    let resourceGenB = new ResourceGenerator(300, 200, this, ResourceType.METOSION);
    let resourceGenC = new ResourceGenerator(300, 250, this, ResourceType.METOSION);
    let resourceGenD = new ResourceGenerator(300, 300, this, ResourceType.METOSION);
    let resourceGenE = new ResourceGenerator(300, 350, this, ResourceType.METOSION);
    let resourceGenF = new ResourceGenerator(300, 400, this, ResourceType.ALTROSIA);
    let resourceGenG = new ResourceGenerator(300, 450, this, ResourceType.ALTROSIA);

    let resourceBattA = new ResourceBattery(500, 150, this, ResourceType.ISOPHINE);
    let resourceBattB = new ResourceBattery(500, 250, this, ResourceType.METOSION);
    let resourceBattC = new ResourceBattery(500, 350, this, ResourceType.METOSION);
    let resourceBattD = new ResourceBattery(500, 450, this, ResourceType.ALTROSIA);

    let resourceSinkA = new ResourceSink(700, 150, this, ResourceType.ISOPHINE);
    let resourceSinkB = new ResourceSink(700, 250, this, ResourceType.METOSION);
    let resourceSinkC = new ResourceSink(700, 350, this, ResourceType.ALTROSIA);
    let resourceSinkD = new ResourceSink(700, 450, this, ResourceType.OBERNINE);
    let resourceSinkE = new ResourceSink(700, 550, this, ResourceType.EINORITE);

    let resourceTransA = new ResourceTransformer(300, 700, this, {
        METOSION: 2,
        ALTROSIA: 1
    }, {
        ISOPHINE: 2
    });

    let resourceTransB = new ResourceTransformer(400, 650, this, {
        METOSION: 2,
        ALTROSIA: 2
    }, {
        OBERNINE: 1
    });

    let resourceTransC = new ResourceTransformer(400, 800, this, {
        OBERNINE: 1,
        ALTROSIA: 1
    }, {
        EINORITE: 1
    });

    let resourceTransD = new ResourceTransformer(500, 800, this, {
        ALTROSIA: 1
    }, {
        EINORITE: 3
    });
}
Game.prototype = Object.create(Entity.prototype);
Game.prototype.constructor = Game;

Game.prototype.postUpdate = function()
{
    if(this.world.mouse.rightReleased)
    {
        if(this.mouseSelectedResourceIO != null)
            this.mouseSelectedResourceIO.disconnect();
        this.mouseSelectedResourceIO = null;
    }
};

Game.prototype.render = function()
{

};