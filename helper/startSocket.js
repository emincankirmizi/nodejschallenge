const redis = require("redis");
const user = require("../routers/user");
const subscriber = redis.createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
});

const client = redis.createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
});

client.on("connect", function () {
    console.log('Connected to Redis for Keys.');
    client.del("socketUsers", function (err, o) {
        console.log('Delete socketUsers')
    });
});


client.on("error", function (error) {
    console.log(error);
    process.exit(1);
});

subscriber.on("connect", function () {
    console.log('Connected to Redis for PUBSUB.');
});


subscriber.on("error", function (error) {
    console.log(error);
    process.exit(1);
});

const publisher = subscriber.duplicate();

let io
let socketUsers;

// karşılaştırma ile elementin olup olmadığına bakılıyor.
Array.prototype.inArray = function (comparer) {
    for (var i = 0; i < this.length; i++) {
        if (comparer(this[i])) return true;
    }
    return false;
};

// element yoksa array'e pushlanıyor. Birden çok oturum açmış kullanıcının çoğullanmaması için eklendi.
Array.prototype.pushIfNotExist = function (element, comparer) {
    if (!this.inArray(comparer)) {
        this.push(element);
    }
};

const initSocket = (serverInfo) => {
    io = require('socket.io')(serverInfo);
    subscriber.subscribe("newRegister");
    subscriber.subscribe("onlineUser");
    subscriber.subscribe("disconnectedUser");
    subscriber.on("message", (channel, message) => {
        console.log(channel, message);
        toAllClientsIo(channel, message);
    });

    io.on('connection', (socket) => {
        console.log('New user logged in.');

        socket.emit('welcome', 'this message for id');

        socket.on("set username", (username) => {
            console.log('Socket received user info.')
            socket.username = username;
            client.get('socketUsers', (err, rply) => {
                if (err) {
                    console.log(err)
                } else {
                    if (rply) {
                        socketUsers = JSON.parse(rply);
                        socketUsers.push(username)
                        setSocketUser(socketUsers);
                    } else {
                        socketUsers = [username];
                        setSocketUser(socketUsers);
                    }
                    if (getOccurrence(username.id) == 1) {
                        toAllClientsSocket('onlineUser', username);
                    }
                }
            })
        });

        getAllConnectedUsers(socket);

        socket.on('disconnect', () => {
            console.log('A user disconnect.');
            client.get('socketUsers', (err, rply) => {
                if (err) {
                    console.log(err)
                } else {
                    if (rply) {
                        socketUsers = JSON.parse(rply);
                        const index = socketUsers.findIndex(user => user.id === socket.username.id);
                        socketUsers.splice(index, 1);
                        setSocketUser(socketUsers);
                    }
                    if (getOccurrence(socket.username.id) == 0) {
                        toAllClientsSocket('disconnectedUser', socket.username);
                    }
                }
            })
        });
    });
}

// login ve logout sonrası socket'e bağlı aynı kullanıcı var mı diye kontrol ediliyor.
const getOccurrence = (userId) => {
    let count = 0;
    socketUsers.forEach(user => {
        if (user.id === userId) {
            count++;
        }
    });
    return count;
}


const setSocketUser = (socketUsers) => {
    client.set('socketUsers', JSON.stringify(socketUsers), (err, rply) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Updated Redis socket users.');
        }
    });
}

const getAllConnectedUsers = (socket) => {
    client.get('socketUsers', (err, rply) => {
        if (err) {
            console.log(err)
        } else {
            const users = [];
            if (rply) {
                const socketUsers = JSON.parse(rply);
                socketUsers.forEach(user => {
                    users.pushIfNotExist(user, (e) => {
                        return e.id === user.id && e.name === user.name;
                    });
                })
            }
            socket.emit('allOnlineUsers', users);
        }
    });
}

const toAllClientsSocket = (topic, message) => {
    publisher.publish(topic, JSON.stringify(message));
}

const toAllClientsIo = (topic, message) => {
    io.emit(topic, message)
}

module.exports = {
    initSocket,
    publisher
}