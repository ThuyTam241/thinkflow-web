import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  Trash2,
} from "lucide-react";
import TextArea from "../../ui/inputs/TextArea";
import { motion } from "framer-motion";
import { audioExpandVariants } from "../../../utils/motion";
import IconButton from "../../ui/buttons/IconButton";
import WaveformPlayer from "../../ui/WaveformPlayer";

const AudioItem = ({
  audio,
  index,
  length,
  handleDelete,
  register,
  generateTranscript,
  generateSummary,
  isTranscripting,
  isSummarizing,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  return (
    <div key={audio.id}>
      <div className="flex items-center gap-10">
        <WaveformPlayer audioUrl={audio.file_url} length={length} index={index} />

        <div className="ml-auto flex items-center gap-5">
          <IconButton
            size="w-5 h-5"
            icon={isExpanded ? ChevronUp : ChevronDown}
            onClick={() => setIsExpanded(!isExpanded)}
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
        animate={isExpanded ? "expanded" : "collapsed"}
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
                  <TextArea {...register("summary")} disabled={isSummarizing} />
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
              label={audio.summary ? "Regenerate summary" : "Generate summary"}
              isProcessing={isSummarizing}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AudioItem;
