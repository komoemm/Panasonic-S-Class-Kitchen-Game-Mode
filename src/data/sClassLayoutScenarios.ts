import type { PlanLayoutId } from '../types';
import { PLAN_LAYOUTS } from './configOptions';

export type LayoutScenario = {
  readonly id: string;
  readonly layoutId: PlanLayoutId;
  readonly requirementKeys: readonly string[];
  readonly questionKey: string;
  readonly choices: readonly { readonly id: PlanLayoutId; readonly labelKey: string }[];
  readonly rationaleKey: string;
  readonly points: number;
};

// Reuse configurator names; facing is a distractor, not a validated catalog preview.
const CHOICES = PLAN_LAYOUTS.filter((layout) => layout.id !== 'island')
  .map((layout) => ({ id: layout.id, labelKey: layout.nameKey }));

export const LAYOUT_SCENARIOS: readonly LayoutScenario[] = [
  {
    id: 'straight-wall', layoutId: 'type-i',
    requirementKeys: ['game_scenario_i_requirement'], questionKey: 'game_scenario_question',
    choices: CHOICES, rationaleKey: 'game_scenario_i_rationale', points: 100,
  },
  {
    id: 'parallel-rows', layoutId: 'type-ii',
    requirementKeys: ['game_scenario_ii_requirement'], questionKey: 'game_scenario_question',
    choices: CHOICES, rationaleKey: 'game_scenario_ii_rationale', points: 100,
  },
  {
    id: 'connected-l', layoutId: 'type-l',
    requirementKeys: ['game_scenario_l_requirement'], questionKey: 'game_scenario_question',
    choices: CHOICES, rationaleKey: 'game_scenario_l_rationale', points: 100,
  },
];
