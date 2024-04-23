import {
    CarouselLayout, ConnectionStateToast, DisconnectButton, FocusLayout,
    FocusLayoutContainer,
    GridLayout,
    isTrackReference, LayoutContextProvider, ParticipantTile, RoomAudioRenderer, StartAudio,
    TrackReferenceOrPlaceholder, TrackToggle,
    useCreateLayoutContext, usePinnedTracks,
    useTracks,
    VideoConferenceProps,
    WidgetState
} from "@livekit/components-react";
import React from "react";
import {RoomEvent, Track} from "livekit-client";
import {isEqualTrackRef, isWeb} from "@livekit/components-core";

import Source = Track.Source;

interface ConferenceProps extends VideoConferenceProps {
    onDisconnectedFn: () => void
}

export default function VideoConference({
                                            chatMessageFormatter,
                                            chatMessageDecoder,
                                            chatMessageEncoder,
                                            SettingsComponent,
                                            onDisconnectedFn,
                                            ...props
                                        }: ConferenceProps) {
    const [widgetState, setWidgetState] = React.useState<WidgetState>({
        showChat: false,
        unreadMessages: 0,
        showSettings: false,
    });
    const lastAutoFocusedScreenShareTrack = React.useRef<TrackReferenceOrPlaceholder | null>(null);

    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false },
    );

    const widgetUpdate = (state: WidgetState) => {
        setWidgetState(state);
    };

    const layoutContext = useCreateLayoutContext();

    const screenShareTracks = tracks
        .filter(isTrackReference)
        .filter((track) => track.publication.source === Track.Source.ScreenShare);

    const focusTrack = usePinnedTracks(layoutContext)?.[0];
    const carouselTracks = tracks.filter((track) => !isEqualTrackRef(track, focusTrack));

    React.useEffect(() => {
        // If screen share tracks are published, and no pin is set explicitly, auto set the screen share.
        if (
            screenShareTracks.some((track) => track.publication.isSubscribed) &&
            lastAutoFocusedScreenShareTrack.current === null
        ) {
            layoutContext.pin.dispatch?.({ msg: 'set_pin', trackReference: screenShareTracks[0] });
            lastAutoFocusedScreenShareTrack.current = screenShareTracks[0];
        } else if (
            lastAutoFocusedScreenShareTrack.current &&
            !screenShareTracks.some(
                (track) =>
                    track.publication.trackSid ===
                    lastAutoFocusedScreenShareTrack.current?.publication?.trackSid,
            )
        ) {
            layoutContext.pin.dispatch?.({ msg: 'clear_pin' });
            lastAutoFocusedScreenShareTrack.current = null;
        }
    }, [
        screenShareTracks
            .map((ref) => `${ref.publication.trackSid}_${ref.publication.isSubscribed}`)
            .join(),
        focusTrack?.publication?.trackSid,
    ]);

    return (
        <div className="h-full w-full flex items-stretch" {...props}>
            {isWeb() && (
                <LayoutContextProvider
                    value={layoutContext}
                    // onPinChange={handleFocusStateChange}
                    onWidgetChange={widgetUpdate}
                >
                    <div className="flex flex-col h-full w-full">
                        {/* TODO: FIX TILES NOT BEING SHOWN FOR SOME REASON - !! they are not shown due to the onSubmit in RoomCall.tsx on <Prejoin /> !! */}
                        {!focusTrack ? (
                            <div className="grid-layout-wrapper flex items-center justify-center w-full h-full">
                                <GridLayout tracks={tracks}>
                                    <ParticipantTile />
                                </GridLayout>
                            </div>
                        ) : (
                            <div className="flex items-stretch justify-center w-full h-full">
                                <FocusLayoutContainer>
                                    <CarouselLayout tracks={carouselTracks}>
                                        <ParticipantTile />
                                    </CarouselLayout>
                                    {focusTrack && <FocusLayout trackRef={focusTrack} />}
                                </FocusLayoutContainer>
                            </div>
                        )}
                        <div className={"flex flex-row justify-center items-center gap-4 p-2"}>
                            <TrackToggle source={Source.Camera}/>
                            <TrackToggle source={Source.Microphone}/>
                            <TrackToggle source={Source.ScreenShare}/>
                            <DisconnectButton onClick={onDisconnectedFn}>Leave Room</DisconnectButton>
                            <StartAudio label={"Audio"}/>
                        </div>
                    </div>
                    {SettingsComponent && (
                        <div
                            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 p-3 bg-base-100 rounded-lg border border-base-200 shadow-lg min-w-1/2 min-h-1/2"
                            style={{ display: widgetState.showSettings ? 'block' : 'none' }}
                        >
                            <SettingsComponent />
                        </div>
                    )}
                </LayoutContextProvider>
            )}
            <RoomAudioRenderer />
            <ConnectionStateToast />
        </div>
    );

}