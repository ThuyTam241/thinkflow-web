import { useState } from "react";
import UploadIcon from "../../assets/icons/upload-icon.svg";
import RecordIcon from "../../assets/icons/record-icon.svg";
import IconButton from "../ui/buttons/IconButton";
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
import { Tooltip } from "react-tooltip";
import ConfirmDialog from "./popup/ConfirmDialog";

const AudioNotes = ({ noteDetail, setNoteDetail, permission }) => {
  const [showRecorder, setShowRecorder] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedAudioId, setSelectedAudioId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      name: res.data.name,
      file_url: res.data.file_url,
      transcript: "",
      summary: "",
    };
    setNoteDetail((prev) => ({
      ...prev,
      audio_note: [newAudioItem, ...prev.audio_note],
    }));

    setIsUploading(false);
  };

  const confirmDelete = (audioId) => {
    setSelectedAudioId(audioId);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteAudioApi(selectedAudioId);
    setIsDeleting(false);
    if (res.data) {
      setIsDialogOpen(false);
      notify("success", "Audio deleted!", "", "var(--color-silver-tree)");
      setNoteDetail((prev) => ({
        ...prev,
        audio_note: prev.audio_note.filter(
          (audio) => audio.id !== selectedAudioId,
        ),
      }));
    } else {
      notify("error", "Delete audio failed", "", "var(--color-crimson-red)");
    }
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
        <IconButton
          src={RecordIcon}
          onClick={() => setShowRecorder(true)}
          disabled={permission === "read"}
          data-tooltip-id="disable-record"
          data-tooltip-content="You cannot edit this note"
        />
        {permission === "read" && (
          <Tooltip
            id="disable-record"
            place="top"
            style={{
              backgroundColor: "#6368d1",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
            }}
            className="font-body"
          />
        )}

        <FileUploadInput
          src={UploadIcon}
          onChange={handleUploadAudio}
          accept="audio/*"
          disabled={permission === "read"}
        />
      </div>

      {isUploading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <MoonLoader size={30} color="var(--color-cornflower-blue)" />
        </div>
      )}

      <div className="no-scrollbar relative flex max-h-[642px] flex-col gap-[18px] overflow-y-auto">
        {noteDetail.audio_note ? (
          <>
            {noteDetail.audio_note.map((audio, index) => (
              <AudioItem
                key={audio.id}
                setNoteDetail={setNoteDetail}
                audio={audio}
                confirmDelete={confirmDelete}
                permission={permission}
              />
            ))}
          </>
        ) : (
          <AudioItemSkeleton />
        )}
      </div>

      <ConfirmDialog
        isOpen={isDialogOpen}
        title="Delete Audio"
        message="Do you really want to delete this audio recording?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default AudioNotes;
