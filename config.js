const ResourceConfig =
{
    ISOPHINE:
    {
        COLOR: new Color(0, 255, 0),
        WIDTH: 20,
        HEIGHT: 20
    },
    METOSION:
    {
        COLOR: new Color(255, 0, 0),
        WIDTH: 30,
        HEIGHT: 30
    },
    ALTROSIA:
    {
        COLOR: new Color(0, 0, 255),
        WIDTH: 40,
        HEIGHT: 40
    }
};
const ResourceTypes = Object.keys(ResourceConfig);
const ResourceType = {};
ResourceTypes.forEach(o => ResourceType[o] = o);