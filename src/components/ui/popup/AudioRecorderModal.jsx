import { useState, useRef, useEffect, useMemo } from "react";
import StartRecording from "../../../assets/images/start-recording.svg";
import StopRecording from "../../../assets/images/stop-recording.svg";
import VoiceRecorder from "../../../assets/images/voice-recorder.svg";
import IconButton from "../buttons/IconButton";
import { Check, X, XCircle } from "lucide-react";
import { getAudioApi, uploadAudioApi } from "../../../services/api.service";
import { useWavesurfer } from "@wavesurfer/react";
import WaveformPlayer from "../WaveformPlayer";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import notify from "../CustomToast";

const AudioRecorderModal = ({
  isOpen,
  setIsOpen,
  noteId,
  setNoteDetail,
  setIsUploading,
}) => {
  const modalRef = useRef(null);
  const micContainerRef = useRef(null);
  const [seconds, setSeconds] = useState(0);
  const timerIntervalRef = useRef(null);
  const [recordPlugin, setRecordPlugin] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const { wavesurfer } = useWavesurfer({
    container: micContainerRef,
    height: 40,
    waveColor: "#dad7fc80",
    progressColor: "#6b76f6",
    cursorColor: "#6b76f680",
    barWidth: 0.5,
    barRadius: 2,
    plugins: useMemo(() => [], []),
  });

  useEffect(() => {
    if (wavesurfer) {
      const record = RecordPlugin.create();
      wavesurfer.registerPlugin(record);
      setRecordPlugin(record);

      record.on("record-start", () => {
        setSeconds(0);
        timerIntervalRef.current = setInterval(() => {
          setSeconds((prev) => prev + 1);
        }, 1000);
      });

      record.on("record-end", (blob) => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        const url = URL.createObjectURL(blob);
        const newRecording = {
          blob,
          url,
        };
        setRecordings((prev) => [newRecording, ...prev]);
      });

      return () => {
        record.destroy();
      };
    }
  }, [wavesurfer]);

  const handleRecording = async () => {
    if (!recordPlugin) return;
    if (recordPlugin.isRecording()) {
      recordPlugin.stopRecording();
      setIsRecording(false);
    } else {
      recordPlugin.startRecording();
      setIsRecording(true);
    }
  };

  const handleSave = async () => {
    setIsOpen(false);
    setIsUploading(true);

    for (const recording of recordings) {
      const file = new File([recording.blob], "audio.webm", {
        type: recording.blob.type,
      });
      const uploadRes = await uploadAudioApi(file, noteId);

      if (!uploadRes.data) {
        notify("error", "Upload audios failed", "", "var(--color-crimson-red)");
        setIsUploading(false);
        return;
      }

      const res = await getAudioApi(uploadRes.data);

      if (!res.data) {
        notify("error", "Get audio failed", "", "var(--color-crimson-red)");
        setIsUploading(false);
        return;
      }

      notify("success", "Audios uploaded", "", "var(--color-silver-tree)");
      const newAudioItem = {
        id: res.data.id,
        file_url: res.data.file_url,
        transcript: null,
        summary: null,
      };
      setNoteDetail((prev) => ({
        ...prev,
        audio_note: [newAudioItem, ...prev.audio_note],
      }));
    }

    handleCancel();
    setIsUploading(false);
  };

  const handleCancel = () => {
    recordings.forEach((rec) => URL.revokeObjectURL(rec.url));
    setRecordings([]);
  };

  const handleRemove = (indexToRemove) => {
    setRecordings((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="flex w-[90%] max-w-md flex-col items-center gap-6 rounded-lg bg-white p-10 text-center shadow-lg dark:bg-[#16163B]"
      >
        <h1 className="font-body text-ebony-clay text-xl font-bold">
          Voice Recorder
        </h1>

        <div
          className={`${isRecording ? "animate-ping-multi" : ""} border-cornflower-blue/50 rounded-full border-8`}
        >
          <img src={VoiceRecorder} alt="voice-recorder" />
        </div>

        <h2 className="font-body text-ebony-clay text-2xl font-semibold">
          {formatTime(seconds)}
        </h2>
        <div ref={micContainerRef} className="w-full"></div>
        {recordings && recordings.length > 0 && (
          <div className="no-scrollbar divide-gallery flex max-h-[153px] w-full flex-col divide-y overflow-hidden overflow-y-auto">
            {recordings.map((recording, index) => (
              <div key={index} className="flex items-center gap-6 py-3.5">
                <WaveformPlayer
                  audioUrl={recording.url}
                  length={recordings.length}
                  index={index}
                />

                <div className="ml-auto">
                  <IconButton
                    icon={XCircle}
                    customStyle="text-silver-chalice stroke-[1.5]"
                    onClick={() => handleRemove(index)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-2 flex w-full items-center justify-between">
          <IconButton
            icon={X}
            size="w-8 h-8"
            customStyle="text-cornflower-blue stroke-2"
            onClick={handleCancel}
          />
          <IconButton
            src={isRecording ? StopRecording : StartRecording}
            onClick={handleRecording}
          />
          <IconButton
            icon={Check}
            size="w-8 h-8"
            customStyle="text-cornflower-blue stroke-2"
            onClick={handleSave}
            isProcessing={!(recordings.length > 0)}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioRecorderModal;
