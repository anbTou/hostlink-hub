
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X, CheckCircle, AlertCircle, Brain, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIProcessingService } from "@/services/aiProcessingService";
import { KnowledgeBlock, AIProcessingResult, ContentGap } from "@/types/property-knowledge";

interface EnhancedDocumentUploadProps {
  onDocumentProcessed: (result: AIProcessingResult) => void;
  onClose: () => void;
  propertyType?: string;
}

interface ProcessingState {
  status: "idle" | "uploading" | "processing" | "complete" | "error";
  progress: number;
  message: string;
  result?: AIProcessingResult;
}

export const EnhancedDocumentUpload = ({ 
  onDocumentProcessed, 
  onClose, 
  propertyType = "villa" 
}: EnhancedDocumentUploadProps) => {
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: "idle",
    progress: 0,
    message: "",
  });

  const aiService = AIProcessingService.getInstance();

  const processDocument = async (file: File) => {
    setProcessingState({
      status: "uploading",
      progress: 10,
      message: "Uploading and analyzing document...",
    });

    try {
      setProcessingState({
        status: "processing",
        progress: 50,
        message: "AI is extracting and categorizing content...",
      });

      const result = await aiService.processDocument(file, propertyType);

      setProcessingState({
        status: "complete",
        progress: 100,
        message: `Analysis complete! Generated ${result.extractedBlocks.length} knowledge blocks`,
        result,
      });

    } catch (error) {
      console.error("Error processing document:", error);
      setProcessingState({
        status: "error",
        progress: 0,
        message: error instanceof Error ? error.message : "Failed to process document",
      });
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processDocument(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    disabled: processingState.status === "processing" || processingState.status === "uploading",
  });

  const handleConfirm = () => {
    if (processingState.result) {
      onDocumentProcessed(processingState.result);
      onClose();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getGapImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'text-red-600';
      case 'important': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Document Processing
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {processingState.status === "idle" && (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">
              {isDragActive ? "Drop your document here" : "Upload Property Documents"}
            </h3>
            <p className="text-gray-500 mb-4">
              AI will automatically extract and organize information into guest-friendly content
            </p>
            <p className="text-sm text-gray-400">
              Supported: PDF, DOC, DOCX, Images, TXT (Max 10MB)
            </p>
          </div>
        )}

        {(processingState.status === "uploading" || processingState.status === "processing") && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-medium">{processingState.message}</span>
            </div>
            <Progress value={processingState.progress} className="w-full" />
          </div>
        )}

        {processingState.status === "complete" && processingState.result && (
          <div className="space-y-6">
            {/* Processing Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-green-200">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">{processingState.result.extractedBlocks.length}</div>
                      <div className="text-sm text-gray-600">Knowledge Blocks</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">{processingState.result.qualityScore}%</div>
                      <div className="text-sm text-gray-600">Quality Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-yellow-200">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">{processingState.result.detectedGaps.length}</div>
                      <div className="text-sm text-gray-600">Content Gaps</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Generated Knowledge Blocks */}
            <div className="space-y-3">
              <h4 className="font-medium">Generated Knowledge Blocks:</h4>
              <div className="grid gap-3 max-h-60 overflow-y-auto">
                {processingState.result.extractedBlocks.map((block, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium">{block.title}</h5>
                        <div className="flex gap-2">
                          <Badge variant="outline" className={getPriorityColor(block.priority)}>
                            {block.priority}
                          </Badge>
                          <Badge variant="outline">
                            {Math.round((block.aiConfidence || 0) * 100)}% confident
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{block.content}</p>
                      <div className="mt-2 flex gap-1">
                        {block.tags?.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Content Gaps */}
            {processingState.result.detectedGaps.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Identified Content Gaps:</h4>
                <div className="space-y-2">
                  {processingState.result.detectedGaps.map((gap, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                      <AlertTriangle className={cn("h-4 w-4 mt-0.5", getGapImportanceColor(gap.importance))} />
                      <div className="flex-1">
                        <div className="font-medium capitalize">{gap.category}</div>
                        <div className="text-sm text-gray-600">{gap.description}</div>
                        {gap.suggestedContent && (
                          <div className="text-xs text-gray-500 mt-1">{gap.suggestedContent}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Suggestions */}
            {processingState.result.suggestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">AI Suggestions:</h4>
                <div className="space-y-2">
                  {processingState.result.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleConfirm}>
                Add Knowledge Blocks
              </Button>
            </div>
          </div>
        )}

        {processingState.status === "error" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error: {processingState.message}</span>
            </div>
            <Button onClick={() => setProcessingState({ status: "idle", progress: 0, message: "" })}>
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
