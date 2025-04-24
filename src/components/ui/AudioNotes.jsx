import { useState } from "react";
import UploadIcon from "../../assets/icons/upload-icon.svg";
import RecordIcon from "../../assets/icons/record-icon.svg";
import IconButton from "../ui/buttons/IconButton";
import { useForm } from "react-hook-form";
import AudioItemSkeleton from "./skeleton/AudioItemSkeleton";
import {
  deleteAudioApi,
  getAudioApi,
  uploadAudioApi,
} from "../../services/api.service";
import FileUploadInput from "./inputs/FileUploadInput";
import notify from "./CustomToast";
import { MoonLoader } from "react-spinners";
import AudioItem from "../layout/menu/AudioItem";
import AudioRecorderModal from "./popup/AudioRecorderModal";

const AudioNotes = ({ noteDetail, setNoteDetail }) => {
  const [showRecorder, setShowRecorder] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isTranscripting, setIsTranscripting] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

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
      transcript: null,
      summary: null,
    };
    setNoteDetail((prev) => ({
      ...prev,
      audio_note: [newAudioItem, ...prev.audio_note],
    }));

    setIsUploading(false);
  };

  const handleDelete = async (audioId) => {
    setIsDeleting(true);
    const res = await deleteAudioApi(audioId);
    setIsDeleting(false);
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
      className={`relative flex flex-col gap-4 ${isUploading || isDeleting ? "pointer-events-none opacity-50" : ""}`}
    >
      {showRecorder && (
        <AudioRecorderModal
          isOpen={showRecorder}
          setIsOpen={setShowRecorder}
          noteId={noteDetail.id}
          setNoteDetail={setNoteDetail}
          setIsUploading={setIsUploading}
        />
      )}

      <div className="ml-auto flex items-end gap-5">
        <IconButton src={RecordIcon} onClick={() => setShowRecorder(true)} />
        <FileUploadInput
          src={UploadIcon}
          onChange={handleUploadAudio}
          accept="audio/*"
        />
      </div>

      {isUploading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <MoonLoader size={30} color="var(--color-cornflower-blue)" />
        </div>
      )}

      <div className="no-scrollbar relative flex max-h-[calc(100vh-433px)] flex-col gap-[18px] overflow-y-auto">
        {noteDetail.audio_note ? (
          <>
            {noteDetail.audio_note.map((audio, index) => (
              <AudioItem
                key={audio.id}
                index={index}
                audio={audio}
                length={noteDetail.audio_note.length}
                handleDelete={handleDelete}
                register={register}
                generateTranscript={generateTranscript}
                generateSummary={generateSummary}
                isTranscripting={isTranscripting}
                isSummarizing={isSummarizing}
              />
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
