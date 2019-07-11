const ResourceConfig =
{
    ISOPHINE:
    {
        COLOR: new Color(0, 255, 0),
        GENERATION_DURATION: 1
    },
    METOSION:
    {
        COLOR: new Color(255, 0, 0),
        GENERATION_DURATION: 5
    },
    ALTROSIA:
    {
        COLOR: new Color(0, 0, 255),
        GENERATION_DURATION: 10
    }
};
const ResourceTypes = Object.keys(ResourceConfig);
const ResourceType = {};
ResourceTypes.forEach(o => ResourceType[o] = o);