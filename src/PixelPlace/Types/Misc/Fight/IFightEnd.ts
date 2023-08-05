interface IFightEnd {
    id: string,
    defended: false,
    ownedBy: string,
    ownedByGuild: string,
    previousOwner: string,
    fightType: number,
    points: number,
    stats: Object,
    total: { guilds: number, pixels: number, users: number },
    nextFight: number,
    canvas: number
}

export default IFightEnd;