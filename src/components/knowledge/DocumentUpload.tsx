
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  onDocumentProcessed: (knowledgeBlocks: any[]) => void;
  onClose: () => void;
}

interface ProcessingState {
  status: "idle" | "uploading" | "processing" | "complete" | "error";
  progress: number;
  message: string;
  generatedBlocks?: any[];
}

export const DocumentUpload = ({ onDocumentProcessed, onClose }: DocumentUploadProps) => {
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: "idle",
    progress: 0,
    message: "",
  });

  const processDocument = async (file: File) => {
    setProcessingState({
      status: "uploading",
      progress: 10,
      message: "Uploading document...",
    });

    try {
      // Extract text from document
      let extractedText = "";
      
      if (file.type === "application/pdf") {
        extractedText = await extractTextFromPDF(file);
      } else if (file.type.includes("document") || file.name.endsWith('.docx')) {
        extractedText = await extractTextFromWord(file);
      } else {
        throw new Error("Unsupported file format");
      }

      setProcessingState({
        status: "processing",
        progress: 50,
        message: "Processing content with AI...",
      });

      // Simulate AI processing (in a real app, this would call an AI API)
      const generatedBlocks = await processWithAI(extractedText, file.name);

      setProcessingState({
        status: "complete",
        progress: 100,
        message: `Generated ${generatedBlocks.length} knowledge blocks`,
        generatedBlocks,
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

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // This is a simplified implementation
    // In a real app, you'd use pdfjs-dist properly
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Simulate PDF text extraction
        resolve(`Sample extracted text from ${file.name}. This would contain the actual PDF content in a real implementation.`);
      };
      reader.readAsText(file);
    });
  };

  const extractTextFromWord = async (file: File): Promise<string> => {
    // This is a simplified implementation
    // In a real app, you'd use mammoth.js properly
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Simulate Word document text extraction
        resolve(`Sample extracted text from ${file.name}. This would contain the actual Word document content in a real implementation.`);
      };
      reader.readAsText(file);
    });
  };

  const processWithAI = async (text: string, filename: string): Promise<any[]> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would call an AI API
    // For now, we'll generate sample knowledge blocks
    return [
      {
        title: `Key Information from ${filename}`,
        content: `This is AI-generated content based on the document analysis. The original text would be processed to extract key information, policies, and procedures.`,
        category: "property" as const,
        source: {
          filename,
          uploadedAt: new Date().toISOString(),
          generatedByAI: true,
        },
      },
      {
        title: `Policies from ${filename}`,
        content: `AI-extracted policy information from the uploaded document. This would contain specific policies and guidelines found in the original document.`,
        category: "policies" as const,
        source: {
          filename,
          uploadedAt: new Date().toISOString(),
          generatedByAI: true,
        },
      },
    ];
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
    },
    maxFiles: 1,
    disabled: processingState.status === "processing" || processingState.status === "uploading",
  });

  const handleConfirm = () => {
    if (processingState.generatedBlocks) {
      onDocumentProcessed(processingState.generatedBlocks);
      onClose();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Upload Document</CardTitle>
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
              {isDragActive ? "Drop your document here" : "Upload a document"}
            </h3>
            <p className="text-gray-500 mb-4">
              Drag and drop a PDF or Word document, or click to browse
            </p>
            <p className="text-sm text-gray-400">
              Supported formats: PDF, DOC, DOCX (Max 10MB)
            </p>
          </div>
        )}

        {(processingState.status === "uploading" || processingState.status === "processing") && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{processingState.message}</span>
            </div>
            <Progress value={processingState.progress} className="w-full" />
          </div>
        )}

        {processingState.status === "complete" && processingState.generatedBlocks && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">{processingState.message}</span>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Preview Generated Knowledge Blocks:</h4>
              {processingState.generatedBlocks.map((block, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-medium">{block.title}</h5>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        AI Generated
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">{block.content}</p>
                    <div className="mt-2 text-xs text-gray-400">
                      Category: {block.category} • Source: {block.source.filename}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

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
