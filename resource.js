function Resource(x, y, world, resourceType)
{
    this.resourceType = resourceType;
    let resourceConfig = this.getResourceConfig();
    Actor.call(this, x, y, world, resourceConfig.WIDTH, resourceConfig.HEIGHT);
}
Resource.prototype = Object.create(Actor.prototype);
Resource.prototype.constructor = Resource;

Resource.prototype.update = function()
{
    Actor.prototype.update.call(this);
};

Resource.prototype.render = function()
{
    Draw.rect(this.world, this.getLeftX(), this.getTopY(), this.width, this.height, this.getResourceConfig().COLOR);
    Actor.prototype.render.call(this);
};

Resource.prototype.getResourceConfig = function() { return this.resourceType == null ? null : ResourceConfig[this.resourceType]; };
