import {Message} from "@/app/components/Room/Message";
import MessageInterface from "@/app/utils/interfaces/MessageInterface";
import InfiniteScroll from "react-infinite-scroll-component";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {Loading} from "@/app/components/Loading";
import {Query} from "appwrite";
import Room from "@/app/utils/interfaces/RoomInterface";
import {client, database, databases} from "@/app/utils/appwrite";
import {PhotoProvider} from "react-photo-view";

interface MessageSectionProps {
    messages: MessageInterface[],
    setMessages: React.Dispatch<React.SetStateAction<MessageInterface[]>>
    temporaryMessage: MessageInterface | null,
    setTemporaryMessage: React.Dispatch<React.SetStateAction<MessageInterface | null>>
    room: Room
}

export const MessageSection = ({ messages, setMessages, room, temporaryMessage, setTemporaryMessage } : MessageSectionProps ) => {

    const lastLoadedMessageId = useRef<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const fetchData = useCallback(async ( limit: number = 10 ) => {
        let query = [Query.equal('room', room.$id), Query.orderDesc("$updatedAt"), Query.limit(limit)];
        if (lastLoadedMessageId?.current) {
            query.push(Query.cursorAfter(lastLoadedMessageId.current))
        }

        const fetchedMessage = await databases.listDocuments(
            database,
            'messages',
            query
        );
        const transformedMessages = fetchedMessage.documents as MessageInterface[];

        setMessages((prevMessages) => [...transformedMessages, ...prevMessages,]);
        if (transformedMessages.length > 0) {
            lastLoadedMessageId.current = transformedMessages[transformedMessages.length - 1].$id
            setHasMore(true);
        } else {
            console.info("TRANSFORMED MESSAGES: ", transformedMessages)
            console.info("QUERY: ", query)
            console.info("SETHASMORE: FALSE | TRANSFORMEED MESSAGES LENGTH: ", transformedMessages.length)
            setHasMore(false);
        }
    }, [room, setMessages]);

    useEffect(() => {
        const unsubscribe = client.subscribe(`databases.${database}.collections.messages.documents`, response => {
            // Check if a new message was created (message from other groups will not be shown since user doesn't have the permissions to even see them - no need to take care of this)
            if(response.events.includes("databases.*.collections.messages.documents.*.create")){
                const newMessagePayload = response.payload as MessageInterface
                console.info("NEW MESSAGE: ", newMessagePayload)
                if(temporaryMessage && temporaryMessage.author.$id === newMessagePayload.author.$id && temporaryMessage.message === newMessagePayload.message) setTemporaryMessage(null);
                setMessages((prevMessages) => [newMessagePayload, ...prevMessages]);
            }
        });

        return () => {
            unsubscribe();
        }

    }, [temporaryMessage]);

    useEffect(() => {
        if (messages.length > 0) {
            lastLoadedMessageId.current = messages[messages.length - 1].$id
            setHasMore(true);
        } else {
            console.info("SETHASMORE: FALSE | MESSAGES LENGTH: ", messages.length)
            setHasMore(false);
        }

        fetchData();
    }, []);

    console.info("MESSAGESs: ", messages, "HASMORE: ", hasMore, "LAST LOADED MESSAGE ID:", lastLoadedMessageId);

    return (
        <InfiniteScroll
            dataLength={messages.length}
            next={fetchData}
            hasMore={hasMore}
            loader={<p className="text-center m-5"><Loading /></p>}
            endMessage={<p className="text-center m-5">-- END OF CONVERSATION --</p>}
            className={"flex flex-col-reverse gap-6 p-4"}
            scrollableTarget="scrollableDiv"
            inverse={true}
        >
            <PhotoProvider>
            { temporaryMessage && (
                <Message message={temporaryMessage} temporary={true} />
            )}
            {
                messages.map((message: MessageInterface, key: number) => (
                    <Message key={key} message={message} />
                ))
            }
            </PhotoProvider>
        </InfiniteScroll>
    );
};