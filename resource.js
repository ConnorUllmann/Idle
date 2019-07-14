function Resource(x, y, game, resourceType)
{
    this.game = game;
    this.resourceType = resourceType;
    Actor.call(this, x, y, this.game.world, Resource.radius * 2 , Resource.radius * 2);

    this.outputResourceIO = new ResourceIO(this, 0, 0, this.resourceType, IOType.OUTPUT);
    this.outputResourceIO.isBackedUp = true;
}
Resource.prototype = Object.create(Actor.prototype);
Resource.prototype.constructor = Resource;

Resource.radius = 16;

Resource.prototype.removed = function()
{
    this.outputResourceIO.removed();
};

Resource.prototype.update = function()
{
    Actor.prototype.update.call(this);

    this.outputResourceIO.update();
    if(!this.outputResourceIO.isBackedUp)
        this.destroy();
};

Resource.prototype.render = function()
{
    this.outputResourceIO.render();
    Actor.prototype.render.call(this);
};

Resource.draw = function(world, x, y, resourceType)
{
    const resourceConfig = ResourceConfig[resourceType];
    const angleRadians = world.timeSinceStart() / 1000 * resourceConfig.SPIN_RATE;
    Draw.regularPolygon(world, x, y, Resource.radius, resourceConfig.SIDES, resourceConfig.COLOR, angleRadians);
};

Resource.prototype.getResourceConfig = function() { return this.resourceType == null ? null : ResourceConfig[this.resourceType]; };