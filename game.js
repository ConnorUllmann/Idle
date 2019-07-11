function Game(world)
{
    Entity.call(this, 0, 0, world);

    this.mouseSelectedResourceIO = null;

    let resourceA = new Resource(100, 120, this, ResourceType.ISOPHINE);
    let resourceB = new Resource(100, 150, this, ResourceType.METOSION);
    let resourceC = new Resource(100, 200, this, ResourceType.ALTROSIA);

    let resourceGenA = new ResourceGenerator(300, 150, this, ResourceType.ISOPHINE);
    let resourceGenB = new ResourceGenerator(300, 250, this, ResourceType.METOSION);
    let resourceGenC = new ResourceGenerator(300, 350, this, ResourceType.ALTROSIA);

    let resourceBattA = new ResourceBattery(500, 150, this, ResourceType.ISOPHINE);
    let resourceBattB = new ResourceBattery(500, 250, this, ResourceType.METOSION);
    let resourceBattC = new ResourceBattery(500, 350, this, ResourceType.ALTROSIA);

    let resourceTrans = new ResourceTransformer(500, 500, this, {
        METOSION: 1,
        ALTROSIA: 1,
        ISOPHINE: 1
    }, {
        ISOPHINE: 1
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