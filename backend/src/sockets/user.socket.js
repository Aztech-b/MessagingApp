function registerUserSockets(io, socket) {
    socket.on("joinUser", (data) => {
        socket.join(`user:${data.username}`);
    });

    socket.on("leaveUser", (data) => {
        socket.leave(`user:${data.username}`);
    });
}

export default registerUserSockets;
