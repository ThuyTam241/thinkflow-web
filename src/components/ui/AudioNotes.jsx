import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  Trash2,
} from "lucide-react";
import UploadIcon from "../../assets/icons/upload-icon.svg";
import RecordIcon from "../../assets/icons/record-icon.svg";
import PlayIcon from "../../assets/icons/play-icon.svg";
import PauseIcon from "../../assets/icons/pause-icon.svg";
import IconButton from "../ui/buttons/IconButton";
import TextArea from "./inputs/TextArea";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { audioExpandVariants } from "../../utils/motion";
import AudioItemSkeleton from "./skeleton/AudioItemSkeleton";
import {
  deleteAudioApi,
  getAudioApi,
  uploadAudioApi,
} from "../../services/api.service";
import FileUploadInput from "./inputs/FileUploadInput";
import notify from "./CustomToast";
import { MoonLoader } from "react-spinners";

const AudioNotes = ({ noteDetail, setNoteDetail }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isTranscripting, setIsTranscripting] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const { register, reset, getValues } = useForm();

  const handleUploadAudio = async (event) => {
    if (!event.target.files[0] || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    setIsUploading(true);
    const uploadRes = await uploadAudioApi(file, noteDetail.id);

    if (!uploadRes.data) {
      notify("error", "Upload audio failed", "", "var(--color-crimson-red)");
      setIsUploading(false);
      return;
    }

    const res = await getAudioApi(uploadRes.data);

    if (!res.data) {
      notify("error", "Get audio failed", "", "var(--color-crimson-red)");
      setIsUploading(false);
      return;
    }

    notify("success", "Audio uploaded", "", "var(--color-silver-tree)");
    const newAudioItem = {
      id: res.data.id,
      file_url: res.data.file_url,
      isPlaying: false,
      isExpanded: false,
      transcript: null,
      summary: null,
      duration: null,
    };
    setNoteDetail((prev) => ({
      ...prev,
      audio_note: [newAudioItem, ...prev.audio_note],
    }));

    setIsUploading(false);
  };

  const updateAudioDuration = (index, duration) => {
    setNoteDetail((prev) => ({
      ...prev,
      audio_note: prev.audio_note.map((audio, i) =>
        i === index ? { ...audio, duration } : audio,
      ),
    }));
  };

  const togglePlay = (index) => {
    setNoteDetail((prev) => ({
      ...prev,
      audio_note: prev.audio_note.map((audio, i) =>
        i === index ? { ...audio, isPlaying: !audio.isPlaying } : audio,
      ),
    }));
  };

  const toggleExpand = (index) => {
    setNoteDetail((prev) => ({
      ...prev,
      audio_note: prev.audio_note.map((audio, i) =>
        i === index ? { ...audio, isExpanded: !audio.isExpanded } : audio,
      ),
    }));
  };

  const handleDelete = async (audioId) => {
    const res = await deleteAudioApi(audioId);
    if (res.data) {
      notify("success", "Audio deleted!", "", "var(--color-silver-tree)");
      setNoteDetail((prev) => ({
        ...prev,
        audio_note: prev.audio_note.filter((audio) => audio.id !== audioId),
      }));
    } else {
      notify("error", "Delete audio failed", "", "var(--color-crimson-red)");
    }
  };

  const generateTranscript = (index) => {
    setNoteDetail((prev) => ({
      ...prev,
      audio_note: prev.audio_note.map((audio, i) =>
        i === index
          ? { ...audio, transcript: "This is a generated transcript from AI." }
          : audio,
      ),
    }));
  };

  const generateSummary = (index) => {
    setNoteDetail((prev) => ({
      ...prev,
      audio_note: prev.audio_note.map((audio, i) =>
        i === index
          ? {
              ...audio,
              summary: "This is a concise summary based on the transcript.",
            }
          : audio,
      ),
    }));
  };

  return (
    <div
      className={`flex flex-col gap-5 ${isUploading ? "pointer-events-none opacity-50" : ""}`}
    >
      <div className="ml-auto flex items-end gap-5">
        <IconButton src={RecordIcon} />
        <FileUploadInput
          src={UploadIcon}
          onChange={handleUploadAudio}
          accept="audio/*"
        />
      </div>

      <div
        id="scrollableAudioDiv"
        className="no-scrollbar relative flex max-h-[calc(100vh-402px)] flex-col gap-4 overflow-y-auto"
      >
        {isUploading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <MoonLoader size={40} color="var(--color-cornflower-blue)" />
          </div>
        )}
        {noteDetail.audio_note ? (
          <>
            {noteDetail.audio_note.map((audio, index) => (
              <div key={audio.id}>
                <audio
                  src={audio.file_url}
                  hidden
                  onLoadedMetadata={(e) => {
                    const duration = e.currentTarget.duration;
                    if (!audio.duration) updateAudioDuration(index, duration);
                  }}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconButton
                      src={audio.isPlaying ? PauseIcon : PlayIcon}
                      onClick={() => togglePlay(index)}
                    />

                    <div className="flex flex-col justify-between">
                      <h4 className="font-body text-ebony-clay text-base font-semibold">
                        Audio #{noteDetail.audio_note.length - index}
                      </h4>
                      <p className="font-body text-silver-chalice text-sm">
                        {`${Math.floor(audio.duration / 60)}:${String(Math.floor(audio.duration % 60)).padStart(2, "0")} mins`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <IconButton
                      size="w-5 h-5"
                      icon={audio.isExpanded ? ChevronUp : ChevronDown}
                      onClick={() => toggleExpand(index)}
                    />
                    <IconButton
                      size="w-5 h-5"
                      icon={Trash2}
                      onClick={() => handleDelete(audio.id)}
                    />
                  </div>
                </div>

                <motion.div
                  variants={audioExpandVariants}
                  initial="collapsed"
                  animate={audio.isExpanded ? "expanded" : "collapsed"}
                  className="overflow-hidden"
                >
                  <div className="border-t-gallery mt-4 border-t px-3 py-2">
                    {audio.transcript && (
                      <div className="py-2">
                        <IconButton
                          onClick={() => setShowTranscript(!showTranscript)}
                          icon={showTranscript ? ChevronUp : ChevronDown}
                          label="Transcript"
                          isProcessing={isTranscripting}
                        />
                        {showTranscript && (
                          <div className="mt-2">
                            <TextArea
                              style="text-gravel h-auto"
                              {...register("transcript")}
                              disabled={isTranscripting}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    {audio.summary && (
                      <div className="py-2">
                        <IconButton
                          onClick={() => setShowSummary(!showSummary)}
                          icon={showSummary ? ChevronUp : ChevronDown}
                          label="Summary"
                          isProcessing={isSummarizing}
                        />
                        {showSummary && (
                          <div>
                            <TextArea
                              {...register("summary")}
                              disabled={isSummarizing}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-2 flex h-max w-max gap-5">
                      {!audio.transcript && (
                        <IconButton
                          onClick={() => generateTranscript(index)}
                          size="w-5 h-5"
                          icon={FileText}
                          label={
                            audio.transcript
                              ? "Regenerate transcript"
                              : "Generate transcript"
                          }
                          isProcessing={isTranscripting}
                        />
                      )}
                      <IconButton
                        onClick={() => generateSummary(index)}
                        size="w-5 h-5"
                        icon={Sparkles}
                        label={
                          audio.summary
                            ? "Regenerate summary"
                            : "Generate summary"
                        }
                        isProcessing={isSummarizing}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </>
        ) : (
          <AudioItemSkeleton />
        )}
      </div>
    </div>
  );
};

export default AudioNotes;
