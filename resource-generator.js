function ResourceGenerator(x, y, world, resourceType)
{
    this.resourceType = resourceType;
    this.radius = 20;
    Actor.call(this, x, y, world, this.radius * 2 , this.radius * 2);
}
ResourceGenerator.prototype = Object.create(Actor.prototype);
ResourceGenerator.prototype.constructor = ResourceGenerator;

ResourceGenerator.prototype.update = function()
{
    Actor.prototype.update.call(this);
};

ResourceGenerator.prototype.render = function()
{
    Draw.circle(this.world, this.x, this.y, this.radius, this.getResourceConfig().COLOR);
    Actor.prototype.render.call(this);
};

ResourceGenerator.prototype.getResourceConfig = function() { return this.resourceType == null ? null : ResourceConfig[this.resourceType]; };