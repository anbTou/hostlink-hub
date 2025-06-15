
import { KnowledgeBlock, AIProcessingResult, ContentGap, PropertyTemplate } from "@/types/property-knowledge";

export class AIProcessingService {
  private static instance: AIProcessingService;

  static getInstance(): AIProcessingService {
    if (!AIProcessingService.instance) {
      AIProcessingService.instance = new AIProcessingService();
    }
    return AIProcessingService.instance;
  }

  async processDocument(file: File, propertyType?: string): Promise<AIProcessingResult> {
    console.log(`Processing document: ${file.name}`);
    
    // Extract text content
    const extractedText = await this.extractTextFromFile(file);
    
    // Simulate advanced AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const extractedBlocks = await this.generateKnowledgeBlocks(extractedText, file.name, propertyType);
    const detectedGaps = await this.analyzeContentGaps(extractedBlocks, propertyType);
    const qualityScore = this.calculateQualityScore(extractedBlocks);
    const suggestions = this.generateSuggestions(extractedBlocks, detectedGaps);

    return {
      extractedBlocks,
      detectedGaps,
      qualityScore,
      suggestions,
    };
  }

  private async extractTextFromFile(file: File): Promise<string> {
    if (file.type === "application/pdf") {
      return `Extracted PDF content from ${file.name}. This would contain actual PDF text extraction in a real implementation using libraries like pdf-parse or pdfjs-dist.`;
    } else if (file.type.includes("document") || file.name.endsWith('.docx')) {
      return `Extracted Word document content from ${file.name}. This would use mammoth.js or similar for actual document parsing.`;
    } else if (file.type.startsWith("image/")) {
      return `Extracted text from image ${file.name} using OCR. This would use services like Google Vision API or Tesseract.js.`;
    }
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(file);
    });
  }

  private async generateKnowledgeBlocks(content: string, filename: string, propertyType?: string): Promise<KnowledgeBlock[]> {
    // This would use actual AI API calls in production
    const blocks: KnowledgeBlock[] = [];
    
    // Simulate intelligent content categorization
    const categories = this.detectCategories(content, filename);
    
    for (const category of categories) {
      blocks.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: this.generateTitleForCategory(category, filename),
        content: this.generateContentForCategory(category, content),
        category: category as any,
        lastUpdated: "Just now",
        source: {
          filename,
          uploadedAt: new Date().toISOString(),
          generatedByAI: true,
        },
        tags: this.generateTags(category, content),
        status: "draft",
        guestPersona: "all",
        seasonal: "all",
        priority: this.determinePriority(category),
        aiConfidence: Math.random() * 0.3 + 0.7, // 70-100%
      });
    }

    return blocks;
  }

  private detectCategories(content: string, filename: string): string[] {
    const categories = [];
    const lowerContent = content.toLowerCase();
    const lowerFilename = filename.toLowerCase();

    if (lowerContent.includes('check') && (lowerContent.includes('in') || lowerContent.includes('arrival'))) {
      categories.push('checkin');
    }
    if (lowerContent.includes('rule') || lowerContent.includes('policy') || lowerContent.includes('not allowed')) {
      categories.push('policies');
    }
    if (lowerContent.includes('wifi') || lowerContent.includes('pool') || lowerContent.includes('kitchen')) {
      categories.push('amenities');
    }
    if (lowerContent.includes('restaurant') || lowerContent.includes('attraction') || lowerContent.includes('nearby')) {
      categories.push('local');
    }
    if (lowerContent.includes('emergency') || lowerContent.includes('safety') || lowerContent.includes('fire')) {
      categories.push('emergency');
    }
    if (categories.length === 0) {
      categories.push('property');
    }

    return categories;
  }

  private generateTitleForCategory(category: string, filename: string): string {
    const titles = {
      checkin: "Check-in Instructions",
      policies: "House Rules & Policies",
      amenities: "Property Amenities",
      local: "Local Area Information",
      emergency: "Emergency Information",
      safety: "Safety Guidelines",
      property: "Property Information",
    };
    
    return titles[category as keyof typeof titles] || `Information from ${filename}`;
  }

  private generateContentForCategory(category: string, originalContent: string): string {
    // In a real implementation, this would use AI to extract and reformat relevant content
    return `AI-processed content for ${category} category. Original content would be analyzed and reformatted into guest-friendly information here.`;
  }

  private generateTags(category: string, content: string): string[] {
    const baseTags = [category];
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('family')) baseTags.push('family-friendly');
    if (lowerContent.includes('business')) baseTags.push('business');
    if (lowerContent.includes('luxury')) baseTags.push('luxury');
    if (lowerContent.includes('budget')) baseTags.push('budget');
    
    return baseTags;
  }

  private determinePriority(category: string): "high" | "medium" | "low" {
    const highPriority = ['checkin', 'emergency', 'safety'];
    const mediumPriority = ['policies', 'amenities'];
    
    if (highPriority.includes(category)) return 'high';
    if (mediumPriority.includes(category)) return 'medium';
    return 'low';
  }

  private async analyzeContentGaps(blocks: KnowledgeBlock[], propertyType?: string): Promise<ContentGap[]> {
    const gaps: ContentGap[] = [];
    const existingCategories = new Set(blocks.map(block => block.category));
    
    const requiredCategories = ['checkin', 'policies', 'amenities', 'emergency'];
    
    for (const category of requiredCategories) {
      if (!existingCategories.has(category as any)) {
        gaps.push({
          category,
          description: `Missing ${category} information`,
          importance: category === 'emergency' ? 'critical' : 'important',
          suggestedContent: this.getSuggestedContentForCategory(category),
        });
      }
    }

    return gaps;
  }

  private getSuggestedContentForCategory(category: string): string {
    const suggestions = {
      checkin: "Add check-in time, lockbox code instructions, and arrival procedures",
      policies: "Include house rules, smoking policy, pet policy, and noise guidelines",
      amenities: "List all property amenities with usage instructions",
      emergency: "Provide emergency contact numbers and procedures",
    };
    
    return suggestions[category as keyof typeof suggestions] || "Add relevant information for this category";
  }

  private calculateQualityScore(blocks: KnowledgeBlock[]): number {
    let score = 0;
    const maxScore = 100;
    
    // Base score for having content
    score += Math.min(blocks.length * 15, 60);
    
    // Bonus for diversity of categories
    const uniqueCategories = new Set(blocks.map(block => block.category));
    score += uniqueCategories.size * 5;
    
    // Bonus for high confidence blocks
    const avgConfidence = blocks.reduce((sum, block) => sum + (block.aiConfidence || 0), 0) / blocks.length;
    score += avgConfidence * 20;
    
    return Math.min(score, maxScore);
  }

  private generateSuggestions(blocks: KnowledgeBlock[], gaps: ContentGap[]): string[] {
    const suggestions = [];
    
    if (gaps.length > 0) {
      suggestions.push(`Consider adding information about: ${gaps.map(gap => gap.category).join(', ')}`);
    }
    
    if (blocks.length < 5) {
      suggestions.push("Add more detailed information to provide comprehensive guest guidance");
    }
    
    const lowConfidenceBlocks = blocks.filter(block => (block.aiConfidence || 0) < 0.8);
    if (lowConfidenceBlocks.length > 0) {
      suggestions.push("Review AI-generated content for accuracy and completeness");
    }
    
    return suggestions;
  }
}
