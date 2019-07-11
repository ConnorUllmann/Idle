function ResourceBattery(x, y, game, resourceType)
{
    this.game = game;
    Actor.call(this, x, y, this.game.world, 80, 60);

    this.slotMargin = 6;
    this.rows = 2;
    this.columns = 2;
    this.max = this.rows * this.columns;

    this.resourceType = resourceType;
    this.amount = 0;

    this.color = new Color(120, 120, 120);

    this.inputResourceIO = new ResourceIO(this, -this.width/2, 0, 8, this.resourceType, IOType.INPUT);
    this.outputResourceIO = new ResourceIO(this, this.width/2, 0, 8, this.resourceType, IOType.OUTPUT);
}
ResourceBattery.prototype = Object.create(Actor.prototype);
ResourceBattery.prototype.constructor = ResourceBattery;

ResourceBattery.prototype.isFull = function() { return this.amount >= this.max; };

ResourceBattery.prototype.removed = function()
{
    this.inputResourceIO.removed();
    this.outputResourceIO.removed();
};

ResourceBattery.prototype.update = function()
{
    Actor.prototype.update.call(this);

    // TODO remove cheatcode
    if(this.world.keyboard.pressed['space'])
        this.addResource(1);

    this.inputResourceIO.update();
    this.outputResourceIO.update();
};

ResourceBattery.prototype.render = function()
{
    Draw.rect(this.world, this.getLeftX(), this.getTopY(), this.width, this.height, this.color);

    this.inputResourceIO.render();
    this.outputResourceIO.render();

    if(this.amount > 0 && this.resourceType != null)
    {
        let rows = this.rows;
        let columns = this.columns;

        let slotColor = this.getResourceConfig().COLOR;
        let slotWidth = (this.width - this.slotMargin * (1 + columns)) / columns;
        let slotHeight = (this.height - this.slotMargin * (1 + rows)) / rows;
        slotWidth = slotHeight = Math.min(slotWidth, slotHeight);
        let slotRadius = 10; //slotWidth / 2;
        let remainingSlotsCharged = this.amount;
        for(let i = 0; i < rows; i++)
        {
            for(let j = 0; j < columns; j++)
            {
                let x = this.width / 2 - columns / 2 * slotWidth - (columns - 1) / 2 * this.slotMargin + j * (slotWidth + this.slotMargin);
                let y = this.height / 2 - rows / 2 * slotHeight - (rows - 1) / 2 * this.slotMargin + i * (slotHeight + this.slotMargin);
                Draw.circle(this.world, this.getLeftX() + x + slotWidth/2, this.getTopY() + y + slotHeight/2, slotRadius, slotColor);
                remainingSlotsCharged--;
                if(remainingSlotsCharged <= 0)
                    break;
            }
            if(remainingSlotsCharged <= 0)
                break;
        }
    }

    Actor.prototype.render.call(this);
};

ResourceBattery.prototype.getResourceConfig = function() { return this.resourceType == null ? null : ResourceConfig[this.resourceType]; };

ResourceBattery.prototype.addResource = function(amount)
{
    this.amount = Utils.clamp(this.amount + amount, 0, this.max);
};

ResourceBattery.prototype.tryReceiveInput = function(resourceIO)
{
    if(!this.canReceiveInput(resourceIO))
        return false;
    this.addResource(1);
    return true;
};

ResourceBattery.prototype.canReceiveInput = function(resourceIO)
{
    return !this.isFull();
};