function Game(x, y, world)
{
    Entity.call(this, x, y, world);
}
Game.prototype = Object.create(Entity.prototype);
Game.prototype.constructor = Game;

Game.prototype.update = function()
{

};

Game.prototype.render = function()
{

};