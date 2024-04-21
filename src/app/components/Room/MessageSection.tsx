import {Message} from "@/app/components/Room/Message";
import MessageInterface from "@/app/utils/interfaces/MessageInterface";
import InfiniteScroll from "react-infinite-scroll-component";
import React, {useCallback, useEffect, useState} from "react";
import {Loading} from "@/app/components/Loading";
import {Query} from "appwrite";
import Room from "@/app/utils/interfaces/RoomInterface";
import {client, database, databases} from "@/app/utils/appwrite";

interface MessageSectionProps {
    messages: MessageInterface[],
    setMessages: React.Dispatch<React.SetStateAction<MessageInterface[]>>
    room: Room
}

export const MessageSection = ({ messages, setMessages, room } : MessageSectionProps ) => {

    const [lastLoadedMessageId, setLastLoadedMessageId ] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const fetchData = useCallback(async ( limit: number = 10 ) => {
        let query = [Query.equal('room', room.$id), Query.orderDesc("$updatedAt"), Query.limit(limit)];
        if (lastLoadedMessageId) {
            query.push(Query.cursorAfter(lastLoadedMessageId))
        }

        const fetchedMessage = await databases.listDocuments(
            database,
            'messages',
            query
        );
        const transformedMessages = fetchedMessage.documents as MessageInterface[];
        console.info("Transformed messages", transformedMessages)

        setMessages((prevMessages) => [...transformedMessages, ...prevMessages,]);
        if (transformedMessages.length > 0) {
            setLastLoadedMessageId(transformedMessages[transformedMessages.length - 1].$id);
        } else {
            setHasMore(false);
        }
    }, [messages, lastLoadedMessageId, room.$id]);

    useEffect(() => {
        if (messages.length > 0) {
            setLastLoadedMessageId(messages[messages.length - 1].$id);
        } else {
            setHasMore(false);
        }
        fetchData();

        const unsubscribe = client.subscribe(`databases.${database}.collections.messages.documents`, response => {
            // Callback will be executed on changes for all files.
            console.log(response);
            console.log(response.events);
        });

        return () => {
            unsubscribe();
        }

    }, []);

    console.info(messages, hasMore, lastLoadedMessageId);

    return (
        <InfiniteScroll
            dataLength={messages.length}
            next={fetchData}
            hasMore={hasMore}
            loader={<p className="text-center m-5">⏳&nbsp;Loading <Loading /></p>}
            endMessage={<p className="text-center m-5">-- END OF CONVERSATION --</p>}
            className={"flex flex-col-reverse gap-6 p-4"}
            scrollableTarget="scrollableDiv"
            inverse={true}
        >
            {
                messages.map((message: MessageInterface, key: number) => (
                    <Message key={key} message={message} />
                ))
            }
        </InfiniteScroll>
    );
};