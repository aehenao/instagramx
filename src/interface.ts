interface Variables {
    id: number,
    after: string,
    first: number
}

interface QueryHash {
    followers: string,
    following: string
}

export {
    Variables,
    QueryHash
}