function ResourceGenerator(x, y, game, resourceType)
{
    this.game = game;
    this.resourceType = resourceType;
    this.backgroundColor = new Color(80, 80, 80);
    Actor.call(this, x, y, this.game.world, 40, 40);

    this.outputResourceIO = new ResourceIO(this, this.width/2, 0, this.resourceType, IOType.OUTPUT);

    this.generationTimer = new LoopTimer(this.getResourceConfig().GENERATION_DURATION);
}
ResourceGenerator.prototype = Object.create(Actor.prototype);
ResourceGenerator.prototype.constructor = ResourceGenerator;

ResourceGenerator.prototype.removed = function()
{
    this.outputResourceIO.removed();
};

ResourceGenerator.prototype.update = function()
{
    Actor.prototype.update.call(this);

    this.outputResourceIO.update();
    if(this.outputResourceIO.isConnected())
    {
        let canGenerate = !this.outputResourceIO.isBackedUp;
        if(canGenerate)
            this.generationTimer.update();
        if(this.generationTimer.triggered)
            this.outputResourceIO.isBackedUp = true;
    }

};

ResourceGenerator.prototype.render = function()
{
    const borderWidth = 6 * Math.min(1, (1 - this.generationTimer.value) * 10);
    Draw.rect(this.world, this.getLeftX(), this.getTopY(), this.width, this.height, this.backgroundColor);
    Draw.rect(this.world, this.getLeftX() + borderWidth, this.getTopY() + borderWidth, (this.width - 2 * borderWidth) * this.generationTimer.value, this.height - 2 * borderWidth, this.getResourceConfig().COLOR);
    this.outputResourceIO.render();
    Actor.prototype.render.call(this);
};

ResourceGenerator.prototype.getResourceConfig = function() { return this.resourceType == null ? null : ResourceConfig[this.resourceType]; };