const dummy = blogs => {
    return 1
}

const totalLikes = blogs => {
    return blogs.reduce((prevValue, currValue) => prevValue + currValue.likes, 0)
}

const favoriteBlog = blogs => {
    const mostliked = blogs.reduce((prevValue, currValue) => prevValue.likes > currValue.likes ? prevValue : currValue, {})

    delete mostliked._id
    delete mostliked.__v
    delete mostliked.url

    return mostliked
}

const mostBlogs = blogs => {
    const mostBlogs = blogs.reduce((prevValue, currValue) => {
        prevValue[currValue.author] = prevValue[currValue.author] ? prevValue[currValue.author] + 1 : 1
        return prevValue
    }, {})

    const author = Object.keys(mostBlogs).reduce((a, b) => mostBlogs[a] > mostBlogs[b] ? a : b, 0)

    return author === 0 ? {} : { author, blogs: mostBlogs[author] }
}

const mostLikes = blogs => {
    const mostLikes = blogs.reduce((prevValue, currValue) => {
        prevValue[currValue.author] = prevValue[currValue.author] ? prevValue[currValue.author] + currValue.likes : currValue.likes
        return prevValue
    }, {})

    const author = Object.keys(mostLikes).reduce((a, b) => mostLikes[a] > mostLikes[b] ? a : b, 0)

    return author === 0 ? {} : { author, blogs: mostLikes[author] }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}