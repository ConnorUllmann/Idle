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
Resource.sides = 6;

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

Resource.draw = function(world, x, y, color)
{
    Draw.regularPolygon(world, x, y, Resource.radius, Resource.sides, color, world.timeSinceStart() / 200);
};

Resource.prototype.getResourceConfig = function() { return this.resourceType == null ? null : ResourceConfig[this.resourceType]; };