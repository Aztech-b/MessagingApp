export const EVENT = {
    CHAT: {
        CREATE: "chat:create",
        CREATED: "chat:created",
        DELETE: "chat:delete",
        DELETED: "chat:deleted",
        JOIN: "chat:join",
        LEAVE: "chat:leave",
        ERROR: "chat:error",
    },

    MESSAGE: {
        SEND: "message:send",
        RECEIVED: "message:received",
        READ: "message:read",
        EVERYONE_READ: "message:everyoneRead",
    },

    USER: { JOIN: "user:join", LEAVE: "user:leave" },
};
