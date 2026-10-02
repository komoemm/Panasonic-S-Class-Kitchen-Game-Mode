import type { ProductInstallationTask } from '../types';

export type KnowledgeQuestion = {
  readonly id: string;
  readonly productId: ProductInstallationTask['productId'];
  readonly titleKey: string;
  readonly learningPointKeys: readonly string[];
  readonly questionKey: string;
  readonly answers: readonly { id: string; labelKey: string; correct: boolean }[];
  readonly points: number;
};

// Customer-approved catalog summaries. Review docs/S_CLASS_GAME_CONTENT.md when updating content.
export const KNOWLEDGE_QUESTIONS: readonly KnowledgeQuestion[] = [
  {
    id: 'sink-cleaning', productId: 'sink', titleKey: 'game_knowledge_sink_title',
    learningPointKeys: ['game_knowledge_sink_construction', 'game_knowledge_sink_material', 'game_knowledge_sink_hardness'],
    questionKey: 'game_knowledge_sink_question',
    answers: [
      { id: 'a', labelKey: 'game_knowledge_sink_answer_a', correct: false },
      { id: 'b', labelKey: 'game_knowledge_sink_answer_b', correct: true },
      { id: 'c', labelKey: 'game_knowledge_sink_answer_c', correct: false },
      { id: 'd', labelKey: 'game_knowledge_sink_answer_d', correct: false },
    ],
    points: 100,
  },
  {
    id: 'cooktop-layout', productId: 'cooktop', titleKey: 'game_knowledge_cooktop_title',
    learningPointKeys: ['game_knowledge_cooktop_zones', 'game_knowledge_cooktop_access', 'game_knowledge_cooktop_preparation', 'game_knowledge_cooktop_wiping'],
    questionKey: 'game_knowledge_cooktop_question',
    answers: [
      { id: 'a', labelKey: 'game_knowledge_cooktop_answer_a', correct: true },
      { id: 'b', labelKey: 'game_knowledge_cooktop_answer_b', correct: false },
      { id: 'c', labelKey: 'game_knowledge_cooktop_answer_c', correct: false },
      { id: 'd', labelKey: 'game_knowledge_cooktop_answer_d', correct: false },
    ],
    points: 100,
  },
  {
    id: 'hood-plate-cleaning', productId: 'rangeHood', titleKey: 'game_knowledge_hood_title',
    learningPointKeys: ['game_knowledge_hood_maintenance', 'game_knowledge_hood_fan', 'game_knowledge_hood_plate', 'game_knowledge_hood_surface'],
    questionKey: 'game_knowledge_hood_question',
    answers: [
      { id: 'a', labelKey: 'game_knowledge_hood_answer_a', correct: false },
      { id: 'b', labelKey: 'game_knowledge_hood_answer_b', correct: false },
      { id: 'c', labelKey: 'game_knowledge_hood_answer_c', correct: true },
      { id: 'd', labelKey: 'game_knowledge_hood_answer_d', correct: false },
    ],
    points: 100,
  },
];
