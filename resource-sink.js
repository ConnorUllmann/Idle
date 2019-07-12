function ResourceSink(x, y, game, resourceType)
{
    this.game = game;
    Actor.call(this, x, y, world, ResourceSink.radius * 2, ResourceSink.radius * 2);

    this.resourceType = resourceType;

    this.inputResourceIOs = [
        new ResourceIO(this, -ResourceIO.radius, ResourceIO.radius, this.resourceType, IOType.INPUT),
        new ResourceIO(this, -ResourceIO.radius, -ResourceIO.radius, this.resourceType, IOType.INPUT),
        new ResourceIO(this, ResourceIO.radius, ResourceIO.radius, this.resourceType, IOType.INPUT),
        new ResourceIO(this, ResourceIO.radius, -ResourceIO.radius, this.resourceType, IOType.INPUT)
    ];

    this.driftLengthNormal = 0;
    this.driftRandomization = Math.random() * 1000;

    this.pulseTimer = new Timer(1);
}
ResourceSink.prototype = Object.create(Actor.prototype);
ResourceSink.prototype.constructor = ResourceSink;

ResourceSink.radius = 40;

ResourceSink.prototype.update = function()
{
    Actor.prototype.update.call(this);
    this.pulseTimer.update();

    this.inputResourceIOs.forEach(o => o.update());
    for(let inputResourceIO of this.inputResourceIOs)
    {
        if(inputResourceIO.isConnected() && inputResourceIO.connectedResourceIO.isBackedUp)
        {
            inputResourceIO.connectedResourceIO.isBackedUp = false;
            this.pulseTimer.reset();
        }
    }
};

ResourceSink.prototype.render = function()
{
    let inputResourceInFront = this.isMouseHovering() || this.inputResourceIOs.any(o => o.isMouseSelected());

    let driftLengthNormalTarget = inputResourceInFront ? 0 : 1;
    this.driftLengthNormal += (driftLengthNormalTarget - this.driftLengthNormal) / 10;


    if(!inputResourceInFront)
        this.inputResourceIOs.forEach(o => o.render());

    const time = this.driftRandomization + this.world.timeSinceStart();

    const layers = 6;
    const baseColor = new Color(0, 0, 0);
    for(let i = 0; i < layers; i++)
    {
        let radiusNormal = 1 - i / layers;
        radiusNormal = radiusNormal * this.pulseTimer.value + Math.sqrt(radiusNormal * 1.2) * (1 - this.pulseTimer.value);
        let radius = radiusNormal * ResourceSink.radius;

        let colorLerpNormal = i / (layers - 1);
        colorLerpNormal = Math.pow(colorLerpNormal, 0.3);
        let color = ResourceConfig[this.resourceType].COLOR.lerp(baseColor, colorLerpNormal);

        let angleRadians = 0.2 * i - time / ((layers - i) * 100);
        let driftAngleRadians = time / 200;

        let driftLength = this.driftLengthNormal * i / (layers - 1) * (8 - 4 * this.pulseTimer.value);
        let x = this.x + driftLength * Math.cos(driftAngleRadians);
        let y = this.y + driftLength * Math.sin(driftAngleRadians);
        Draw.regularPolygon(this.world, x, y, radius, Resource.sides, color, angleRadians);
    }

    if(inputResourceInFront)
        this.inputResourceIOs.forEach(o => o.render());

    Actor.prototype.render.call(this);
};