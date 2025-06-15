
import { KnowledgeBlock } from "@/types/property-knowledge";

export class KnowledgeConnector {
  private static instance: KnowledgeConnector;
  private knowledgeBlocks: KnowledgeBlock[] = [];

  static getInstance(): KnowledgeConnector {
    if (!KnowledgeConnector.instance) {
      KnowledgeConnector.instance = new KnowledgeConnector();
    }
    return KnowledgeConnector.instance;
  }

  updateKnowledgeBlocks(blocks: KnowledgeBlock[]) {
    this.knowledgeBlocks = blocks;
    this.notifyPropertyInfo();
  }

  getKnowledgeForPropertyInfo() {
    return {
      basic: this.getBlocksByCategory('property'),
      checkin: this.getBlocksByCategory('checkin'),
      accommodation: this.getBlocksByCategory('amenities'),
      amenities: this.getBlocksByCategory('amenities'),
      rules: this.getBlocksByCategory('policies'),
      services: this.getBlocksByCategory('custom'),
      local: this.getBlocksByCategory('local'),
      emergency: this.getBlocksByCategory('emergency'),
    };
  }

  private getBlocksByCategory(category: string): KnowledgeBlock[] {
    return this.knowledgeBlocks
      .filter(block => block.category === category && block.status === 'approved')
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
               (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
      });
  }

  private notifyPropertyInfo() {
    // In a real app, this would trigger updates to Property Info components
    window.dispatchEvent(new CustomEvent('knowledgeUpdated', {
      detail: this.getKnowledgeForPropertyInfo()
    }));
  }

  getPersonalizedContent(guestPersona: string, season: string): KnowledgeBlock[] {
    return this.knowledgeBlocks.filter(block => 
      (block.guestPersona === guestPersona || block.guestPersona === 'all') &&
      (block.seasonal === season || block.seasonal === 'all') &&
      block.status === 'approved'
    );
  }
}
