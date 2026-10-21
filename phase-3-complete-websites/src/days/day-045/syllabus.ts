/** Day 045 · Lingua Lane · the A1 to B2 syllabus. "{L}" is replaced with the language name. Ten weekly outcomes per level. */
export interface Level { code: string; name: string; blurb: string; short: string; weeks: string[] }
export const LEVELS: Level[] = [
  { code: 'A1', name: 'Beginner', short: 'Greetings, numbers and simple everyday phrases.', blurb: 'No {L} needed. By the end you can handle first conversations and simple everyday situations.', weeks: [
    'Say hello, goodbye and introduce yourself', 'Count to 100 and give your phone number', 'Order a drink and a snack', 'Talk about your family and friends', 'Tell the time and make plans',
    'Describe where you live', 'Ask for and give simple directions', 'Shop for food and clothes', 'Talk about your daily routine', 'Mini-challenge: a five-minute conversation in {L}' ] },
  { code: 'A2', name: 'Elementary', short: 'Talk about your day, past events and plans.', blurb: 'You know the basics. Now you will talk about the past, the future and the things you like.', weeks: [
    'Describe what you did at the weekend', 'Talk about your job or studies', 'Make and accept invitations', 'Book a hotel or a table', 'Describe people and places in detail',
    'Talk about health and see a pharmacist', 'Compare things and give simple opinions', 'Plan a trip and buy tickets', 'Tell a short story about your past', 'Mini-challenge: plan a day out together in {L}' ] },
  { code: 'B1', name: 'Intermediate', short: 'Handle most situations when travelling or working.', blurb: 'You can cope with most situations. Weeks are built around real conversations and listening.', weeks: [
    'Talk about experiences and ambitions', 'Follow a short news story', 'Give advice and make suggestions', 'Solve problems on the phone', 'Describe a film, book or series',
    'Take part in a work meeting', 'Talk about hypothetical situations', 'Write a clear email or message', 'Explain a process step by step', 'Mini-challenge: a ten-minute discussion in {L}' ] },
  { code: 'B2', name: 'Upper-intermediate', short: 'Discuss ideas and opinions with fluency and nuance.', blurb: 'Fluent, natural and spontaneous. You argue a point, understand native speed and write with confidence.', weeks: [
    'Argue a point and respond to counter-arguments', 'Understand native-speed radio and podcasts', 'Discuss culture, politics and society', 'Use idioms and natural expressions', 'Present an idea to a group',
    'Read and discuss an article in depth', 'Negotiate and persuade', 'Write a formal letter or report', 'Handle misunderstandings gracefully', 'Mini-challenge: a debate in {L}' ] },
];
export const HELLO: Record<string, string> = { spanish: 'OH-lah', french: 'bon-ZHOOR', german: 'HAH-loh', italian: 'CHOW', japanese: 'koh-NEE-chee-wah', mandarin: 'nee HOW', portuguese: 'oh-LAH', arabic: 'MAR-ha-ba' };
export const LANG_CODE: Record<string, string> = { spanish: 'es', french: 'fr', german: 'de', italian: 'it', japanese: 'ja', mandarin: 'zh', portuguese: 'pt', arabic: 'ar' };
