export default function LoadingRoom () {

    return (
        <main className={"h-full w-full grid grid-cols-9 grid-rows-12 text-base-content"}>
            <header className={"col-span-7 bg-base-100 row-span-1 flex justify-between py-2 px-8"}>
                <div className={"flex flex-row justify-center items-center gap-4"}>
                    <div className={`avatar`}>
                        <div className="w-16 mask mask-squircle bg-base-300">
                        </div>
                    </div>
                    <div className={"flex flex-col justify-start gap-2"}>
                        <h1 className={"h-6 w-64 bg-base-300 animate-pulse rounded-lg"}></h1>
                        <h3 className={"h-6 w-24 bg-base-300 animate-pulse rounded-lg"}></h3>
                    </div>
                </div>
            </header>

            <aside className={"col-span-2 row-span-1 bg-base-100 flex justify-end py-2 pr-8"}>
                <div className={"flex flex-row justify-end gap-4"}>
                </div>
            </aside>

            <main className={"flex flex-col row-span-12 col-span-7 justify-between bg-base-200"}>
                <section
                    className={"bg-base-200 border-t-2 border-primary flex flex-col-reverse gap-6 p-4 overflow-hidden"}
                    id="scrollableDiv">
                    <div className={"flex flex-col-reverse gap-6 p-4 w-full"}>
                        {Array.from(Array(10).keys()).map((number) => (
                            <div className={`flex flex-row w-1/2 gap-4 place-self-start animate-pulse`} key={number}>
                                <div className={`avatar`}>
                                    <div className="w-16 mask mask-squircle bg-base-300">
                                    </div>
                                </div>
                                <div className={`flex flex-col w-full gap-1`}>
                                    <div className={"flex flex-row items-baseline text-center gap-2"}>
                                        <span className={`text-2xl font-bold w-16 bg-base-300 h-6 rounded-lg`}></span>
                                        <span className={"w-24 bg-base-300 h-6 rounded-lg"}></span>
                                    </div>
                                    <div className={`rounded-lg bg-base-300 w-full h-8 p-1`}>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className={"bg-base-100 flex w-full p-2"}>
                    <div className={"w-full flex justify-between bg-base-300 rounded-lg animate-pulse px-2 py-1"}>
                        <div className={"flex justify-center items-center"}>
                            <div className={"w-8 h-8 rounded-full bg-base-300"}></div>
                        </div>
                    </div>
                </footer>
            </main>

            <aside className={"row-span-11 col-span-2 bg-base-100 border-t-2 border-primary flex flex-col gap-8 p-8"}>
                <h2 className={"font-bold text-3xl h-6 w-64 bg-base-300 animate-pulse rounded-lg"}></h2>

                <div className={"flex flex-col gap-4"}>
                    <div className={"flex flex-row justify-between items-center"}>
                        <h3 className={"h-6 w-24 bg-base-300 animate-pulse rounded-lg"}></h3>
                    </div>

                    <div className={"flex flex-col gap-3"}>
                        {Array.from(Array(5).keys()).map((number) => (
                            <div className={"flex flex-row items-center gap-2 animate-pulse"} key={number}>
                                <div className={`avatar`}>
                                    <div className="w-16 mask mask-squircle bg-base-300">
                                    </div>
                                </div>
                                <div className={`rounded-lg bg-base-300 w-full h-8 p-1`}>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </aside>

        </main>
    );
}