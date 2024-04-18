"use client"

import {Message} from "@/app/components/Room/Message";
import MessageInterface from "@/app/utils/interfaces/MessageInterface";
import InfiniteScroll from "react-infinite-scroll-component";
import React, {useCallback, useEffect, useState} from "react";
import {Loading} from "@/app/components/Loading";
import {Query} from "appwrite";
import Room from "@/app/utils/interfaces/RoomInterface";
import {client, database, databases} from "@/app/utils/appwrite";

interface MessageSectionProps {
    initialData: MessageInterface[],
    room: Room
}

export const MessageSection = ({ initialData, room } : MessageSectionProps ) => {

    const [ data, setData ] = useState( initialData );
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

        setData((prevMessages) => [...prevMessages, ...transformedMessages]);
        if (transformedMessages.length > 0) {
            setLastLoadedMessageId(transformedMessages[transformedMessages.length - 1].$id);
        } else {
            setHasMore(false);
        }
    }, [data, lastLoadedMessageId, room.$id]);

    useEffect(() => {
        if (initialData.length > 0) {
            setLastLoadedMessageId(initialData[initialData.length - 1].$id);
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

    console.info(data, hasMore, lastLoadedMessageId);

    return (
        <InfiniteScroll
            dataLength={data.length}
            next={fetchData}
            hasMore={hasMore}
            loader={<p className="text-center m-5">⏳&nbsp;Loading <Loading /></p>}
            endMessage={<p className="text-center m-5">-- END OF CONVERSATION --</p>}
            className={"flex flex-col-reverse gap-6 p-4"}
            scrollableTarget="scrollableDiv"
            inverse={true}
        >
            {
                data.map((message: MessageInterface, key: number) => (
                    <Message key={key} message={message} />
                ))
            }
        </InfiniteScroll>
    );
};