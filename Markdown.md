את/ה מודל שפה בכיר בתפקיד: Senior Full-Stack Product Engineer (React/TypeScript/Gemini SDK).
מטרת המשימה: יישום פיצ'רים אסטרטגיים דחופים (שלב 1) במוצר Flow-it-Prompter, תוך שימוש מרבי בקידוד ובשדרוג הקוד הקיים.
קהל יעד: צוות הפיתוח של GenSpark.
שפה מועדפת: עברית, עם תבניות קוד ב-TypeScript/React/Tailwind CSS.
מצב חשיבה ({THINKING_MODE}): Tree of Thoughts (בצע ניתוח מעמיק לפני כתיבת קוד).

הקשר רלוונטי:
המוצר הקיים הוא Flow-it-Prompter, כלי לזיקוק פרומפטים (Quick/Deep mode) שנבנה ב-React/TS ומשתמש ב-Gemini-2.5-flash. המטרה היא להפוך אותו מכלי "זיקוק" ל"פלטפורמת הנדסת פרומפטים מונעת-איכות וציות" (GenSpark 2.0).

נתונים/מקורות זמינים (קוד המקור):
[הקוד המלא של כל הקבצים שסופקו (App.tsx, services/geminiService.ts, types.ts, i18n.ts, components/*)]
*מקורות קריטיים לשדרוג:* `services/geminiService.ts` ו-`i18n.ts`.

הנחיות כתיבה וסגנון:
- טון: ענייני, מדויק, וממוקד-פתרונות.
- סגנון: TypeScript/React Functional Components, קוד נקי (Clean Code), שימוש מלא ב-Tailwind CSS להחלפות UI.

מגבלות ודרישות:
- אילוצים: חובה לשמר את התשתית הקיימת (I18N, Local Storage, React Hooks).
- גבולות אי-ביצוע (NON_GOALS): אין לשנות את שם ה-API Key או את גרסת ה-Gemini (להישאר עם `gemini-2.5-flash`).
- מדיניות ציטוטים/ייחוס: לצטט את שמות הקבצים והפונקציות המקוריות בעת השדרוג.

**שלב יישום 1 (Priority Features):**
יש להתמקד ביישום 3 הפיצ'רים עם היחס הטוב ביותר בין השפעה/מורכבות (כפי שנותח):
1. **Visual GenSpark 2.0 Template Builder (הנגשת Deep Mode):**
2. **Model/Tool Specific Optimizer (דיוק AI):**
3. **Ethical & Compliance Audit Dashboard - MVP (ציות):**

פורמט יציאה נדרש:
הפלט יחולק ל-3 חלקים בפורמט Markdown.

---
### תהליך עבודה חובה:
1.  **ניתוח תלות:** נתח/י את הקוד הקיים וציין/י במפורש אילו קבצים דורשים שינוי לכל אחד מ-3 הפיצ'רים הנבחרים.
2.  **יצירת סכמה:** הגדר/י את ה-TypeScript Interfaces הנדרשים עבור הנתונים החדשים (למשל, `TargetModel` ושינוי ל-`Prompt` הקיים).
3.  **יישום קוד (קצר):** ספק/י את עדכוני הקוד הממוקדים (Patch) לקבצים המרכזיים (במיוחד `services/geminiService.ts` ו-`i18n.ts`), כולל תרגומים חדשים.
4.  **מטא-תגובה:** הצג/י את תוכנית ה-Rollout לשלב 1.
---

### חלק 1: תוכנית יישום ממוקדת (שלב 1)

בצע/י ניתוח תלות ובנה/י רשימת שינויים היררכית ל-3 הפיצ'רים:

| פיצ'ר (GenSpark 2.0) | קבצים לשינוי (צמצום מרבי) | לוגיקה מרכזית |
| :--- | :--- | :--- |
| **Model/Tool Optimizer (#6)** | `types.ts`, `i18n.ts`, `services/geminiService.ts`, `App.tsx`, `components/PromptEditor.tsx` | הוספת `targetModel` ל-State; הטמעת פקודת `TARGET_MODEL` ב-`systemInstruction`; הוספת UI לבחירת המודל. |
| **Ethical Audit Dashboard MVP (#5)** | `types.ts`, `services/geminiService.ts`, `App.tsx`, `components/OutputDisplay.tsx` | הרחבת `HistoryItem` לשמירת `alignment_notes`. שדרוג `geminiService` לבקש ולהחזיר JSON ב-`Deep Mode`. הצגת ההערות לצד הפלט. |
| **Visual Template Builder (#3)** | `i18n.ts`, `App.tsx`, `components/PromptEditor.tsx`, קומפוננטה חדשה: `components/TemplateBuilder.tsx` | יצירת UI חלופי ב-Deep Mode הממלא שדות קלט (Role, Task, Context וכו') במקום טקסט חופשי, ובניית ה-`userPrompt` מהשדות לפני השליחה ל-AI. |

---
### חלק 2: עדכוני קוד קריטיים (Patch)

#### 1. Model/Tool Specific Optimizer (#6) - **הושלם**
הפיצ'ר כבר מיושם בקוד הקיים. התיעוד להלן מאמת את היישום.

##### קובץ: `joyatech/prompter/Prompter-3b96aac78b014b1f2093351f728daa7c442b87a6/types.ts`
```typescript
// types.ts (Patch: הוספת TargetModel)
export type Language = 'en' | 'he';
export type Mode = 'quick' | 'deep';
export type TargetModel = 'Gemini-Ultra' | 'Code-Interpreter' | 'Imagen' | 'Generic-LLM'; // שדרוג: סוגי מודלים

export interface Prompt {
  id: string;
  name: string;
  text: string;
}

export interface HistoryItem {
  id: string;
  prompt: string;
  response: string;
  timestamp: Date;
  alignment_notes?: string; // חדש: לצורך Ethical Audit MVP
}
```

##### קובץ: `joyatech/prompter/Prompter-3b96aac78b014b1f2093351f728daa7c442b87a6/i18n.ts`
```typescript
// i18n.ts (Patch: הוספת תרגומים עבור בחירת מודל)
// ... (תוך שמירה על המבנה הקיים)
const translations = {
  en: {
    // ... (keys קיימים)
    target_model_label: 'Optimize for:',
    model_generic: 'Generic LLM',
    model_gemini_ultra: 'Gemini-Ultra',
    model_code_interpreter: 'Code-Interpreter',
    model_imagen: 'Imagen',
  },
  he: {
    // ... (keys קיימים)
    target_model_label: 'בצע אופטימיזציה עבור:',
    model_generic: 'LLM גנרי',
    model_gemini_ultra: 'Gemini-Ultra',
    model_code_interpreter: 'Code-Interpreter',
    model_imagen: 'Imagen',
  },
};
```
---
#### 2. Ethical & Compliance Audit Dashboard - MVP (#5)

##### קובץ: `joyatech/prompter/Prompter-3b96aac78b014b1f2093351f728daa7c442b87a6/services/geminiService.ts`
```typescript
// services/geminiService.ts (Patch: בקשת JSON ב-Deep Mode)

// עדכון לפונקציה הקיימת getSystemInstruction
const getSystemInstruction = (lang: Language, mode: Mode, targetModel: TargetModel): string => {
  // ... (languageInstruction ו-targetModelInstruction נשארים זהים)

  const modeInstruction = mode === 'deep' 
    ? `
      Deep Analysis Mode:
      Your response MUST be a valid JSON object. Do not include any text outside of the JSON structure.
      The JSON object must conform to this exact schema:
      {
        "refined_prompt": "The detailed, robust, and structured prompt text.",
        "alignment_notes": "A brief analysis of potential ethical issues, biases, or policy violations in the original prompt. If none, state 'No issues found'."
      }
    `
    : `
      Quick Refine Mode:
      Return ONLY the refined prompt text, with no preamble or explanations.
    `;
  
  const targetModelInstruction = `CRITICAL: The final prompt must be optimized for the following target model or tool: ${targetModel}. Adjust syntax, structure, and instructions accordingly.`;
  const languageInstruction = lang === 'he' ? "..." : "...";


  return `You are an expert prompt engineering assistant...
    ${languageInstruction}
    ${targetModelInstruction}
    ${modeInstruction}
  `;
};

// עדכון לפונקציה הקיימת refinePrompt
export const refinePrompt = async (
  prompt: string,
  lang: Language,
  mode: Mode,
  targetModel: TargetModel
): Promise<string | { refined_prompt: string; alignment_notes: string }> => {
  // ... (בדיקת קלט)

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: getSystemInstruction(lang, mode, targetModel),
            temperature: 0.7,
            // הנחיה קריטית למודל להחזיר JSON במצב עומק
            ...(mode === 'deep' && { responseMimeType: "application/json" }),
        }
    });

    const responseText = response.text;

    if (!responseText) {
        throw new Error("Failed to get a response from the model.");
    }
    
    if (mode === 'deep') {
        // נתח את ה-JSON והחזר אובייקט
        const parsed = JSON.parse(responseText);
        return {
            refined_prompt: parsed.refined_prompt || '',
            alignment_notes: parsed.alignment_notes || 'Analysis not provided.'
        };
    }

    // במצב מהיר, החזר טקסט רגיל
    return responseText.trim();
  } catch (error) {
    // ... (טיפול בשגיאות)
    if (mode === 'deep' && error instanceof SyntaxError) {
        throw new Error("Deep Mode failed to return valid JSON. Please try again.");
    }
    throw new Error("Failed to refine prompt...");
  }
};

```

##### קובץ: `joyatech/prompter/Prompter-3b96aac78b014b1f2093351f728daa7c442b87a6/App.tsx`
```typescript
// App.tsx (Patch: טיפול בתגובת JSON)
  const handleRefine = useCallback(async () => {
    // ... (קוד קיים)
    try {
      const result = await refinePrompt(userPrompt, currentLang, mode, targetModel);
      
      let promptResponse: string;
      let notes: string | undefined = undefined;

      if (typeof result === 'object' && mode === 'deep') {
        promptResponse = result.refined_prompt;
        notes = result.alignment_notes;
        setRefinedPrompt(promptResponse); // עדכן גם את הפלט המוצג
      } else {
        promptResponse = result as string;
        setRefinedPrompt(promptResponse);
      }

      // Add to history with optional notes
      const newHistoryItem: HistoryItem = {
          id: uuidv4(),
          prompt: userPrompt,
          response: promptResponse,
          timestamp: new Date(),
          ...(notes && { alignment_notes: notes }), // הוסף רק אם קיים
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 49)]);
    } catch (e: any) {
      setError(e.message || t('error_generic'));
    } finally {
      setIsLoading(false);
    }
  }, [userPrompt, currentLang, mode, targetModel, t]);
```
---
### חלק 3: תוכנית Rollout (שלב 1)

**מטרה:** יישום הדרגתי ובטוח של 3 פיצ'רי הליבה, תוך מתן ערך מיידי למשתמשים.

**סדר עדיפות:**
1.  **Model/Tool Specific Optimizer (השפעה מיידית על איכות):**
    *   **Commit 1 (Data Structure):** עדכון `types.ts` עם `TargetModel`.
    *   **Commit 2 (I18N & Core Logic):** הוספת תרגומים ל-`i18n.ts` ואימות הלוגיקה ב-`services/geminiService.ts`.
    *   **Commit 3 (State & UI):** הוספת ה-State ל-`App.tsx` ואימות רכיב ה-Dropdown ב-`components/PromptEditor.tsx`.
    *   **תוצאה:** המשתמשים יכולים לבחור מודל יעד ולקבל פרומפט מדויק יותר. **הפיצ'ר פעיל במלואו.**

2.  **Ethical & Compliance Audit Dashboard - MVP (בניית אמון וציות):**
    *   **Commit 1 (Data Structure):** עדכון `HistoryItem` ב-`types.ts` עם `alignment_notes`.
    *   **Commit 2 (Core Logic):** שדרוג `refinePrompt` ב-`services/geminiService.ts` כך שב-`Deep Mode` הוא יבקש, ינתח ויחזיר JSON המכיל `alignment_notes`.
    *   **Commit 3 (State Management):** עדכון `handleRefine` ב-`App.tsx` כך שישמור את ה-`alignment_notes` בתוך פריט ההיסטוריה לאחר פירוק אובייקט התגובה.
    *   **Commit 4 (UI):** עדכון `components/History.tsx` (או `OutputDisplay.tsx`) כך שיציג אייקון או תווית ליד פריט היסטוריה שיש לו `alignment_notes`, ובמעבר עכבר (Tooltip) יציג את תוכן ההערות.
    *   **תוצאה:** מתן שקיפות למשתמשים לגבי שיקולי אתיקה וציות בפרומפטים שלהם.

3.  **Visual GenSpark 2.0 Template Builder (שיפור חווית משתמש):**
    *   **Commit 1 (I18N):** הוספת כל התרגומים הנדרשים עבור השדות החדשים (Role, Task, Context וכו') ל-`i18n.ts`.
    *   **Commit 2 (Component):** בניית קומפוננטה חדשה `components/TemplateBuilder.tsx` עם שדות קלט מובנים (textarea לכל שדה).
    *   **Commit 3 (State & Logic):** הוספת State לניהול שדות התבנית ב-`App.tsx` (למשל `const [templateFields, setTemplateFields] = useState({ role: '', task: ''... })`). עדכון `handleRefine` כך שיבנה את `userPrompt` מהשדות המלאים כאשר `mode === 'deep'`.
    *   **Commit 4 (Integration):** עדכון `components/PromptEditor.tsx` כך שיציג את `TemplateBuilder` במקום ה-textarea הראשי באופן תנאי כאשר `mode === 'deep'`.
    *   **תוצאה:** חווית `Deep Mode` מודרכת ואינטואיטיבית יותר, המפחיתה עומס קוגניטיבי על המשתמש ומעודדת יצירת פרומפטים מובנים ואיכותיים.
