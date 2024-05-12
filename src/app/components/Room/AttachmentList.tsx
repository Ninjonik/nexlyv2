import {getFileDataResult} from "@/app/utils/getFileData";
import {PhotoView} from "react-photo-view";
import {DefaultExtensionType, defaultStyles, FileIcon} from "react-file-icon";
import {Anchor} from "@/app/components/Anchor";
import {AiOutlineDownload} from "react-icons/ai";
import getFileDownload from "@/app/utils/getFileDownloadLink";
import React from "react";
import Image from "next/image";

export const AttachmentList = ({attachmentsData, own}: {attachmentsData: getFileDataResult[], own: boolean}) => {

        return (
            <div className={"flex flex-col gap-2"}>
                {attachmentsData && attachmentsData.map(({preview, file, extension}, index) => (
                    <div key={file?.$id} className={"max-h-96 max-w-96 relative lg:pr-16 h-96 w-96"}>
                        {preview && file && extension && (
                            <>
                                {["image/jpg", "image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp"].includes(file.mimeType) ? (
                                    <PhotoView key={file.$id + index} src={preview}>
                                        <Image
                                            className={`rounded-b-lg ease-in ${own ? "rounded-l-md bg-primary text-base-100" : "rounded-r-md bg-base-300 text-left"}`}
                                            alt={file.name}
                                            src={preview}
                                            fill={true}
                                        />
                                    </PhotoView>
                                ) : (
                                    <FileIcon
                                        extension={extension} {...(defaultStyles[extension as DefaultExtensionType] || defaultStyles.png)} />
                                )}
                                <div className={"bottom-0 right-0 absolute"}>
                                    <Anchor title={"Download the file"} hideTitle={true} icon={<AiOutlineDownload/>}
                                            href={getFileDownload("attachments", file?.$id)} download={true}/>
                                </div>
                            </>

                        )}

                    </div>
                ))
                }
            </div>
        );
}