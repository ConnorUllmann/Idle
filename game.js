function Game(world)
{
    Entity.call(this, 0, 0, world);

    this.mouseSelectedResourceIO = null;

    let resourceA = new Resource(100, 120, this, ResourceType.ISOPHINE);
    let resourceB = new Resource(100, 150, this, ResourceType.METOSION);
    let resourceC = new Resource(100, 200, this, ResourceType.ALTROSIA);
    let resourceGen = new ResourceGenerator(300, 150, this, ResourceType.ALTROSIA);
    let resourceBatt = new ResourceBattery(300, 300, this, ResourceType.ISOPHINE);
    let resourceTrans = new ResourceTransformer(300, 500, this, {
        METOSION: 2,
        ALTROSIA: 1
    }, {
        ISOPHINE: 2
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