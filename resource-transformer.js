// inputResourceTypes = {
//     ISOPHINE: 2,
//     METOSION: 1
// };
// outputResourceTypes = {
//     ALTROSIA: 2
// };

function ResourceTransformer(x, y, world, inputResourceTypes, outputResourceTypes)
{
    this.color = new Color(255, 255, 0);

    const inputResourceTypeList = this.linearize(inputResourceTypes);
    const outputResourceTypeList = this.linearize(outputResourceTypes);

    this.resourceIORadius = 8;
    this.topBottomMargin = 10;
    let inputsOutputsMargin = 20;
    let width = this.resourceIORadius * 2 + inputsOutputsMargin;
    let height = this.topBottomMargin + (this.resourceIORadius * 2 + this.topBottomMargin) * Math.max(inputResourceTypeList.length, outputResourceTypeList.length);
    Actor.call(this, x, y, world, width, height);

    const xLeft = this.getLeftX();
    const xRight = this.getRightX();
    const yTop = this.getTopY();

    this.inputResourceIOs = [];
    this.outputResourceIOs = [];

    const heightBetweenMargins = this.height - (this.topBottomMargin + this.resourceIORadius) * 2;
    for(let i = 0; i < inputResourceTypeList.length; i++)
    {
        let resourceType = inputResourceTypeList[i];
        let x = xLeft;
        let y = yTop + this.topBottomMargin + this.resourceIORadius + heightBetweenMargins * i / (inputResourceTypeList.length - 1);
        let resourceIO = new ResourceIO(this, x - this.x, y - this.y, this.resourceIORadius, resourceType, IOType.INPUT);
        this.inputResourceIOs.push(resourceIO);
    }
    for(let i = 0; i < outputResourceTypeList.length; i++)
    {
        let resourceType = outputResourceTypeList[i];
        let x = xRight;
        let y = yTop + this.topBottomMargin + this.resourceIORadius + heightBetweenMargins * i / (outputResourceTypeList.length - 1);
        let resourceIO = new ResourceIO(this, x - this.x, y - this.y, this.resourceIORadius, resourceType, IOType.OUTPUT);
        this.outputResourceIOs.push(resourceIO);
    }
}
ResourceTransformer.prototype = Object.create(Actor.prototype);
ResourceTransformer.prototype.constructor = ResourceTransformer;

ResourceTransformer.prototype.removed = function()
{
    for(let resourceIO of this.inputResourceIOs)
        resourceIO.removed();
    for(let resourceIO of this.outputResourceIOs)
        resourceIO.removed();
};

ResourceTransformer.prototype.linearize = function(intMap)
{
    let list = [];
    for(let key in intMap)
    {
        for(let i = 0; i < intMap[key]; i++)
            list.push(key);
    }
    return list;
};

ResourceTransformer.prototype.update = function()
{
    Actor.prototype.update.call(this);

    for(let resourceIO of this.inputResourceIOs)
        resourceIO.update();
    for(let resourceIO of this.outputResourceIOs)
        resourceIO.update();
};

ResourceTransformer.prototype.render = function()
{
    const xLeft = this.getLeftX();
    const yTop = this.getTopY();

    Draw.rect(this.world, xLeft, yTop, this.width, this.height, this.color);
    Draw.rectLines(this.world, xLeft, yTop, this.width, this.height, "#fff", 3);

    for(let resourceIO of this.inputResourceIOs)
        resourceIO.render();
    for(let resourceIO of this.outputResourceIOs)
        resourceIO.render();

    Actor.prototype.render.call(this);
};