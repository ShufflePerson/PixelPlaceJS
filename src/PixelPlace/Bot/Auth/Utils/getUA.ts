import randomua from 'random-useragent'

export default ((): string => {
    return randomua.getRandom()
})