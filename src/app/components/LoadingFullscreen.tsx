import React, {useCallback} from "react";
import {Loading} from "@/app/components/Loading";

export const LoadingFullscreen = () => {

    return (
        <div className={"w-screen h-screen flex justify-center items-center text-center"}>
            <Loading />
        </div>
    );
};