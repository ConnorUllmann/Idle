function Resource(x, y, game, resourceType)
{
    this.game = game;
    this.resourceType = resourceType;
    this.radius = 10;
    Actor.call(this, x, y, this.game.world, this.radius * 2 , this.radius * 2);

    this.outputResourceIO = new ResourceIO(this, this.width/2, 0, 8, this.resourceType, IOType.OUTPUT);
}
Resource.prototype = Object.create(Actor.prototype);
Resource.prototype.constructor = Resource;

Resource.prototype.removed = function()
{
    this.outputResourceIO.removed();
};

Resource.prototype.update = function()
{
    Actor.prototype.update.call(this);

    this.outputResourceIO.update();
    if(this.outputResourceIO.isConnected())
    {
        if(this.outputResourceIO.connectedResourceIO.tryAddResource())
            this.destroy();
    }
};

Resource.prototype.render = function()
{
    Draw.circle(this.world, this.x, this.y, this.radius, this.getResourceConfig().COLOR);
    this.outputResourceIO.render();
    Actor.prototype.render.call(this);
};

Resource.prototype.getResourceConfig = function() { return this.resourceType == null ? null : ResourceConfig[this.resourceType]; };