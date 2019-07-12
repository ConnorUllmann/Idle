function ResourceSink(x, y, game, resourceType)
{
    this.game = game;
    Actor.call(this, x, y, world, ResourceSink.radius * 2, ResourceSink.radius * 2);

    this.resourceType = resourceType;

    this.inputResourceIO = new ResourceIO(this, 0, 0, this.resourceType, IOType.INPUT);

    this.driftLengthNormal = 0;

    this.depth = 100;
}
ResourceSink.prototype = Object.create(Actor.prototype);
ResourceSink.prototype.constructor = ResourceSink;

ResourceSink.radius = 40;

ResourceSink.prototype.update = function()
{
    Actor.prototype.update.call(this);
    this.inputResourceIO.update();
};

ResourceSink.prototype.render = function()
{
    let inputResourceInFront = this.isMouseHovering() || this.inputResourceIO.isMouseSelected();

    let driftLengthNormalTarget = inputResourceInFront ? 0 : 1;
    this.driftLengthNormal += (driftLengthNormalTarget - this.driftLengthNormal) / 10;


    if(!inputResourceInFront)
        this.inputResourceIO.render();

    const layers = 6;
    const baseColor = new Color(0, 0, 0);
    for(let i = 0; i < layers; i++)
    {
        let radius = (1 - i / layers) * ResourceSink.radius;

        let colorLerpNormal = i / (layers - 1);
        colorLerpNormal = Math.pow(colorLerpNormal, 0.3);
        let color = ResourceConfig[this.resourceType].COLOR.lerp(baseColor, colorLerpNormal);

        let angleRadians = 0.2 * i - this.world.timeSinceStart() / ((layers - i) * 100);
        let driftAngleRadians = this.world.timeSinceStart() / 200;

        let driftLength = this.driftLengthNormal * i / (layers - 1) * 8;
        let x = this.x + driftLength * Math.cos(driftAngleRadians);
        let y = this.y + driftLength * Math.sin(driftAngleRadians);
        Draw.regularPolygon(this.world, x, y, radius, Resource.sides, color, angleRadians);
    }

    if(inputResourceInFront)
        this.inputResourceIO.render();

    Actor.prototype.render.call(this);
};