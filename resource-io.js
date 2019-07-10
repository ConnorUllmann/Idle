ResourceIO.all = [];
ResourceIO.getMouseSelectedResourceIOWithResourceType = function(resourceType)
{
    return ResourceIO.all.first(resourceIO => resourceIO.isMouseSelected && resourceIO.resourceType === resourceType);
};
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

    this.isMouseSelected = false;

    ResourceIO.all.push(this);
}

ResourceIO.prototype.removed = function()
{
    ResourceIO.all.removeThis(this);
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
            this.isMouseSelected = true;
        }
        else if(mouse.rightReleased)
        {
            let mouseSelectedResourceIO = ResourceIO.getMouseSelectedResourceIOWithResourceType(this.resourceType);
            if(mouseSelectedResourceIO != null)
            {
                if(this.tryConnect(mouseSelectedResourceIO))
                {
                    this.isMouseSelected = false;
                    this.connectedResourceIO.isMouseSelected = false;
                }
            }
        }
    }

    if(mouse.rightReleased)
    {
        if(this.isMouseSelected)
            this.disconnect();
        this.isMouseSelected = false;
    }
};

ResourceIO.prototype.render = function()
{
    const x = this.getX();
    const y = this.getY();
    const connected = this.isConnected();
    const resourceConfig = this.getResourceConfig();
    const resourceColor = resourceConfig == null ? "#222" : resourceConfig.COLOR;
    const backgroundColor = this.isMouseSelected ? "#ddd" : (this.isMouseHovering() ? "#fff" : (connected ? resourceColor : "#000"));
    Draw.circle(this.parentEntity.world, x, y, this.radius, backgroundColor);
    Draw.circleOutline(this.parentEntity.world, x, y, this.radius, resourceColor, 3);
    
    if(connected && this.ioType === IOType.INPUT)
    {
        Draw.line(this.parentEntity.world, x, y, this.connectedResourceIO.getX(), this.connectedResourceIO.getY(), resourceColor, 6);
    }
    else if(this.isMouseSelected)
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