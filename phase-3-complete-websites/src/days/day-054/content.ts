export const PROGRAMMES = [
  {
    number: '01',
    slug: 'future-ready-leadership',
    tag: 'Strategy & leadership',
    title: 'Future-Ready Leadership',
    summary: 'Help managers navigate change, make responsible decisions and turn strategic priorities into focused team action.',
    duration: 'Adaptable programme',
    format: 'Facilitated workshops, applied project and reflection',
    objectives: ['Frame complex decisions with greater clarity', 'Translate strategy into an achievable team brief', 'Use feedback to strengthen judgement and communication'],
    colour: 'blue',
  },
  {
    number: '02',
    slug: 'human-centred-digital-practice',
    tag: 'Technology & design',
    title: 'Human-Centred Digital Practice',
    summary: 'Build confidence in research, service design and responsible technology through a practical improvement brief.',
    duration: 'Adaptable programme',
    format: 'Guided research, studio sessions and project critique',
    objectives: ['Understand a real user or service need', 'Turn research into an evidence-led design decision', 'Evaluate digital ideas through a responsible-technology lens'],
    colour: 'soft',
  },
  {
    number: '03',
    slug: 'climate-ready-communities',
    tag: 'Sustainability & place',
    title: 'Climate-Ready Communities',
    summary: 'Explore how places adapt to change, then translate evidence into a grounded proposal for local action.',
    duration: 'Adaptable programme',
    format: 'Field inquiry, collaborative studio and action proposal',
    objectives: ['Investigate a place-based challenge from several perspectives', 'Connect evidence with practical constraints', 'Present a credible proposal for discussion and iteration'],
    colour: 'pale',
  },
] as const;

export const PRINCIPLES = [
  { number: '01', title: 'Begin with purpose', text: 'Learning starts with a clear question, a real audience and an outcome worth working towards.' },
  { number: '02', title: 'Learn through practice', text: 'Learners build, test and improve useful work instead of collecting disconnected information.' },
  { number: '03', title: 'Make progress visible', text: 'Frequent, achievable outputs create momentum and make feedback easier to use.' },
  { number: '04', title: 'Reflect with intention', text: 'Structured reflection helps learners recognise what changed and decide what to do next.' },
] as const;

export const RESOURCES = [
  { id: 'project-brief', type: 'Field note', read: '6 min', title: 'Turn a broad learning need into a useful project brief', text: 'Start with the decision or behaviour that needs to change, then define an outcome people can test and improve.' },
  { id: 'useful-feedback', type: 'Guide', read: '4 min', title: 'Make feedback easier to use', text: 'A three-part framework for asking for, sorting and applying constructive critique.' },
  { id: 'learning-week', type: 'Toolkit', read: '8 min', title: 'Plan a learning week people can finish', text: 'Work backwards from one visible outcome and protect the smallest meaningful block of focus time.' },
  { id: 'reflection-prompts', type: 'Prompt set', read: '5 min', title: 'Reflection prompts that lead to a useful next step', text: 'Move beyond “what went well” with questions that connect evidence, decisions and future action.' },
] as const;
