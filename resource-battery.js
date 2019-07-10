function ResourceBattery(x, y, game)
{
    this.game = game;
    Actor.call(this, x, y, this.game.world, 40, 40);

    this.color = new Color(120, 120, 120);
    this.rows = 2;
    this.columns = 2;
    this.max = this.rows * this.columns;

    this.resourceType = null;
    this.amount = 0;

    this.inputResourceIO = new ResourceIO(this, -this.width/2, 0, 10, this.resourceType, IOType.INPUT);
    this.outputResourceIO = new ResourceIO(this, this.width/2, 0, 10, this.resourceType, IOType.OUTPUT);
}
ResourceBattery.prototype = Object.create(Actor.prototype);
ResourceBattery.prototype.constructor = ResourceBattery;

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
        this.addResource(1, ResourceType.ISOPHINE);

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
        let rows = this.rows;//Math.floor(Math.sqrt(this.max));
        let columns = this.columns;//Math.ceil(this.max / rows);

        let slotColor = this.getResourceConfig().COLOR;
        let slotMargin = 4;
        let slotWidth = (this.width - slotMargin * (1 + columns)) / columns;
        let slotHeight = (this.height - slotMargin * (1 + rows)) / rows;
        let remainingSlotsCharged = this.amount;
        for(let i = 0; i < rows; i++)
        {
            for(let j = 0; j < columns; j++)
            {
                let x = slotMargin + j * (slotWidth + slotMargin);
                let y = slotMargin + i * (slotHeight + slotMargin);
                Draw.rectLines(this.world, this.getLeftX() + x, this.getTopY() + y, slotWidth, slotHeight, "#222", 2);
                Draw.rect(this.world, this.getLeftX() + x, this.getTopY() + y, slotWidth, slotHeight, slotColor);
                remainingSlotsCharged--;
                if(remainingSlotsCharged <= 0)
                    continue;
            }
            if(remainingSlotsCharged <= 0)
                continue;
        }
    }

    Actor.prototype.render.call(this);
};

ResourceBattery.prototype.getResourceConfig = function() { return this.resourceType == null ? null : ResourceConfig[this.resourceType]; };

ResourceBattery.prototype.addResource = function(amount, resourceType)
{
    if(amount < 0)
        return false;

    if(this.amount <= 0)
    {
        this.amount = amount;
        this.resourceType = resourceType;
        this.inputResourceIO.setResourceType(resourceType);
        this.outputResourceIO.setResourceType(resourceType);
        return true;
    }

    if(this.resourceType !== resourceType)
        return false;

    if(this.amount >= this.max)
        return false;

    this.amount = Utils.clamp(this.amount + amount, 0, this.max);
    return true;
};