import prisma from "../../lib/prisma.js";

/**
 *
 * @param {{username: string, chatId: number}} data
 * @returns {id} id
 */
export async function GetLatestAllReadMessageId(data) {
    const lastReadMessages = await prisma.chatMember.findMany({
        where: { chatId: data.chatId },
        select: { lastReadMessageId: true },
    });
    lastReadMessages.sort((a, b) => a.lastReadMessageId - b.lastReadMessageId);
    return lastReadMessages[0].lastReadMessageId;
}
