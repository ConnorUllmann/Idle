const ResourceConfig =
{
    ISOPHINE:
    {
        COLOR: new Color(0, 255, 0),
        SIDES: 3,
        SPIN_RATE: 6,
        GENERATION_DURATION: 4
    },
    METOSION:
    {
        COLOR: new Color(255, 0, 0),
        SIDES: 4,
        SPIN_RATE: 4,
        GENERATION_DURATION: 8
    },
    ALTROSIA:
    {
        COLOR: new Color(20, 20, 255),
        SIDES: 5,
        SPIN_RATE: 2,
        GENERATION_DURATION: 16
    },
    OBERNINE:
    {
        COLOR: new Color(0, 255, 255),
        SIDES: 6,
        SPIN_RATE: 1,
        GENERATION_DURATION: 32
    },
    EINORITE:
    {
        COLOR: new Color(255, 0, 255),
        SIDES: 7,
        SPIN_RATE: 0.5,
        GENERATION_DURATION: 64
    }
};
const ResourceTypes = Object.keys(ResourceConfig);
const ResourceType = {};
ResourceTypes.forEach(o => ResourceType[o] = o);