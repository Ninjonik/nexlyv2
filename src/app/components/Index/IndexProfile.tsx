"use client"

import {Avatar} from "@/app/components/Avatar";
import React from "react";
import Link from "next/link";

export const IndexProfile = () => {
    return (
        <div className={"-mt-8 relative w-full"}>
            <div className={"absolute right-0 top-0 mt-8"}>
                <div className="dropdown dropdown-end">
                    <button><Avatar/></button>
                    <ul tabIndex={0}
                        className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                        <li><Link href={"/register"}>Create new account</Link></li>
                        <li><Link href={"/login"}>Login</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};