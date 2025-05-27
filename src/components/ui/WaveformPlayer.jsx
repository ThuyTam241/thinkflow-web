import { useWavesurfer } from "@wavesurfer/react";
import { useCallback, useEffect, useRef, useState } from "react";
import PlayIcon from "../../assets/icons/play-icon.svg";
import PauseIcon from "../../assets/icons/pause-icon.svg";
import IconButton from "./buttons/IconButton";

const WaveformPlayer = ({ audioUrl, audioTitle }) => {
  const containerRef = useRef(null);

  const [duration, setDuration] = useState(0);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    url: audioUrl,
    waveColor: "#dad7fc80",
    progressColor: "#6b76f6",
    height: 40,
    cursorColor: "#6b76f680",
    barWidth: 3,
    barRadius: 4,
  });

  useEffect(() => {
    if (!wavesurfer) return;

    const handleReady = () => {
      setDuration(wavesurfer.getDuration());
    };
    wavesurfer.on("ready", handleReady);

    return () => {
      wavesurfer.un("ready", handleReady);
    };
  }, [wavesurfer, audioUrl]);

  const onPlayPause = useCallback(() => {
    if (!wavesurfer) return;

    if (
      window.currentlyPlayingWave &&
      window.currentlyPlayingWave !== wavesurfer
    ) {
      window.currentlyPlayingWave.pause();
    }

    if (isPlaying) {
      wavesurfer.pause();
    } else {
      wavesurfer.play();
      window.currentlyPlayingWave = wavesurfer;
    }
  }, [wavesurfer, isPlaying]);

  const formatTime = (sec) =>
    `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

  return (
    <>
      <div className="flex items-center gap-3">
        <IconButton
          src={isPlaying ? PauseIcon : PlayIcon}
          onClick={onPlayPause}
        />

        <div className="flex flex-col gap-1">
          <h4 className="font-body text-ebony-clay text-base font-semibold">
            {audioTitle}
          </h4>
          {isPlaying ? (
            <div className="flex items-center gap-5">
              <p className="font-body text-silver-chalice text-sm whitespace-nowrap">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>
          ) : (
            <p className="font-body text-silver-chalice text-left text-sm">
              {formatTime(duration)} mins
            </p>
          )}
        </div>
      </div>

      <div
        className={`max-w-sm flex-grow ${isPlaying ? "" : "pointer-events-none opacity-0"}`}
        ref={containerRef}
      />
    </>
  );
};

export default WaveformPlayer;
