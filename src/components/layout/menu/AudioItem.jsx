import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, Trash2 } from "lucide-react";
import TextArea from "../../ui/inputs/TextArea";
import { motion } from "framer-motion";
import { audioExpandVariants } from "../../../utils/motion";
import IconButton from "../../ui/buttons/IconButton";
import PrimaryButton from "../../ui/buttons/PrimaryButton";
import WaveformPlayer from "../../ui/WaveformPlayer";
import { Tooltip } from "react-tooltip";
import Summary from "../../ui/Summary";
import {
  createAudioNoteSummaryApi,
  updateSummaryApi,
  updateTranscriptApi,
} from "../../../services/api.service";
import notify from "../../ui/CustomToast";
import { useForm } from "react-hook-form";

const AudioItem = ({ setNoteDetail, audio, handleDelete, permission }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [showTranscript, setShowTranscript] = useState(false);

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    reset,
    getValues,
    formState: { dirtyFields },
  } = useForm({
    defaultValues: {
      [`audio_transcript_${audio.id}`]: audio.transcript?.content,
      [`audio_summary_${audio.id}`]: audio.summary?.summary_text,
    },
  });

  useEffect(() => {
    reset({
      [`audio_transcript_${audio.id}`]: audio.transcript?.content,
      [`audio_summary_${audio.id}`]: audio.summary?.summary_text,
    });
  }, [audio]);

  const handleCreateAudioNoteSummary = async () => {
    setIsSummarizing(true);
    setShowSummary(false);
    const summary = await createAudioNoteSummaryApi(audio.id);
    if (!summary.data) {
      notify("error", "Create summary failed", "", "var(--color-crimson-red)");
      setIsSummarizing(false);
      return;
    }
    notify("success", "Summary created!", "", "var(--color-silver-tree)");
    reset({
      [`audio_summary_${audio.id}`]: summary.data.summary,
    });
    setNoteDetail((prev) => ({
      ...prev,
      audio_note: prev.audio_note.map((a) =>
        a.id === audio.id
          ? {
              ...a,
              summary: summary.data,
            }
          : a,
      ),
    }));
    setIsSummarizing(false);
    setShowSummary(true);
  };

  const handleUpdateSummary = async () => {
    const updateSummary = getValues(`audio_summary_${audio.id}`);
    setIsSaving(true);
    const res = await updateSummaryApi(audio.summary?.id, updateSummary);
    if (!res.data) {
      notify("error", "Update summary failed", "", "var(--color-crimson-red)");
      setIsSaving(false);
      return;
    }
    notify("success", "Summary updated!", "", "var(--color-silver-tree)");
    setNoteDetail((prev) => ({
      ...prev,
      audio_note: prev.audio_note.map((a) =>
        a.id === audio.id
          ? {
              ...a,
              summary: {
                id: audio.summary?.id,
                summary_text: updateSummary,
              },
            }
          : a,
      ),
    }));
    setIsSaving(false);
  };

  const handleUpdateTranscript = async () => {
    const updateTranscript = getValues(`audio_transcript_${audio.id}`);
    setIsSaving(true);
    const res = await updateTranscriptApi(updateTranscript, audio.transcript?.id);
    if (!res.data) {
      notify(
        "error",
        "Update transcript failed",
        "",
        "var(--color-crimson-red)",
      );
      setIsSaving(false);
      return;
    }
    notify("success", "Transcript updated!", "", "var(--color-silver-tree)");
    setNoteDetail((prev) => ({
      ...prev,
      audio_note: prev.audio_note.map((a) =>
        a.id === audio.id
          ? {
              ...a,
              transcript: {
                id: audio.transcript?.id,
                content: updateTranscript,
              },
            }
          : a,
      ),
    }));
    setIsSaving(false);
  };

  return (
    <div key={audio.id}>
      <div className="flex items-center gap-10">
        <WaveformPlayer audioUrl={audio.file_url} audioTitle={audio.name} />

        <div className="ml-auto flex items-center gap-5">
          <IconButton
            size="w-5 h-5"
            icon={isExpanded ? ChevronUp : ChevronDown}
            onClick={() => setIsExpanded(!isExpanded)}
          />
          {permission === "owner" && (
            <IconButton
              size="w-5 h-5"
              icon={Trash2}
              onClick={() => handleDelete(audio.id)}
            />
          )}
        </div>
      </div>

      <motion.div
        variants={audioExpandVariants}
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        className="overflow-hidden"
      >
        <div className="mt-4 border-t border-t-gray-200 px-3 py-2 dark:border-gray-100/20">
          {audio.transcript && (
            <div className="space-y-2">
              <div className="py-2">
                <IconButton
                  onClick={() => setShowTranscript(!showTranscript)}
                  icon={showTranscript ? ChevronUp : ChevronDown}
                  label="Transcript"
                />
                {showTranscript && (
                  <div className="mt-2 rounded-md border border-gray-200 p-3 dark:border-gray-100/20">
                    <TextArea
                      style="text-gravel h-auto"
                      {...register(`audio_transcript_${audio.id}`)}
                    />
                  </div>
                )}
              </div>
              {dirtyFields[`audio_transcript_${audio.id}`] && (
                <div className="ml-auto flex w-fit gap-4">
                  <PrimaryButton
                    onClick={() =>
                      reset({
                        [`audio_transcript_${audio.id}`]:
                          audio.transcript.content,
                      })
                    }
                    color="white"
                    label="Cancel"
                  />
                  <PrimaryButton
                    type="submit"
                    color="blue"
                    label="Save"
                    onClick={handleUpdateTranscript}
                    isProcessing={isSaving}
                  />
                </div>
              )}
            </div>
          )}

          {(showSummary || isSummarizing || audio.summary) && (
            <div className="space-y-2">
              <Summary
                customStyle="py-2"
                showSummary={showSummary}
                setShowSummary={setShowSummary}
                isSummarizing={isSummarizing}
                register={register}
                permission={permission}
                registerField={`audio_summary_${audio.id}`}
              />
              {dirtyFields[`audio_summary_${audio.id}`] && (
                <div className="ml-auto flex w-fit gap-4">
                  <PrimaryButton
                    onClick={() =>
                      reset({
                        [`audio_summary_${audio.id}`]:
                          audio.summary?.summary_text,
                      })
                    }
                    color="white"
                    label="Cancel"
                  />
                  <PrimaryButton
                    type="submit"
                    color="blue"
                    label="Save"
                    onClick={handleUpdateSummary}
                    isProcessing={isSaving}
                  />
                </div>
              )}
            </div>
          )}

          <div className="mt-2">
            <IconButton
              onClick={handleCreateAudioNoteSummary}
              size="w-5 h-5"
              icon={Sparkles}
              label={audio.summary ? "Resummarize" : "Summarize"}
              disabled={isSummarizing || permission === "read"}
              data-tooltip-id="disable-summary"
              data-tooltip-content="You cannot edit this note"
            />
            {permission === "read" && (
              <Tooltip
                id="disable-summary"
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
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AudioItem;
