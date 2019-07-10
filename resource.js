function Resource(x, y, game, resourceType)
{
    this.game = game;
    this.resourceType = resourceType;
    let resourceConfig = this.getResourceConfig();
    Actor.call(this, x, y, this.game.world, resourceConfig.WIDTH, resourceConfig.HEIGHT);

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
};

Resource.prototype.render = function()
{
    Draw.rect(this.world, this.getLeftX(), this.getTopY(), this.width, this.height, this.getResourceConfig().COLOR);
    this.outputResourceIO.render();
    Actor.prototype.render.call(this);
};

Resource.prototype.getResourceConfig = function() { return this.resourceType == null ? null : ResourceConfig[this.resourceType]; };
