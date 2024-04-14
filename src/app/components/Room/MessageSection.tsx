"use client"

import {Message} from "@/app/components/Room/Message";
import InfiniteScroll from "react-infinite-scroll-component";
import React, {useState} from "react";

interface MessageSectionProps {
    initialData: any
}

export const MessageSection = ({ initialData } : MessageSectionProps ) => {

    const [ data, setData ] = useState( initialData );
    const MAX_DATA = 50;
    const hasMore = data.length < MAX_DATA;

    function fetchData( limit=10 ){
        const start = data.length + 1;
        const end = (data.length + limit) >= MAX_DATA
            ? MAX_DATA
            : (data.length + limit);
        let newData = [ ...data ];

        for( var i = start ; i <= end ; i++ ) {
            newData = [ ...newData, i ];
        }

        // fake delay to simulate a time-consuming network request
        setTimeout( () => setData( newData ), 1500 );
    }

    return (
        <InfiniteScroll
            dataLength={data.length}
            next={fetchData}
            hasMore={hasMore}
            loader={<p className="text-center m-5">⏳&nbsp;Loading...</p>}
            endMessage={<p className="text-center m-5">That&apos;s all folks!🐰🥕</p>}
            className={"flex flex-col-reverse gap-6 p-4"}
            scrollableTarget="scrollableDiv"
            inverse={true}
        >
            {
                data.map((d: string | number) => (
                    // <div className="card mb-4" key={d} style={{width: "18rem"}}>
                    //     <div className="card-header">Card#{d}</div>
                    //     <div className="card-body">Lorem ipsum dolor sit amet</div>
                    // </div>
                    <Message key={d} own={true}/>
                ))
            }
        </InfiniteScroll>
    );
};