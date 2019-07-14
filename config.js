const ResourceConfig =
{
    ISOPHINE:
    {
        COLOR: new Color(0, 255, 0),
        SIDES: 3,
        SPIN_RATE: 6,
        GENERATION_DURATION: 1
    },
    METOSION:
    {
        COLOR: new Color(255, 0, 0),
        SIDES: 4,
        SPIN_RATE: 4,
        GENERATION_DURATION: 5
    },
    ALTROSIA:
    {
        COLOR: new Color(0, 0, 255),
        SIDES: 5,
        SPIN_RATE: 2,
        GENERATION_DURATION: 10
    }
};
const ResourceTypes = Object.keys(ResourceConfig);
const ResourceType = {};
ResourceTypes.forEach(o => ResourceType[o] = o);