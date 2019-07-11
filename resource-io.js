ResourceIO.all = [];
ResourceIO.getMouseHoveringConnectableResourceIOWithResourceType = function(resourceIO)
{
    return ResourceIO.all.first(o => o.isMouseHovering() && o.resourceType === resourceIO.resourceType && o.canConnect(resourceIO));
};


function ResourceIO(parentEntity, xOffset, yOffset, radius, resourceType, ioType)
{
    this.parentEntity = parentEntity;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.radius = radius;
    this.resourceType = resourceType;
    this.ioType = ioType;
    this.connectedResourceIO = null;
    this.isBackedUp = false; //only able to be true for OUTPUT-type IOs

    ResourceIO.all.push(this);
}

ResourceIO.prototype.removed = function()
{
    this.disconnect();
    ResourceIO.all.removeThis(this);
};

ResourceIO.prototype.receiveTransferReadySignal = function()
{
    this.parentEntity.receiveTransferReadySignal(this);
};

// Output => Input communication
ResourceIO.prototype.tryTakeResource = function()
{
    if(!this.isBackedUp)
        return false;
    this.isBackedUp = false;
    return true;
};

ResourceIO.prototype.isIOMatch = function(resourceIO)
{
    return (this.ioType === IOType.INPUT  && resourceIO.ioType === IOType.OUTPUT)
        || (this.ioType === IOType.OUTPUT && resourceIO.ioType === IOType.INPUT);
};

ResourceIO.prototype.isConnected = function()
{
    return this.connectedResourceIO != null;
};

ResourceIO.prototype.canConnect = function(resourceIO)
{
    return resourceIO.resourceType === this.resourceType
        && !this.isConnected()
        && !resourceIO.isConnected()
        && this.isIOMatch(resourceIO);
};

ResourceIO.prototype.tryConnect = function(resourceIO)
{
    if(!this.canConnect(resourceIO))
        return false;
    this.connectedResourceIO = resourceIO;
    resourceIO.connectedResourceIO = this;
    return true;
};

ResourceIO.prototype.disconnect = function()
{
    if(!this.isConnected())
        return;
    this.connectedResourceIO.connectedResourceIO = null;
    this.connectedResourceIO = null;
};

ResourceIO.prototype.setResourceType = function(resourceType)
{
    if(this.resourceType !== resourceType)
        this.disconnect();
    this.resourceType = resourceType;
};

ResourceIO.prototype.getConnectedParent = function()
{
    return this.connectedResourceIO == null ? null : this.connectedResourceIO.parentEntity;
};

ResourceIO.prototype.getResourceConfig = function() { return this.resourceType == null ? null : ResourceConfig[this.resourceType]; };
ResourceIO.prototype.getX = function() { return this.parentEntity.x + this.xOffset; };
ResourceIO.prototype.getY = function() { return this.parentEntity.y + this.yOffset; };

ResourceIO.prototype.update = function()
{
    let mouse = this.parentEntity.world.mouse;
    if(this.isMouseHovering())
    {
        if(mouse.rightPressed)
        {
            this.parentEntity.game.mouseSelectedResourceIO = this;
            this.disconnect();
        }
        else if(mouse.rightReleased)
        {
            if(this.parentEntity.game.mouseSelectedResourceIO != null)
            {
                this.tryConnect(this.parentEntity.game.mouseSelectedResourceIO);
                this.parentEntity.game.mouseSelectedResourceIO = null;
            }
        }
    }

    // instanceof is used to only spit out resources from the outputs of machines that can't keep them (e.g. transformers)
    if(!this.isConnected() && this.ioType === IOType.OUTPUT && this.isBackedUp
        && this.parentEntity instanceof ResourceTransformer)
    {
        this.isBackedUp = false;
        new Resource(this.getX() + 10, this.getY(), this.parentEntity.game, this.resourceType);
    }
};

ResourceIO.prototype.render = function()
{
    const x = this.getX();
    const y = this.getY();
    const isConnected = this.isConnected();
    const isMouseSelected = this.isMouseSelected();
    const resourceConfig = this.getResourceConfig();
    const resourceColor = resourceConfig == null ? "#222" : resourceConfig.COLOR;
    const backgroundColor = isMouseSelected ? "#ddd" : (this.isMouseHovering() ? "#fff" : (isConnected ? resourceColor : "#000"));

    if(this.isBackedUp)
    {
        Draw.circle(this.parentEntity.world, x, y, this.radius + 4, "#808");
    }

    if(this.ioType === IOType.INPUT)
    {
        Draw.circle(this.parentEntity.world, x, y, this.radius, backgroundColor);
        Draw.circle(this.parentEntity.world, x, y, this.radius / 4, resourceColor);
        Draw.circleOutline(this.parentEntity.world, x, y, this.radius, resourceColor, 3);
    }
    else
    {
        Draw.circle(this.parentEntity.world, x, y, this.radius, resourceColor);
        Draw.circle(this.parentEntity.world, x, y, this.radius / 3, backgroundColor);
        //Draw.circleOutline(this.parentEntity.world, x, y, this.radius, backgroundColor, 3);
    }
    
    if(isConnected && this.ioType === IOType.INPUT)
    {
        Draw.line(this.parentEntity.world, x, y, this.connectedResourceIO.getX(), this.connectedResourceIO.getY(), resourceColor, 6);
    }
    else if(isMouseSelected)
    {
        let xDestination = this.parentEntity.world.mouse.x;
        let yDestination = this.parentEntity.world.mouse.y;
        let mouseHoveringResourceIO = ResourceIO.getMouseHoveringConnectableResourceIOWithResourceType(this);
        if(mouseHoveringResourceIO != null)
        {
            xDestination = mouseHoveringResourceIO.getX();
            yDestination = mouseHoveringResourceIO.getY();
        }
        Draw.line(this.parentEntity.world, x, y, xDestination, yDestination, resourceColor, 6);
    }
};

ResourceIO.prototype.isMouseHovering = function()
{
    let xMouse = this.parentEntity.world.mouse.x;
    let yMouse = this.parentEntity.world.mouse.y;
    return Utils.distanceSq(this.getX(), this.getY(), xMouse, yMouse) <= this.radius * this.radius;
};

ResourceIO.prototype.isMouseSelected = function() { return this === this.parentEntity.game.mouseSelectedResourceIO; };