function ResourceBattery(x, y, game, resourceType)
{
    this.game = game;
    Actor.call(this, x, y, this.game.world, 120, 85);

    this.slotMargin = 6;
    this.rows = 3;
    this.columns = 3;
    this.max = this.rows * this.columns;

    this.resourceType = resourceType;
    this.amount = 0;

    this.color = new Color(80, 80, 80);

    let inputCount = 1;
    let outputCount = 3;
    this.outputIndex = 0; // the index of the output that will be considered first the next time a resource is ready

    this.inputResourceIOs = [];
    this.outputResourceIOs = [];

    const topBottomMargin = 10;
    const heightBetweenMargins = this.height - (topBottomMargin + ResourceIO.radius) * 2;
    for(let i = 0; i < inputCount; i++)
    {
        let x = -this.width/2;
        let y = -this.height/2 + topBottomMargin + ResourceIO.radius + heightBetweenMargins * (inputCount === 1 ? 0.5: i) / Math.max(1, inputCount - 1);
        let resourceIO = new ResourceIO(this, x, y, this.resourceType, IOType.INPUT);
        this.inputResourceIOs.push(resourceIO);
    }
    for(let i = 0; i < outputCount; i++)
    {
        let x = this.width/2;
        let y = -this.height/2 + topBottomMargin + ResourceIO.radius + heightBetweenMargins * (outputCount === 1 ? 0.5: i) / Math.max(1, outputCount - 1);
        let resourceIO = new ResourceIO(this, x, y, this.resourceType, IOType.OUTPUT);
        this.outputResourceIOs.push(resourceIO);
    }
}
ResourceBattery.prototype = Object.create(Actor.prototype);
ResourceBattery.prototype.constructor = ResourceBattery;

ResourceBattery.prototype.isFull = function() { return this.amount >= this.max; };

ResourceBattery.prototype.removed = function()
{
    this.inputResourceIOs.forEach(o => o.removed());
    this.outputResourceIOs.forEach(o => o.removed());
};

ResourceBattery.prototype.update = function()
{
    Actor.prototype.update.call(this);

    // TODO remove cheatcode
    if(this.world.keyboard.pressed['space'])
        this.addResource(1);

    this.inputResourceIOs.forEach(o => o.update());
    this.outputResourceIOs.forEach(o => o.update());

    for(let inputResourceIO of this.inputResourceIOs)
    {
        if(!inputResourceIO.isConnected() || !inputResourceIO.connectedResourceIO.isBackedUp)
            continue;

        if(this.amount < this.max)
        {
            this.addResource(1);
            inputResourceIO.connectedResourceIO.isBackedUp = false;
        }
    }

    let outputCount = this.outputResourceIOs.length;

    for(let i = 0; i < outputCount; i++)
    {
        let currentIndex = (this.outputIndex + i) % outputCount;
        let outputResourceIO = this.outputResourceIOs[currentIndex];
        if(outputResourceIO.isBackedUp)
            continue;

        if(this.amount >= 1)
        {
            this.addResource(-1);
            outputResourceIO.isBackedUp = true;
            this.outputIndex = currentIndex + 1;
        }
    }
};

ResourceBattery.prototype.render = function()
{
    Draw.rect(this.world, this.getLeftX(), this.getTopY(), this.width, this.height, this.color);

    this.inputResourceIOs.forEach(o => o.render());
    this.outputResourceIOs.forEach(o => o.render());

    if(this.amount > 0 && this.resourceType != null)
    {
        let rows = this.rows;
        let columns = this.columns;

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
                Resource.draw(this.world, this.getLeftX() + x + slotWidth/2, this.getTopY() + y + slotHeight/2, this.resourceType);
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