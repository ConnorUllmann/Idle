function ResourceBattery(x, y, game, resourceType)
{
    this.game = game;
    Actor.call(this, x, y, this.game.world, 90, 75);

    this.slotMargin = 6;
    this.rows = 2;
    this.columns = 2;
    this.max = this.rows * this.columns;

    this.resourceType = resourceType;
    this.amount = 0;

    this.color = new Color(80, 80, 80);

    this.inputResourceIO = new ResourceIO(this, -this.width/2, 0, this.resourceType, IOType.INPUT);
    this.outputResourceIO = new ResourceIO(this, this.width/2, 0, this.resourceType, IOType.OUTPUT);
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

    if(this.inputResourceIO.isConnected() && this.inputResourceIO.connectedResourceIO.isBackedUp)
    {
        if(this.amount >= this.max)
        {
            if(!this.outputResourceIO.isBackedUp)
            {
                this.outputResourceIO.isBackedUp = true;
                this.inputResourceIO.connectedResourceIO.isBackedUp = false;
            }
        }
        else
        {
            this.addResource(1);
            this.inputResourceIO.connectedResourceIO.isBackedUp = false;
        }
    }

    if(!this.outputResourceIO.isBackedUp && this.outputResourceIO.isConnected())
    {
        if(this.amount >= 1)
        {
            this.addResource(-1);
            this.outputResourceIO.isBackedUp = true;
        }
    }

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
        let remainingSlotsCharged = this.amount;
        for(let i = 0; i < rows; i++)
        {
            for(let j = 0; j < columns; j++)
            {
                let x = this.width / 2 - columns / 2 * slotWidth - (columns - 1) / 2 * this.slotMargin + j * (slotWidth + this.slotMargin);
                let y = this.height / 2 - rows / 2 * slotHeight - (rows - 1) / 2 * this.slotMargin + i * (slotHeight + this.slotMargin);
                Resource.draw(this.world, this.getLeftX() + x + slotWidth/2, this.getTopY() + y + slotHeight/2, slotColor);
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